import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { CreateLoginDto, CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataLogin, DataStoredInToken, ResponseLogin, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class AuthService extends Repository<UserEntity> {
  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    delete createUserData.password;

    return createUserData;
  }

  public async login(loginData: CreateLoginDto): Promise<ResponseLogin> {
    const findUser: User = await UserEntity.findOne({ where: { email: loginData.email } });
    let response: ResponseLogin;

    if (!findUser) {
      response = { status: 409, message: `Cet e-mail ${loginData.email} n'a pas été trouvé`, data: {} };
    } else {
      const isPasswordMatching: boolean = await compare(loginData.password, findUser.password);

      if (!isPasswordMatching) {
        response = { status: 409, message: 'Mot de passe incorrect !', data: {} };
      } else {
        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);

        delete findUser.password;

        await UserEntity.update(findUser.id, {
          isActif: true,
        });

        const data: DataLogin = { cookie, tokenData, findUser };

        response = { status: 200, message: 'login success', data };
      }
    }

    return response;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.update(findUser.id, {
      isActif: false,
    });

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 3600 * 8;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
