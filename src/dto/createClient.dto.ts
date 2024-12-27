// src/users/dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  Matches,
  IsPhoneNumber,
  IsDateString,
  IsDate,
} from "class-validator";
import { Gender, Role } from "@prisma/client"; // Import Role enum from Prisma
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEndDateGreaterThanStartDate } from "src/utils/end-date-start-date_directive-validation";

export class createClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The name of the client" })
  fullname: string;

  @IsNotEmpty()
  @ApiProperty({ description: "The email of the client" })
  @IsEmail()
  email: string;

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

  @IsString()
  @ApiProperty({
    description: "The gender of the client",
    enum: ["MALE", "FEMALE"],
  })
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @IsNumberString() // Ensures the string contains only numbers
  @ApiProperty({ description: "The city of the user" })
  cityId: string;

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
  @IsNumberString()
  @ApiProperty({ description: "The weight of the client" })
  weight: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: "The height of the client" })
  height: string;
}
