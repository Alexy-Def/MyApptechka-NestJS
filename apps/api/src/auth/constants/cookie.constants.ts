import { COOKIE } from 'config';

export enum COOKIE_KEY {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export const COOKIE_CONFIG = {
  maxAge: COOKIE.MAX_AGE,
  secure: COOKIE.SECURE,
  sameSite: COOKIE.SAME_SITE,
  httpOnly: COOKIE.HTTP_ONLY,
};
