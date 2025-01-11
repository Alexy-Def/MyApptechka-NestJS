import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { UnauthorizedError } from '@modules/core/exceptions';
import { AUTH } from 'config';

import { AUTH_CONSTANTS, COOKIE_KEY } from '../constants';
import { NEW_AUTH_ERRORS } from '../constants/errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_CONSTANTS.IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies[COOKIE_KEY.ACCESS_TOKEN];

    if (!token) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.ACCESS_TOKEN_NOT_FOUND);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: AUTH.ACCESS_JWT_SECRET,
      });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedError(NEW_AUTH_ERRORS.ACCESS_TOKEN_EXPIRED);
    }

    return true;
  }
}
