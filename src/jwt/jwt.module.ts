// src/jwt/jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',  // Use environment variable for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, JwtStrategy, JwtAuthGuard, PrismaService],
  exports: [JwtAuthGuard], // Export the guard
})
export class JwtAuthModule {}
