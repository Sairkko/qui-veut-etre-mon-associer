import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// Définition d'une interface pour le payload JWT
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // Force un string non-undefined pour le secret
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET doit être défini');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: unknown): Promise<any> {
    // Valider que le payload respecte la structure JwtPayload
    if (!payload || typeof payload !== 'object') {
      throw new UnauthorizedException('Token invalide');
    }

    const jwtPayload = payload as JwtPayload;
    if (typeof jwtPayload.sub !== 'string') {
      throw new UnauthorizedException('Token invalide');
    }

    const user = await this.usersService.findOne(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
