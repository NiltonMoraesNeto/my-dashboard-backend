import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // Extrai o token do cookie ou do Authorization header (fallback)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.auth_token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string; perfilId: string }) {
    const user = await this.usersService.findOne(payload.sub);
    return {
      userId: payload.sub,
      email: payload.email,
      perfilId: payload.perfilId,
      user,
    };
  }
}
