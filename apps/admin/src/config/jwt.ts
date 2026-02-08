import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export const jwtConfig = registerAs<JwtConfig>('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN!,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
}));
