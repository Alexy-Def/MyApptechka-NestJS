import { Post, Controller, Body, HttpCode, HttpStatus, Res, Headers } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResponseInfo } from '@modules/core/api-responses';

import { AUTH_HEADERS } from '../constants';
import {
  SignUpBodyDTO,
  SignInBodyDTO,
  SendSmsCodeBodyDTO,
  ChangePasswordBodyDTO,
  VerifyPhoneBodyDTO,
  TokensResponseDTO,
  RefreshTokenBodyDTO,
  AccessTokenResponseDTO,
  SendFeedbackBodyDTO,
} from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ResponseInfo()
  public async signUp(@Body() body: SignUpBodyDTO): Promise<void> {
    await this.authService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: AUTH_HEADERS.DEVICE_NAME,
    description: AUTH_HEADERS.DEVICE_NAME_DESCRIPTION,
    required: false,
  })
  @ResponseInfo()
  public async signIn(
    @Headers() headers: Record<string, string>,
    @Body() body: SignInBodyDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokensResponseDTO | void> {
    return this.authService.signIn(headers, body, response);
  }

  @Post('send-pre-register-sms-code')
  @ResponseInfo()
  public async sendPreRegisterSmsCode(@Body() body: SendSmsCodeBodyDTO): Promise<void> {
    await this.authService.sendPreRegisterSmsCode(body);
  }

  @Post('send-forgot-password-sms-code')
  @ResponseInfo()
  public async sendForgotPasswordSmsCode(@Body() body: SendSmsCodeBodyDTO): Promise<void> {
    await this.authService.sendForgotPasswordSmsCode(body);
  }

  @Post('change-password')
  @ResponseInfo()
  public async changePassword(@Body() body: ChangePasswordBodyDTO): Promise<void> {
    await this.authService.changePassword(body);
  }

  @Post('verify-phone')
  @ResponseInfo()
  public async verifyPhone(@Body() body: VerifyPhoneBodyDTO): Promise<void> {
    await this.authService.verifyPhone(body);
  }

  @Post('sign-out')
  @ResponseInfo()
  public async signOut(
    @Body() body: RefreshTokenBodyDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.signOut(body, response);
  }

  @Post('refresh-tokens')
  @ResponseInfo()
  public async refreshTokens(
    @Headers() headers: Record<string, string>,
    @Body() body: RefreshTokenBodyDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponseDTO | void> {
    await this.authService.refreshTokens(headers, body, response);
  }

  @Post('send-feedback')
  @ResponseInfo()
  public async sendFeedback(@Body() body: SendFeedbackBodyDTO): Promise<void> {
    await this.authService.sendFeedback(body);
  }
}
