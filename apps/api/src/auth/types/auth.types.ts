import { USER_ROLE } from '@modules/users/constants';

import { SignUpBodyDTO, SignInBodyDTO } from '../dtos';

export type SignUpData = SignUpBodyDTO;
export type SignInData = SignInBodyDTO;

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserAuthData = {
  id: number;
  role: USER_ROLE;
};
