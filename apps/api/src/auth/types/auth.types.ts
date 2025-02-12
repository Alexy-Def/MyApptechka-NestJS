import { USER_ROLE } from '@modules/users/constants';

import {
  SignUpBodyDTO,
  SignInBodyDTO,
  SendSmsCodeBodyDTO,
  VerifyPhoneBodyDTO,
  ChangePasswordBodyDTO,
  TokensResponseDTO,
  RefreshTokenBodyDTO,
} from '../dtos';
import { RefreshTokenEntity } from '../entities';

export type SignUpData = SignUpBodyDTO;
export type SignInData = SignInBodyDTO;

export type RefreshToken = RefreshTokenBodyDTO;
export type Tokens = TokensResponseDTO;

export type UserAuthData = {
  id: number;
  role: USER_ROLE;
};

export type SendSmsCodeData = SendSmsCodeBodyDTO;

export type VerifyPhoneData = VerifyPhoneBodyDTO;

export type ChangePasswordData = ChangePasswordBodyDTO;

export type Device = {
  device: string;
  isMobileDevice: boolean;
};

export type RefreshTokenData = RefreshTokenEntity;
