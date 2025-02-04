import { ApiPropertyNumber, ApiPropertyString } from '@ppx-node/api-decorators';
import { IsEmail, Matches } from 'class-validator';

import { AUTH_CONSTANTS, NEW_AUTH_ERRORS } from '../constants';

export class SignInBodyDTO {
  @ApiPropertyString()
  public email: string;

  @ApiPropertyString()
  public password: string;
}

export class SignUpBodyDTO {
  @IsEmail()
  @ApiPropertyString()
  public email: string;

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
  public verificationCode?: number;
}

export class SendSmsCodeBodyDTO {
  @ApiPropertyString()
  public phone: string;
}

export class ChangePasswordBodyDTO extends SendSmsCodeBodyDTO {
  @ApiPropertyString()
  public newPassword: string;

  @ApiPropertyString()
  public confirmNewPassword: string;
}
