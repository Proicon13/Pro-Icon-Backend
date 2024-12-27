import { ApiProperty } from "@nestjs/swagger";
import { CityResponseDto } from "../lookups/city.dto";

class userRes {
  @ApiProperty({ description: "The unique identifier of the user" })
  id: number;

  @ApiProperty({ description: "The full name of the user" })
  fullname: string;

  @ApiProperty({ description: "The email address of the user" })
  email: string;
}

export class clientResponseDto {
  @ApiProperty({ description: "The unique identifier of the client" })
  id: number;

  @ApiProperty({ description: "The full name of the client" })
  fullname: string;

  @ApiProperty({ description: "The email address of the client" })
  email: string;

  @ApiProperty({ description: "The phone number of the client" })
  phone: string;

  @ApiProperty({ description: "The address of the client" })
  address: string;

  @ApiProperty({ description: "The postal code of the client" })
  postalCode: number;

  @ApiProperty({ description: "The profile image URL of the client" })
  image: string;

  @ApiProperty({
    description: "The status of the client",
    enum: ["ACTIVE", "INACTIVE"],
  })
  status: string;

  @ApiProperty({
    description: "The gender of the client",
    enum: ["MALE", "FEMALE"],
  })
  gender: string;

  @ApiProperty({ description: "The city of the client", type: CityResponseDto })
  city: CityResponseDto;

  @ApiProperty({ description: "The user of the client", type: userRes })
  user: userRes;

  @ApiProperty({
    description: "The start date for the client in yyyy-mm-dd format",
    example: "2023-12-31",

    required: false,
    format: "date",
    type: Date,
  })
  startDate: Date;

  @ApiProperty({
    description: "The end date for the client in yyyy-mm-dd format",
    example: "2023-12-31",
    required: false,
    type: Date,
  })
  endDate: Date;

  @ApiProperty({ description: "The wehight of the client" })
  wehght: number;

  @ApiProperty({ description: "The height of the client" })
  height: number;
}
