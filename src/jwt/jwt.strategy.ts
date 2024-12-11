import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
    sub: number;  // user id (assuming you're using user IDs)
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey', // Use an environment variable for your secret key
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
