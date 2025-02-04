import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { DataSource } from 'typeorm';

import { hashPassword, compareHashedPassword } from '@libs/helpers';
import { ServiceError, UnauthorizedError, EntityNotFoundError } from '@modules/core/exceptions';
import { USER_ROLE } from '@modules/users/constants';
import { UserService, FamilyService } from '@modules/users/services';
import { AUTH } from 'config';

import { NEW_AUTH_ERRORS } from '../constants';
import { setCookie, clearCookie } from '../helpers';
import { SignUpData, SignInData, Tokens, UserAuthData, SendSmsCodeData, ChangePasswordData } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly familyService: FamilyService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  public async signUp(body: SignUpData): Promise<void> {
    const { email, password, username, phone, familyTitle } = body;

    // check verification code. if it doesn't match -> error

    await this.dataSource.manager.transaction(async (entityManager) => {
      const existedUser = await this.userService.getUserByPhone(phone, entityManager);

      if (existedUser) {
        throw new ServiceError(NEW_AUTH_ERRORS.PHONE_NUMBER_ALREADY_USED);
      }

      const hashedPassword = await hashPassword(password, AUTH.PASSWORD_HASH_SALT_ROUNDS);

      const userData = {
        email,
        password: hashedPassword,
        username,
        phone,
        role: USER_ROLE.USER,
      };
      const createdUser = await this.userService.createUser(userData, entityManager);

      const createdFamily = await this.familyService.createFamily(
        { title: familyTitle, referralCode: 111 },
        entityManager,
      );
      createdUser.familyId = createdFamily.id;
      await this.userService.updateUser(createdUser.id, createdUser, entityManager);
    });
  }

  public async signIn({ email, password }: SignInData, response: Response): Promise<void> {
    const user = await this.userService.getUser(email);

    if (!user) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.INVALID_EMAIL);
    }

    const isPasswordCorrect = await compareHashedPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.INVALID_PASSWORD);
    }

    const tokens = this.createTokens({ id: user.id, role: user.role });
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    setCookie(tokens, response);
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

  public signOut(response: Response): void {
    clearCookie(response);
  }

  public createTokens(user: UserAuthData): Tokens {
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  public createAccessToken(user: UserAuthData): string {
    return this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_IN,
        secret: AUTH.ACCESS_JWT_SECRET,
      },
    );
  }

  public createRefreshToken(user: UserAuthData): string {
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN,
        secret: AUTH.REFRESH_JWT_SECRET,
      },
    );

    return refreshToken;
  }

  public decodedRefreshToken(refreshToken: string): UserAuthData {
    try {
      return this.jwtService.verify(refreshToken, { secret: AUTH.REFRESH_JWT_SECRET });
    } catch (error) {
      throw new ServiceError(NEW_AUTH_ERRORS.INVALID_REFRESH_TOKEN);
    }
  }

  public async refreshTokens(refreshToken: string, response: Response): Promise<void> {
    const refreshTokenPayload = this.decodedRefreshToken(refreshToken);
    const user = await this.userService.getUserByIdOrFail(refreshTokenPayload.id);

    if (refreshToken !== user.refreshToken) {
      throw new ServiceError(NEW_AUTH_ERRORS.INVALID_REFRESH_TOKEN);
    }

    const accessToken = this.createAccessToken(user);

    return setCookie({ accessToken }, response);
  }

  public async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, refreshToken);
  }

  public async deleteRefreshToken(userId: number): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }
}
