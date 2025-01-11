import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ServiceError } from '@modules/core/exceptions';
import { AUTH } from 'config';

import { COOKIE_KEY, NEW_AUTH_ERRORS } from '../constants';

export const UserId = createParamDecorator<number>((_data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();
  const accessToken = request.cookies[COOKIE_KEY.ACCESS_TOKEN];

  try {
    const jwtService = new JwtService({ secret: AUTH.ACCESS_JWT_SECRET });
    const payload = jwtService.verify(accessToken, { secret: AUTH.ACCESS_JWT_SECRET });

    return payload.id;
  } catch (err) {
    throw new ServiceError(NEW_AUTH_ERRORS.INVALID_REFRESH_TOKEN);
  }
});
