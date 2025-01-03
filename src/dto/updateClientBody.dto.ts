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
  IsDate,
} from "class-validator";
import { Gender, Role, Status } from "@prisma/client"; // Import Role enum from Prisma
import { ApiProperty } from "@nestjs/swagger";
import { IsEndDateGreaterThanStartDate } from "src/utils/end-date-start-date_directive-validation";
import { Transform } from "class-transformer";

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

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) return value; // If value is undefined or null, return it as is
    console.log("Value:", typeof value);
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day + 1); // Convert to Date object
  })
  @ApiProperty({
    description: "The start date for the client in yyyy-mm-dd format",
    example: "2023-12-31",

    required: false,
    format: "date",
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @IsEndDateGreaterThanStartDate("startDate")
  @Transform(({ value }) => {
    if (!value) return value; // If value is undefined or null, return it as is
    console.log("Value:", typeof value);
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day + 1); // Convert to Date object
  })
  @ApiProperty({
    description: "The end date for the client in yyyy-mm-dd format",
    example: "2023-12-31",
    required: false,
  })
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "The wehight of the client" })
  weight: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: "The height of the client" })
  height: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The medical notes of the client" })
  medicalNotes: string;
}
