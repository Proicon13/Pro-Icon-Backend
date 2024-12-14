// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "The email address of the user" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The reset code of the user" })
  resetCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The password of the user" })
  newPassword: string;
}
