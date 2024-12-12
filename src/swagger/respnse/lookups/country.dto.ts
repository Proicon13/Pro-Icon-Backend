import { ApiProperty } from "@nestjs/swagger";

export class CountryResponseDto {
  @ApiProperty({ description: "The unique identifier ID" })
  id: number;

  @ApiProperty({ description: "name" })
  name: string;
}
