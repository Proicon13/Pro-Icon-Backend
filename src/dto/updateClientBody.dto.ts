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
import { Gender, Role, Status } from "@prisma/client"; // Import Role enum from Prisma
import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientBodyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The name of the client" })
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
  @IsString()
  @IsEnum(Gender)
  @ApiProperty({
    description: "The gender of the client",
    enum: ["MALE", "FEMALE"],
  })
  gender: Gender;

  @IsOptional()
  @IsString()
  @IsEnum(Status)
  @ApiProperty({
    description: "The status of the client",
    enum: ["ACTIVE", "INACTIVE"],
  })
  status: Status;

  @IsOptional()
  @IsString()
  @IsNumberString() // Ensures the string contains only numbers
  @ApiProperty({ description: "The city of the user" })
  cityId: any;

  @IsOptional()
  @ApiProperty({ type: "string", format: "binary", required: false })
  file: Express.Multer.File;
}
