// src/users/dto/update-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsNumberString,
} from "class-validator";
import { Role, Status } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The name of the trainer" })
  fullname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The address of the user", required: false })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The postal code of the user", required: false })
  postalCode: string;

  @IsOptional()
  @IsPhoneNumber(null)
  @ApiProperty({
    description: "The  phone number including country code",
    example: "+1 1234567890",
    required: false,
  })
  phone: string;

  @IsOptional()
  @IsEnum(Role) // Use the Role enum to validate the role
  role: Role = Role.ADMIN;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The status of the trainer",
    enum: ["ACTIVE", "INACTIVE"],
  })
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  @IsNumberString() // Ensures the string contains only numbers
  @ApiProperty({ description: "The city of the user" })
  cityId: string;
}
