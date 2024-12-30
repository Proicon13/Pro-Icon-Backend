
import {  IsString, IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TrainingType } from '@prisma/client';

export class ClientStrategyDto {



      @IsOptional()
      @IsNumberString()
      @ApiProperty({ description: "The target weight of the client" })
      targetWeight: string;


      @IsOptional()
      @IsNumberString()
      @ApiProperty({ description: "The muscular mass of the client" })
      muclesMass: string;


      @IsOptional()
      @IsNumberString()
      @ApiProperty({ description: "The body fat mass of the client" })
      boudyFatMass: string;


      @IsOptional()
      @IsString()
      @IsEnum(TrainingType)
        @ApiProperty({
          description: "The training type of the client",
          enum: ["STATIC", "DYNAMIC", "POWER"],
        })

        trainingType: TrainingType
}
