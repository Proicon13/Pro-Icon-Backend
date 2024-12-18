// src/users/user.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { MangerAuthGuard } from "src/guards/ManagerAuthGuard";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  @UseGuards(MangerAuthGuard)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put(":id")
  async updateUser(@Param("id") id: number, @Body() userData: UpdateUserDto) {
    return this.userService.updateUser(id, userData);
  }
}
