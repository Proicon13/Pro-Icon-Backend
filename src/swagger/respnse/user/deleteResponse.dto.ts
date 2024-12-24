import { ApiProperty } from "@nestjs/swagger";
import { CityResponseDto } from "../lookups/city.dto";

export class DeleteResponseDto {
 

  @ApiProperty({ description: "Trainer deleted successfully" })
  messafe: string;
}

 
