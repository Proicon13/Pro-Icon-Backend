// src/users/dto/create-user.dto.ts

import { ApiProperty } from "@nestjs/swagger";

export class ProgramResponseDto {
  @ApiProperty({ description: "The name of the program" })
  name: string;

  @ApiProperty({ description: "the program description" })
  description: string;

  @ApiProperty({ description: "the program image" })
  image: string;

  @ApiProperty({ description: "the category id" })
  createdById: number;

  @ApiProperty({ description: "the program duration" })
  duration: number;

  @ApiProperty({ description: "the program pulse" })
  pulse: number;

  @ApiProperty({ description: "the program hertez" })
  hertez: number;
}
