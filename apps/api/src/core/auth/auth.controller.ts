// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Request,
  Body,
  Res,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
import {
  REFRESH_COOKIE_NAME,
  ACCESS_COOKIE_NAME,
  refreshCookieOptions,
  accessCookieOptions,
} from './auth.constants';
import { Response } from 'express';
import { SessionInfoDto } from './dto/session-info.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: AuthResponse })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto,
      req,
    );

    // ✅ set both access and refresh token cookies
    res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions());
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());

    // No longer return access token in response body
    return { message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: Boolean })
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    // ✅ EXTRACT COOKIE
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    const refreshToken = raw ? decodeURIComponent(raw) : undefined;

    // ✅ PASS COOKIE VALUE to revoke only this session
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // ✅ Clear both access and refresh token cookies
    // Must pass same options as when setting cookies for clearCookie to work
    res.clearCookie(ACCESS_COOKIE_NAME, accessCookieOptions());
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());

    return true;
  }

  @Post('logout-all')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: Boolean })
  async logoutAll(@Request() req, @Res({ passthrough: true }) res: Response) {
    // ✅ Revoke ALL sessions for this user
    await this.authService.revokeAllSessions(req.user.userId);

    // ✅ Clear both access and refresh token cookies
    // Must pass same options as when setting cookies for clearCookie to work
    res.clearCookie(ACCESS_COOKIE_NAME, accessCookieOptions());
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());

    return true;
  }

  @Get('profile')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: User })
  getProfile(@Request() req) {
    // Map userId to id for frontend compatibility
    return {
      id: req.user.userId,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      roles: req.user.roles,
      groups: req.user.groups,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: AuthResponse })
  async refreshTokens(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // ✅ decode because cookie value may contain %3A instead of :
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    const refreshTokenValue = raw ? decodeURIComponent(raw) : undefined;

    const { accessToken, refreshToken } =
      await this.authService.refreshTokensFromCookie(refreshTokenValue, req);

    // ✅ set both access and refresh token cookies
    res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions());
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());

    // No longer return access token in response body
    return { message: 'Token refreshed successfully' };
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: Boolean })
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetDto);
  }

  @Post('cleanup-tokens')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async cleanupOldTokens() {
    const deletedCount = await this.authService.cleanupOldRevokedTokens(30);
    return {
      message: 'Old revoked tokens cleaned up successfully',
      deletedCount,
    };
  }

  @Get('sessions')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: [SessionInfoDto] })
  async getActiveSessions(@Request() req) {
    const sessions = await this.authService.getActiveSessions(req.user.userId);

    // ✅ decode here too so split(':') works
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    const currentRefreshToken = raw ? decodeURIComponent(raw) : undefined;

    if (currentRefreshToken) {
      const [currentId] = currentRefreshToken.split(':');
      sessions.forEach((session) => {
        session.isCurrent = session.id === parseInt(currentId, 10);
      });
    }

    return sessions;
  }

  @Post('sessions/:id/revoke')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: Boolean })
  async revokeSession(@Request() req, @Param('id') sessionId: string) {
    return this.authService.revokeSession(
      parseInt(sessionId, 10),
      req.user.userId,
    );
  }
}
