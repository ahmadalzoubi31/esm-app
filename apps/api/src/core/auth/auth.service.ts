import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { verify, hash } from 'argon2';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RefreshToken } from './entities/refresh-token.entity';
import { EntityRepository } from '@mikro-orm/core';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { extractDeviceName, extractClientIp } from './utils/session.utils';
import { SessionInfoDto } from './dto/session-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    // 1. Find user by username
    const user = await this.usersService.findOneByUsernameForAuth(username);

    // 2. Check if user exists and password is correct
    if (user && user.password) {
      // 2.1. Check if password is correct
      const isPasswordMatched = await verify(user.password, pass);

      // 2.2. Return user if password is correct
      if (isPasswordMatched) {
        return user;
      }
    }
    // 3. Return null if user not found or password is incorrect
    return null;
  }

  async signIn(
    dto: SignInDto,
    request?: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // 1. Validate user credentials
    const user = await this.validateUser(dto.username, dto.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // 2. Load User with Relations (Efficiently)
    // We already have the user from validateUser, but we need relations.
    // user.init({ populate: ... }) or findOne is better than lazy loading each.
    const userWithRelations = await this.usersService.findOne(user.id);
    if (!userWithRelations) throw new UnauthorizedException();

    const roles = userWithRelations.roles.getItems().map((role) => ({
      id: role.id,
      key: role.key,
      name: role.name,
    }));

    // 3: Generate JWT Payload
    const payload = {
      username: user.username,
      sub: user.id,
      name: user.display_name,
      email: user.email,
      avatar: user.avatar,
      roles,
      groups: user.groups.getItems(),
    };

    // 4. Generate access token with the JWT Payload
    const access_token = await this.jwtService.signAsync(payload);

    // 5. Generate RAW token for cookie
    const refresh_token_value = randomBytes(64).toString('hex');

    // 6.1. Hash the token and store it in DB
    const refresh_token_hash = await hash(refresh_token_value);

    // 7. Create an instance of RefreshToken with session metadata
    const refresh_token = this.refreshTokenRepository.create({
      user_id: user.id,
      token: refresh_token_hash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_revoked: false,
      ip_address: request ? extractClientIp(request) : '',
      user_agent: request ? request.headers['user-agent'] || '' : '',
      device_name: request
        ? extractDeviceName(request.headers['user-agent'] || '')
        : '',
    });

    // 7. save refresh token in database
    await this.refreshTokenRepository
      .getEntityManager()
      .persist(refresh_token)
      .flush();
    const savedToken = refresh_token;

    // 8. Return access and refresh tokens RAW so controller can set cookie
    // Format: {id}:{secret}
    return {
      access_token,
      refresh_token: `${savedToken.id}:${refresh_token_value}`,
    };
  }

  async logout(refreshTokenValue: string): Promise<boolean> {
    if (!refreshTokenValue) return false;

    const [id] = refreshTokenValue.split(':');
    if (!id) return false;

    const tokenId = parseInt(id, 10);
    if (isNaN(tokenId)) return false;

    // Revoke only the specific token
    await this.refreshTokenRepository.nativeUpdate(
      { id: tokenId },
      { is_revoked: true, revoked_at: new Date() },
    );
    return true;
  }

  async revokeAllSessions(userId: string): Promise<boolean> {
    // Revoke ALL active tokens for this user
    await this.refreshTokenRepository.nativeUpdate(
      { user_id: userId, is_revoked: false },
      { is_revoked: true, revoked_at: new Date() },
    );
    return true;
  }

  async refreshTokensFromCookie(
    refreshTokenValue?: string,
    request?: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // 0. Check if refresh token is provided
    if (!refreshTokenValue)
      throw new UnauthorizedException('Refresh token not provided');

    // 1. Split refresh token into id and secret
    const [id, secret] = refreshTokenValue.split(':');

    // 1.1. Check if id and secret are provided
    if (!id || !secret) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    // 1.2. Check if id is a number
    const tokenId = parseInt(id, 10);
    if (isNaN(tokenId)) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    // 2. Find the specific token by ID (Fast O(1) lookup)
    const matched = await this.refreshTokenRepository.findOne({ id: tokenId });

    // 2.1. Check if token is found
    if (!matched) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // 2.2 Parallelize CPU-intensive verification and DB-intensive user fetch
    // This hides the latency of one behind the other
    const verifyPromise = verify(matched.token, secret);
    const userPromise = this.usersService.findOne(matched.user_id);

    const [isMatch, user] = await Promise.all([verifyPromise, userPromise]);

    if (!isMatch) {
      // Security: We verified the token hash failed.
      // We don't care if user exists or not, but we awaited both.
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 3. Check if matched token is valid (Reuse Detection)
    if (matched.is_revoked) {
      // Security Event: A revoked token is being reused.
      // This implies the token chain has split (Theft or Race Condition).

      // CHECK: Grace Period (10 seconds)
      // If the token was revoked less than 10 seconds ago, it's likely a frontend race condition.
      // We generally just want to fail this request, NOT nuke the user.
      const GRACE_PERIOD = 10 * 1000; // 10s
      const timeSinceRevoke = matched.revoked_at
        ? Date.now() - matched.revoked_at.getTime()
        : GRACE_PERIOD + 1; // If no revoked_at, assume old.

      if (timeSinceRevoke < GRACE_PERIOD) {
        throw new UnauthorizedException('Invalid refresh token (Concurrent)');
      }

      // Action: Revoke ALL sessions for this user (Nuclear Option).
      await this.refreshTokenRepository.nativeUpdate(
        { user_id: matched.user_id },
        { is_revoked: true, revoked_at: new Date() },
      );
      throw new UnauthorizedException(
        'Refresh token reuse detected. All sessions revoked.',
      );
    }

    // 4. Check if matched token is expired
    // Note: We used to check this before user fetch, but now we do it after parallel execution
    // for simplicity and because expiration is rare compared to valid refreshes.
    if (matched.expires_at < new Date())
      throw new UnauthorizedException('Refresh token expired');

    // 5. validate user
    if (!user) throw new UnauthorizedException('User not found');

    // 6. Load collections and adjust the roles object
    await user.roles.loadItems();
    await user.groups.loadItems();
    const roles = user.roles.getItems().map((role) => ({
      id: role.id,
      key: role.key,
      name: role.name,
    }));

    // 7: Generate JWT Payload
    const payload = {
      username: user.username,
      sub: user.id,
      name: user.display_name,
      email: user.email,
      avatar: user.avatar,
      roles,
      groups: user.groups.getItems(),
    };

    // 8: Generate Access Token with the payload
    const access_token = await this.jwtService.signAsync(payload);

    // 9. Update last activity timestamp (Throttled)
    // Only update if last_activity is older than 1 hour or doesn't exist
    const now = Date.now();
    const lastActivityTime = matched.last_activity
      ? matched.last_activity.getTime()
      : 0;
    const oneHour = 60 * 60 * 1000;

    if (request && now - lastActivityTime > oneHour) {
      matched.last_activity = new Date();
      // We don't await this to avoid blocking the response
      // But we should handle errors, or just fire and forget if safe in this context.
      // For safety in serverless/async contexts, usually best to await or use a queue.
      // Sticking to await but it's fast (single update).
      await this.refreshTokenRepository.getEntityManager().flush();
    }

    // 10. Check if token needs rotation
    // Current policy: Rotate if less than 24 hours remaining (1 day)
    const timeRemaining = matched.expires_at.getTime() - now;
    const shouldRotate = timeRemaining < 1 * 24 * 60 * 60 * 1000; // < 1 day

    if (shouldRotate) {
      // 10.1: Generate RAW Refresh Token by Rotate refresh token
      const refresh_token_value = randomBytes(64).toString('hex');

      // 10.2: Hash the token and store it in DB (High cost: Argon2)
      const refresh_token_hash = await hash(refresh_token_value);

      // 10.3: Revoke refresh token in database
      await this.refreshTokenRepository.nativeUpdate(
        { id: matched.id },
        { is_revoked: true, revoked_at: new Date() },
      );

      // 10.4. Create an instance of RefreshToken with session metadata
      const refresh_token_entity = this.refreshTokenRepository.create({
        user_id: user.id,
        token: refresh_token_hash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Reset to 7 days
        is_revoked: false,
        ip_address: request ? extractClientIp(request) : matched.ip_address,
        user_agent: request
          ? request.headers['user-agent'] || ''
          : matched.user_agent,
        device_name: request
          ? extractDeviceName(request.headers['user-agent'] || '')
          : matched.device_name,
      });

      // 11. save refresh token in database
      await this.refreshTokenRepository
        .getEntityManager()
        .persist(refresh_token_entity)
        .flush();
      const savedToken = refresh_token_entity;

      // 12. Return access and refresh tokens RAW so controller can set cookie
      return {
        access_token,
        refresh_token: `${savedToken.id}:${refresh_token_value}`,
      };
    } else {
      // 11. Return new access token and SAME refresh token (no DB write, no Hash)
      return {
        access_token,
        refresh_token: refreshTokenValue,
      };
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    // 1. Validate user
    const user = await this.usersService.findOne(dto.user_id);

    // 2. Check if user exists
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 3. Update user password
    await this.usersService.update(user.id, { password: dto.password });

    // 4. Revoke all sessions (Security: Kick out potential hackers)
    await this.revokeAllSessions(user.id);

    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldRevokedTokens(daysOld: number = 30): Promise<number> {
    // 1. Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // 2. Delete old revoked tokens
    const result = await this.refreshTokenRepository.nativeDelete({
      is_revoked: true,
      created_at: { $lt: cutoffDate },
    });

    // 3. Return number of deleted tokens
    return result;
  }

  async getActiveSessions(userId: string): Promise<SessionInfoDto[]> {
    // 1. Find all active (non-revoked) refresh tokens for the user
    const sessions = await this.refreshTokenRepository.find(
      { user_id: userId, is_revoked: false },
      { orderBy: { last_activity: 'DESC' } },
    );

    // 2. Map to SessionInfoDto
    return sessions.map((session) => ({
      id: session.id,
      device_name: session.device_name || 'Unknown Device',
      ip_address: session.ip_address,
      last_activity: session.last_activity ?? new Date(),
      created_at: session.created_at ?? new Date(),
      expires_at: session.expires_at,
      is_current: false, // Will be set by controller based on current session
      user_id: session.user_id,
    }));
  }

  async revokeSession(sessionId: number, userId: string): Promise<boolean> {
    // 1. Find the session
    const session = await this.refreshTokenRepository.findOne({
      id: sessionId,
      user_id: userId,
    });

    // 2. Check if session exists and belongs to the user
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    // 3. Revoke the session
    await this.refreshTokenRepository.nativeUpdate(
      { id: sessionId },
      { is_revoked: true },
    );

    return true;
  }
}
