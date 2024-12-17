// src/users/dto/create-user.dto.ts

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumberString,
    IsPhoneNumber,
  } from "class-validator";
  import { Gender } from "@prisma/client"; // Import Role enum from Prisma
  import { ApiProperty } from "@nestjs/swagger";
  
  export class ClientBodyDto {
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
    @ApiProperty({ description: "The address of the user" ,required: false})
    address: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "The postal code of the user",required: false })
    postalCode: string;

    @IsOptional()
    @IsPhoneNumber(null)
    @ApiProperty({ description: "The  phone number including country code", example: "+1 1234567890" ,required: false})
    phone: string;



    @IsString()
    @ApiProperty({ description: "The gender of the client",enum: ['MALE', 'FEMALE']  })
    gender: Gender

    @IsString()
    @IsNotEmpty()
    @IsNumberString() // Ensures the string contains only numbers
    @ApiProperty({ description: "The city of the user" })
    cityId: string; 



    @ApiProperty({ type: "string", format: "binary" ,required: false})
    file: Express.Multer.File
   
  }
  