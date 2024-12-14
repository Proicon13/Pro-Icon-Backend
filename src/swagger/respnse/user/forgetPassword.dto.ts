import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordResponseDto {
  @ApiProperty({ description: "success message", type: String })
  message: string;
}
