// src/modules/auth/auth.constants.ts
import { CookieOptions } from 'express';

export const REFRESH_COOKIE_NAME = 'refreshToken';
export const ACCESS_COOKIE_NAME = 'accessToken';

const isProd = process.env.NODE_ENV === 'production';

export const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd, // true in prod (https)
  sameSite: isProd ? 'none' : 'lax',
  path: '/', // ✅ important: cookie available for SSR document requests + all routes
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // domain: isProd ? '.webpexo.com' : 'http://localhost:3000',
});

export const accessCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd, // true in prod (https)
  sameSite: isProd ? 'none' : 'lax',
  path: '/', // ✅ important: cookie available for SSR document requests + all routes
  maxAge: 15 * 60 * 1000, // 15 minutes
  // domain: isProd ? '.webpexo.com' : 'http://localhost:3000',
});
