import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { PasswordService } from 'src/utils/passwordService';
import { LoginUserDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService,) {}

    // Create a new user
    async createUser(data: CreateUserDto) {
      // Hash the password before saving it
      const hashedPassword = await PasswordService.hashPassword(data.password);
  
      return await this.prisma.user.create({
        data : {
          ...data,
          password: hashedPassword
        },
      });
    }
  
    // Validate user password during login
    // Validate user password during login
    async login({ password, email }: LoginUserDto) {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
  
      if (user && await PasswordService.comparePassword(password, user.password)) {
        const payload = { sub: user.id, email: user.email };
  
        // Ensure the JWT_SECRET is available
        console.log('Payload:', payload);
        console.log('JWT Secret:', process.env.JWT_SECRET); // Debugging to check if the secret is set
  
        // Sign the payload with JWT secret and generate a token
        const accessToken =  this.jwtService.sign(payload);
  
        return {
          access_token: accessToken,  // Return the token
        };
      }
  
      return new BadRequestException('Invalid credentials'); 
    }
}