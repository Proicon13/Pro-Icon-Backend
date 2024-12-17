import { ApiProperty } from "@nestjs/swagger";
import { CountryResponseDto } from "./country.dto";

 class ResponseDto {
  @ApiProperty({ description: "The unique identifier ID" })
  id: number;

  @ApiProperty({ description: "name" })
  name: string;



}


export  class InjuriesAndDiseasesResponseDto {

  @ApiProperty({ description: "injuries" , type: [ResponseDto]})
  injuries: [ResponseDto];

  @ApiProperty({ description: "diseases"  , type: [ResponseDto]}) 
  diseases: [ResponseDto];

}
 