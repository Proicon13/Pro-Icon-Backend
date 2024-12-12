import { ApiProperty } from "@nestjs/swagger";
import { CityResponseDto } from "../lookups/city.dto";

export class UserResponseDto {
  @ApiProperty({ description: "The unique identifier of the user" })
  id: number;

  @ApiProperty({ description: "The email address of the user" })
  email: string;

  @ApiProperty({ description: "The full name of the user" })
  fullname: string;

  @ApiProperty({ description: "The profile image URL of the user" })
  image: string;

  @ApiProperty({ description: "The city of the user", type: CityResponseDto })
  city: CityResponseDto;

  @ApiProperty({ description: "The postal code of the user" })
  postalCode: string;

  @ApiProperty({ description: "The address of the user" })
  address: string;

  @ApiProperty({ description: "The phone number of the user" })
  phone: string;

  @ApiProperty({
    description: "The role of the user",
    enum: ["MANAGER", "ADMIN"],
  })
  role: string;
}
