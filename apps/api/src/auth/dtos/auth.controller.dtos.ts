import { ApiPropertyNumber, ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';

import { AUTH_CONSTANTS, NEW_AUTH_ERRORS } from '../constants';

export class SignInBodyDTO {
  @ApiPropertyString()
  public phone: string;

  @ApiPropertyString()
  public password: string;
}

export class SignUpBodyDTO {
  @ApiPropertyString()
  @Matches(AUTH_CONSTANTS.PASSWORD_REGEX, {
    message: NEW_AUTH_ERRORS.INVALID_PASSWORD_PATTERN,
  })
  public password: string;

  @ApiPropertyString()
  public username: string;

  @ApiPropertyString()
  public phone: string;

  @ApiPropertyString()
  public familyTitle: string;

  @ApiPropertyNumber({ isOptional: true })
  public referralCode?: number;
}

export class SendSmsCodeBodyDTO {
  @ApiPropertyString()
  public phone: string;
}

export class VerifyPhoneBodyDTO extends SendSmsCodeBodyDTO {
  @ApiPropertyNumber()
  public verificationCode: number;
}

export class ChangePasswordBodyDTO extends VerifyPhoneBodyDTO {
  @ApiPropertyString()
  public newPassword: string;

  @ApiPropertyString()
  public confirmNewPassword: string;
}

export class RefreshTokenBodyDTO {
  @ApiPropertyString({ isOptional: true })
  public refreshToken?: string;
}

export class AccessTokenResponseDTO {
  @Expose()
  @ApiPropertyString()
  public accessToken: string;
}

export class TokensResponseDTO extends AccessTokenResponseDTO {
  @Expose()
  @ApiPropertyString()
  public refreshToken: string;
}
