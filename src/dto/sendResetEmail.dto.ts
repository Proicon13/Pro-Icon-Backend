// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendResetEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "The email address of the user" })
  email: string;
}
