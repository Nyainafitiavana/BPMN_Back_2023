import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public address: string;

  @IsString()
  public phone: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsBoolean()
  public isManager: boolean;

  @IsBoolean()
  public isActif: boolean;
}
