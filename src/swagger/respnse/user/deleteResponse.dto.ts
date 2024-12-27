import { ApiProperty } from "@nestjs/swagger";

export class DeleteResponseDto {
  @ApiProperty({ description: "message" })
  message: string;
}
