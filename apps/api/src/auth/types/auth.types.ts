import { USER_ROLE } from '@modules/users/constants';

import { SignUpBodyDTO, SignInBodyDTO, SendSmsCodeBodyDTO, VerifyPhoneBodyDTO, ChangePasswordBodyDTO } from '../dtos';

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

export type VerifyPhoneData = VerifyPhoneBodyDTO & {
  verificationCode: number;
};

export type ChangePasswordData = ChangePasswordBodyDTO & {
  newPassword: string;
  confirmNewPassword: string;
};
