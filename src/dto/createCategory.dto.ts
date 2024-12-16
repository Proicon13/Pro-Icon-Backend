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

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The name of the user" })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The name of the user" })
  description: string;

  @IsOptional()
  @ApiProperty({ type: "string", format: "binary" })
  file: Express.Multer.File;
}
