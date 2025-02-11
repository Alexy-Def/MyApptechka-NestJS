import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';

import { hashPassword, compareHashedPassword } from '@libs/helpers';
import { ServiceError, UnauthorizedError, EntityNotFoundError } from '@modules/core/exceptions';
import { USER_ROLE } from '@modules/users/constants';
import { UserService, FamilyService } from '@modules/users/services';
import { AUTH } from 'config';

import { AUTH_HEADERS, NEW_AUTH_ERRORS } from '../constants';
import { setCookie, clearCookie } from '../helpers';
import { AuthTokenService } from '../services';
import {
  SignUpData,
  SignInData,
  Tokens,
  RefreshToken,
  SendSmsCodeData,
  ChangePasswordData,
  VerifyPhoneData,
} from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly familyService: FamilyService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  public async signUp(body: SignUpData): Promise<void> {
    const { password, username, phone, familyTitle, referralCode } = body;

    // check verification code. if it doesn't match -> error

    await this.dataSource.manager.transaction(async (entityManager) => {
      const existedUser = await this.userService.getUserByPhone(phone, entityManager);

      if (existedUser) {
        throw new ServiceError(NEW_AUTH_ERRORS.PHONE_NUMBER_ALREADY_USED);
      }

      const hashedPassword = await hashPassword(password, AUTH.PASSWORD_HASH_SALT_ROUNDS);
      const family = await this.familyService.getOrCreateFamily({ title: familyTitle, referralCode }, entityManager);

      const userData = {
        password: hashedPassword,
        username,
        phone,
        role: USER_ROLE.USER,
        familyId: family.id,
      };
      const createdUser = await this.userService.createUser(userData, entityManager);

      if (!referralCode) {
        family.headOfId = createdUser.id;
        await this.familyService.updateFamily(family.id, family, entityManager);
      }
    });
  }

  public async signIn(
    headers: Record<string, string>,
    { phone, password }: SignInData,
    response: Response,
  ): Promise<Tokens | void> {
    const user = await this.userService.getUserByPhone(phone);

    if (!user) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.USER_NOT_FOUND);
    }

    const isPasswordCorrect = await compareHashedPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.INVALID_PASSWORD);
    }

    const tokens = this.authTokenService.createTokens({ id: user.id, role: user.role });
    const { device, isMobileDevice } = this.authTokenService.getDevice(headers);
    await this.authTokenService.saveRefreshToken(user.id, tokens.refreshToken, device);

    if (isMobileDevice) {
      response.setHeader(AUTH_HEADERS.AUTHORIZATION, `Bearer ${tokens.accessToken}`);

      return tokens;
    } else {
      setCookie(tokens, response);
    }
  }

  public async sendPreRegisterSmsCode(body: SendSmsCodeData): Promise<void> {
    const { phone } = body;

    const user = await this.userService.getUserByPhone(phone);

    if (user) {
      throw new ServiceError(NEW_AUTH_ERRORS.PHONE_NUMBER_ALREADY_USED);
    }

    // generate code

    // send code
  }

  public async sendForgotPasswordSmsCode(body: SendSmsCodeData): Promise<void> {
    const { phone } = body;

    const user = await this.userService.getUserByPhone(phone);

    if (!user) {
      throw new EntityNotFoundError(NEW_AUTH_ERRORS.USER_NOT_FOUND);
    }

    // generate code

    // send code
  }

  public async changePassword(body: ChangePasswordData): Promise<void> {
    // check verification code. if it doesn't match -> error

    await this.userService.changePassword(body, false);
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  public async verifyPhone(body: VerifyPhoneData): Promise<void> {
    // check verification code. if it doesn't match -> error
  }

  public async refreshTokens(
    headers: Record<string, string>,
    body: RefreshToken,
    response: Response,
  ): Promise<string | void> {
    await this.authTokenService.refreshTokens(headers, body, response);
  }

  public async signOut(body: RefreshToken, response: Response): Promise<void> {
    await this.authTokenService.deactivateRefreshToken(body);
    clearCookie(response);
  }
}
