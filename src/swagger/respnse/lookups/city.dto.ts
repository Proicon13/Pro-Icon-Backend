import { ApiProperty } from "@nestjs/swagger";
import { CountryResponseDto } from "./country.dto";

export class CityResponseDto {
  @ApiProperty({ description: "The unique identifier ID" })
  id: number;

  @ApiProperty({ description: "name" })
  name: string;

  @ApiProperty({ description: "country" })
  country: CountryResponseDto;
}
