import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { LoginUserDto } from "src/dto/login.dto";
import { LoginUserResponseDto } from "src/swagger/respnse/user/loginUser.dto";
import { UserResponseDto } from "src/swagger/respnse/user/createUser.dto";
import { CreateUserDto } from "src/dto/createUser.dto";
import { GlobalErrorResponseDto } from "src/swagger/respnse/lookups/globalError.dto";
import { SendResetEmailDto } from "src/dto/sendResetEmail.dto";
import { ResetPasswordDto } from "src/dto/resetPassword.dto";
import { ForgetPasswordResponseDto } from "src/swagger/respnse/user/forgetPassword.dto";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "User already exists.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() userData: CreateUserDto) {
    return this.authService.createUser(userData);
  }

  @Post("login")
  @ApiOperation({ summary: "Login a user" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully logged in.",
    type: LoginUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid credentials.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() userData: LoginUserDto) {
    return this.authService.login(userData);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Send a reset password email" })
  @ApiResponse({
    status: 200,
    description: "The reset password email has been sent.",
    type: ForgetPasswordResponseDto,
  })
  @ApiBody({ type: SendResetEmailDto })
  async sendResetPasswordEmail(
    @Body() sendResetPasswordEmail: SendResetEmailDto
  ) {
    return this.authService.sendResetPasswordEmail(sendResetPasswordEmail);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({
    status: 200,
    description: "The password has been successfully reset.",
    type: ForgetPasswordResponseDto,
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("me")
  @ApiOperation({ summary: "Get the current user" })
  @ApiResponse({
    status: 200,
    description: "The current user has been successfully retrieved.",
    type: UserResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(GeneralAuthGuard)
  async me(@Req() req) {
    const user = req.user;
    return this.authService.getUser(user.id);
  }
}
