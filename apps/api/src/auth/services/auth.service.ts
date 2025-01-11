import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { ServiceError, UnauthorizedError } from '@modules/core/exceptions';
import { USER_ROLE } from '@modules/users/constants';
import { UserService } from '@modules/users/services';
import { AUTH } from 'config';

import { AUTH_CONSTANTS, NEW_AUTH_ERRORS } from '../constants';
import { compare, hash, setCookie, clearCookie } from '../helpers';
import { SignUpData, SignInData, Tokens, UserAuthData } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async signUp({ email, password, username }: SignUpData): Promise<void> {
    const existedUser = await this.userService.getUser(email);

    if (existedUser) {
      throw new ServiceError(NEW_AUTH_ERRORS.EMAIL_ALREADY_USED);
    }

    const hashedPassword = await hash(password, AUTH_CONSTANTS.PASSWORD_HASH_SALT_ROUNDS);

    const user = {
      email,
      password: hashedPassword,
      username,
      role: USER_ROLE.USER,
    };
    await this.userService.createUser(user);
  }

  public async signIn({ email, password }: SignInData, response: Response): Promise<void> {
    const user = await this.userService.getUser(email);

    if (!user) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.INVALID_EMAIL);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.INVALID_PASSWORD);
    }

    const tokens = this.createTokens({ id: user.id, role: user.role });
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    setCookie(tokens, response);
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
