import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey', // Use a more secure key in production
    });
  }

  async validate(payload: JwtPayload) {
    // The 'validate' method will be called once the JWT is verified
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } }); // Find the user by ID (sub)
    if (!user) {
      throw new Error('User not found');
    }
    return user; // This user will be available in request.user
  }
}
