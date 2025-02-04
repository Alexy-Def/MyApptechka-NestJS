import { Post, Controller, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResponseInfo } from '@modules/core/api-responses';

import { COOKIE_KEY } from '../constants';
import { SignUpBodyDTO, SignInBodyDTO, SendSmsCodeBodyDTO, ChangePasswordBodyDTO } from '../dtos';
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
  @ResponseInfo()
  public async signIn(@Body() body: SignInBodyDTO, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.authService.signIn(body, response);
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

  @Post('sign-out')
  @ResponseInfo()
  public signOut(@Res({ passthrough: true }) response: Response): void {
    this.authService.signOut(response);
  }

  @Post('refresh-tokens')
  @ResponseInfo()
  public async refreshTokens(@Res({ passthrough: true }) response: Response): Promise<void> {
    await this.authService.refreshTokens(response.req.cookies[COOKIE_KEY.REFRESH_TOKEN], response);
  }
}
