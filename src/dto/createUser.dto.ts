// src/users/dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from "class-validator";
import { Role } from "@prisma/client"; // Import Role enum from Prisma
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "The email address of the user" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The password of the user" })
  password: string; // Add the password field

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The full name of the user" })
  fullname: string; // Add the fullname field

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({ description: "The role of the user" })
  role: Role = Role.ADMIN; // Default to ADMIN

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The address of the user" })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The postal code of the user" })
  postalCode: string;

  @IsNumber()
  @ApiProperty({ description: "The city of the user" })
  cityId: number;

  // Remove `name` and `age` if they are not part of your schema
}
