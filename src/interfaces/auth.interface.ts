import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface ResponseLogin {
  status: number;
  message: string;
  data: DataLogin | {};
}

export interface DataLogin {
  cookie: string;
  tokenData: TokenData;
  findUser: User;
}
