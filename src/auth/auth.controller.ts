import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from 'src/dto/login.dto';
import { LoginUserResponseDto } from 'src/swagger/respnse/user/loginUser.dto';
import { UserResponseDto } from 'src/swagger/respnse/user/createUser.dto';
import { CreateUserDto } from 'src/dto/createUser.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly prisma: PrismaService,
      ) {}

      @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserResponseDto 
  })
  @ApiBody({ type: CreateUserDto }) 
  async createUser(@Body() userData: CreateUserDto) {
    return this.authService.createUser(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' , type: LoginUserResponseDto})
  @ApiBody({ type: LoginUserDto })
  async login(@Body() userData: LoginUserDto) {
    return this.authService.login(userData);
  }
}
