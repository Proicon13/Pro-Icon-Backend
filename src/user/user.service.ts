// src/users/user.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { PasswordService } from 'src/utils/passwordService';
import { LoginUserDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService,) {}


  // Find all users
  async getAllUsers() {
    return await this.prisma.user.findMany();
  }


  // Update a user's details
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

}
