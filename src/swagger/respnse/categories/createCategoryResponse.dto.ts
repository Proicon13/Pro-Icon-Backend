// src/users/dto/create-user.dto.ts

  import { ApiProperty } from "@nestjs/swagger";
import { ProgramResponseDto } from "../program/program.dto";
  
  export class CreateCategoryResponseDto {
  
    @ApiProperty({ description: "The name of the category" })
    name: string; 

    @ApiProperty({ description: "the category description" })
    description: string; 

    @ApiProperty({ description: "the category image" })
    image: string;

    @ApiProperty({ description: "the category programs" , type: [ProgramResponseDto]})
    programs: [ProgramResponseDto]

  }
  