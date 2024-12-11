import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';  // Assuming you have a UserService
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',  // Use a more secure key in production
      signOptions: { expiresIn: '60s' },  // Token expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService,PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
