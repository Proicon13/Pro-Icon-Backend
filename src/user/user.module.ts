import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/utils/fileService';
import { PrismaService } from "src/prisma/prisma.service";


@Module({
  providers: [UserService, PrismaService,FileService, JwtService],
  controllers: [UserController]
})
export class UserModule {}
