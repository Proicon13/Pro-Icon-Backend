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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { MangerAuthGuard } from "src/guards/ManagerAuthGuard";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from "@nestjs/swagger";
import { GlobalErrorResponseDto } from "src/swagger/respnse/lookups/globalError.dto";
import { UserResponseDto } from "src/swagger/respnse/user/createUser.dto";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";

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
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update a user" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully updated.",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "The user not found.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Body() userData: UpdateUserDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.updateUser(req.user.id, userData, file);
  }
}
