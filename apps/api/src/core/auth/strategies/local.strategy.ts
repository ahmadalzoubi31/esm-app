import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // 1. Validate user credentials
    const user = await this.authService.validateUser(username, password);
    // 2. If user is not found, throw error
    if (!user) {
      throw new UnauthorizedException();
    }
    // 3. Return user object
    return user;
  }
}
