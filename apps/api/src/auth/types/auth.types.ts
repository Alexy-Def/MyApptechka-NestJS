import { USER_ROLE } from '@modules/users/constants';

import { SignUpBodyDTO, SignInBodyDTO, SendSmsCodeBodyDTO } from '../dtos';

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

export type SendSmsCodeData = SendSmsCodeBodyDTO;
export type ChangePasswordData = SendSmsCodeData & {
  newPassword: string;
  confirmNewPassword: string;
};
