import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, Role } from "@prisma/client";
import { CreateUserDto } from "../dto/createUser.dto";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { PasswordService } from "src/utils/passwordService";
import { LoginUserDto } from "src/dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { SendResetEmailDto } from "src/dto/sendResetEmail.dto";
import { ResetPasswordDto } from "src/dto/resetPassword.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mailService: MailService
  ) {}

  //check if user exists
  async checkUserExists(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user !== null;
  }
  // Create a new user
  async createUser(data: CreateUserDto) {

    if (await this.checkUserExists(data.email)) {
      throw new BadRequestException("User already exists");
    }
    // check if city exists
    const city = await this.prisma.city.findUnique({
      where: { id: Number(data.cityId) },
    });
    if (!city) {
      throw new BadRequestException("City not found");
    }

    // Hash the password before saving it
    const hashedPassword = await PasswordService.hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        cityId: city.id,
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    //remove password from response
    const {
      password,
      createdAt,
      updatedAt,
      resetToken,
      resetTokenExpires,
      belongToId,
      cityId,
      ...result
    } = user;
    return result;
  }

  // Validate user password during login
  // Validate user password during login
  async login({ password, email }: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      user &&
      (await PasswordService.comparePassword(password, user.password))
    ) {
      const payload = { sub: user.id, email: user.email };


      // Sign the payload with JWT secret and generate a token
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || "defaultSecretKey",
      });

      return {
        access_token: accessToken, // Return the token
      };
    }

    throw new BadRequestException("Invalid credentials");
  }

  async sendResetPasswordEmail(sendResetEmailDto: SendResetEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: sendResetEmailDto.email },
    });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Generate a reset token & EXPIRATION DATE
    //const resetToken = Math.floor(Math.random() * 1000000).toString();
    const resetToken = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    // Store the reset token in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires: expirationDate },
    });

    // Send the email with the reset token
    await this.mailService.sendEmail(user.email, "Reset Password", resetToken);

    return {
      message: "Reset password email sent successfully",
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: resetPasswordDto.email,
        resetToken: resetPasswordDto.resetCode,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await PasswordService.hashPassword(
      resetPasswordDto.newPassword
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return {
      message: "Password reset successful",
    };
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const {
      password,
      createdAt,
      updatedAt,
      resetToken,
      resetTokenExpires,
      belongToId,
      cityId,
      ...result
    } = user;
    return result;
  }



  async addTrainerByAdmin(data: CreateUserDto, adminId: number) {

    if (await this.checkUserExists(data.email)) {
      throw new BadRequestException("User already exists");
    }
    // check if city exists
    const city = await this.prisma.city.findUnique({
      where: { id: Number(data.cityId) },
    });
    if (!city) {
      throw new BadRequestException("City not found");
    }

    // Hash the password before saving it
    const hashedPassword = await PasswordService.hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        cityId: city.id,
        belongToId: adminId,
        role: Role.TRAINER,
        
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    //remove password from response
    const {
      password,
      createdAt,
      updatedAt,
      resetToken,
      resetTokenExpires,
      belongToId,
      cityId,
      ...result
    } = user;
    return result;
  }
}
