import { ApiProperty } from "@nestjs/swagger";
import { CountryResponseDto } from "./country.dto";

class MessageDto {
  @ApiProperty({ description: "message" })
  message: string;

  @ApiProperty({ description: "error" })
  error: string;

  @ApiProperty({ description: "Response status code" })
  statusCode: number;
}

export class GlobalErrorResponseDto {
  @ApiProperty({ description: "Response status code" })
  statusCode: number;

  @ApiProperty({ description: "message details" })
  message: MessageDto;

  @ApiProperty({ description: "error path" })
  path: CountryResponseDto;
}
