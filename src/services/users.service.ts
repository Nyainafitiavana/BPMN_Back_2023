import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class UserService extends Repository<UserEntity> {
  public async findAllUser(limit: number, offset: number, key: string): Promise<{ user: User[]; count: number }> {
    if (key === '') {
      const [user, count]: [User[], number] = await UserEntity.createQueryBuilder('qb')
        .limit(limit ? limit : 0)
        .offset(offset ? offset : 0)
        .orderBy('qb.id', 'ASC')
        .getManyAndCount();

      return { user, count };
    } else {
      const { user, count } = await this.searchUser(limit, offset, key);
      return { user, count };
    }
  }

  public async searchUser(limit: number, offset: number, key: string): Promise<{ user: User[]; count: number }> {
    const [user, count]: [User[], number] = await UserEntity.createQueryBuilder('us')
      .where('LOWER(us.lastName) LIKE :nm', { nm: `%${key.toLowerCase()}%` })
      .orWhere('LOWER(us.firstName) LIKE :fn', { fn: `%${key.toLowerCase()}%` })
      .orWhere('LOWER(us.email) LIKE :em', { em: `%${key.toLowerCase()}%` })
      .orWhere('LOWER(us.address) LIKE :em', { em: `%${key.toLowerCase()}%` })
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .getManyAndCount();

    return { user, count };
  }
  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
