// src/users/dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNumberString,
  Matches,
  IsPhoneNumber,
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
  @IsString()
  @ApiProperty({ description: "The address of the user" })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The postal code of the user" })
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString() // Ensures the string contains only numbers
  @ApiProperty({ description: "The city of the user" })
  cityId: string; 

  @IsOptional()
  @IsString()

  @IsPhoneNumber(null)
  @ApiProperty({ description: "The  phone number including country code", example: "+1 1234567890" })

  phone: string;

  // Remove `name` and `age` if they are not part of your schema
}
