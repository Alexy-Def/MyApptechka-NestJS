import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';

import { hashPassword, compareHashedPassword } from '@libs/helpers';
import { ServiceError, UnauthorizedError, EntityNotFoundError } from '@modules/core/exceptions';
import { FeedbackService, SmsFeedback } from '@modules/feedback';
import { USER_ROLE } from '@modules/users/constants';
import { UserService, FamilyService } from '@modules/users/services';
import { VerificationService } from '@modules/verification';
import { AUTH } from 'config';

import { NEW_AUTH_ERRORS, SMS_TEMPLATE } from '../constants';
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
    private readonly verificationService: VerificationService,
    private readonly feedbackService: FeedbackService,
    private readonly dataSource: DataSource,
  ) {}

  public async signUp(body: SignUpData): Promise<void> {
    const { password, username, phone, verificationCode, familyTitle, referralCode } = body;

    await this.verifyPhone({ phone, verificationCode });

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

    await this.verificationService.sendVerificationCode(phone, SMS_TEMPLATE.PRE_REGISTRATION);
  }

  public async sendForgotPasswordSmsCode(body: SendSmsCodeData): Promise<void> {
    const { phone } = body;

    const user = await this.userService.getUserByPhone(phone);

    if (!user) {
      throw new EntityNotFoundError(NEW_AUTH_ERRORS.USER_NOT_FOUND);
    }

    await this.verificationService.sendVerificationCode(phone, SMS_TEMPLATE.FORGOT_PASSWORD);
  }

  public async changePassword(body: ChangePasswordData): Promise<void> {
    await this.verifyPhone(body);
    await this.userService.changePassword(body, false);
  }

  public async verifyPhone(body: VerifyPhoneData): Promise<void> {
    await this.verificationService.verifyCode(body.phone, body.verificationCode);
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

  public async sendFeedback(body: SmsFeedback): Promise<void> {
    await this.feedbackService.sendSmsFeedback(body);
  }
}
