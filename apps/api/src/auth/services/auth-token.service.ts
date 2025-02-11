import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import moment from 'moment';
import useragent from 'useragent';

import { ServiceError } from '@modules/core/exceptions';
import { UserService } from '@modules/users/services';
import { AUTH } from 'config';

import { AUTH_HEADERS, COOKIE_KEY, NEW_AUTH_ERRORS } from '../constants';
import { setCookie } from '../helpers';
import { RefreshTokenRepository } from '../repositories';
import { Tokens, RefreshToken, UserAuthData, Device, RefreshTokenData } from '../types';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

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

  public async refreshTokens(
    headers: Record<string, string>,
    body: RefreshToken,
    response: Response,
  ): Promise<string | void> {
    const { isMobileDevice } = this.getDevice(headers);
    const refreshToken = body?.refreshToken || response?.req.cookies[COOKIE_KEY.REFRESH_TOKEN];

    if (!refreshToken) {
      throw new ServiceError(NEW_AUTH_ERRORS.REFRESH_TOKEN_NOT_PROVIDED);
    }

    const refreshTokenPayload = this.decodedRefreshToken(refreshToken);
    const user = await this.userService.getUserByIdOrFail(refreshTokenPayload.id);
    const refreshTokens = await this.getActiveUserSessions(refreshTokenPayload.id);

    if (!refreshTokens.some((item) => item.token === refreshToken)) {
      throw new ServiceError(NEW_AUTH_ERRORS.REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = this.createAccessToken(user);

    if (isMobileDevice) {
      response.setHeader('Authorization', `Bearer ${accessToken}`);

      return accessToken;
    } else {
      setCookie({ accessToken }, response);
    }
  }

  public async getActiveUserSessions(userId: number): Promise<RefreshTokenData[]> {
    return this.refreshTokenRepository.findBy({ userId, isActive: true });
  }

  public async saveRefreshToken(userId: number, token: string, device: string): Promise<void> {
    const expirationDate = moment()
      .add(AUTH.REFRESH_TOKEN_EXPIRES_VALUE, AUTH.REFRESH_TOKEN_EXPIRES_UNIT as moment.unitOfTime.DurationConstructor)
      .toDate();
    await this.refreshTokenRepository.save({ token, device, expirationDate, userId });
  }

  public async deactivateRefreshToken(body: RefreshToken): Promise<void> {
    await this.refreshTokenRepository.update({ token: body.refreshToken }, { isActive: false });
  }

  public getDevice(headers: Record<string, string>): Device {
    let device = headers[AUTH_HEADERS.DEVICE_NAME];
    let isMobileDevice = true;

    if (!device) {
      const agent = useragent.parse(headers[AUTH_HEADERS.USER_AGENT]);
      device = `${agent?.family} ${agent?.major}`;
      isMobileDevice = false;
    }

    return { device, isMobileDevice };
  }
}
