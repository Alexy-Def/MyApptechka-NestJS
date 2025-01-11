import { USER_ROLE } from '../constants';

export type UserDbDataById = {
  id: number;
  email: string;
  username: string;
  role: USER_ROLE;
  refreshToken: string | null;
};

export type UserDbDataByEmail = UserDbDataById & {
  password: string;
};

export type CreateUserData = Omit<UserDbDataByEmail, 'id' | 'refreshToken'>;
