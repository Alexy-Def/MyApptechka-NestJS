import { Response } from 'express';

import { COOKIE_KEY, COOKIE_CONFIG } from '../constants';
import { Tokens } from '../types';

export function setCookie(tokens: Partial<Tokens>, response: Response): void {
  if (tokens.accessToken) {
    response.cookie(COOKIE_KEY.ACCESS_TOKEN, tokens.accessToken, COOKIE_CONFIG);
  }

  if (tokens.refreshToken) {
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, COOKIE_CONFIG);
  }
}

export function clearCookie(response: Response): void {
  response.clearCookie(COOKIE_KEY.ACCESS_TOKEN);
  response.clearCookie(COOKIE_KEY.REFRESH_TOKEN);
}
