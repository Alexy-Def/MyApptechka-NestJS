import { Post, Controller, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResponseInfo } from '@modules/core/api-responses';

import { COOKIE_KEY } from '../constants';
import { SignUpBodyDTO, SignInBodyDTO } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('sign-up')
  @ResponseInfo()
  public async signUp(@Body() body: SignUpBodyDTO): Promise<void> {
    await this.AuthService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ResponseInfo()
  public async signIn(@Body() body: SignInBodyDTO, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.AuthService.signIn(body, response);
  }

  @Post('sign-out')
  @ResponseInfo()
  public signOut(@Res({ passthrough: true }) response: Response): void {
    this.AuthService.signOut(response);
  }

  @Post('refresh-tokens')
  @ResponseInfo()
  public async refreshTokens(@Res({ passthrough: true }) response: Response): Promise<void> {
    await this.AuthService.refreshTokens(response.req.cookies[COOKIE_KEY.REFRESH_TOKEN], response);
  }
}
