import { Controller, Get, Param, Req } from "@nestjs/common";
import { LookupsService } from "./lookups.service";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CountryResponseDto } from "src/swagger/respnse/lookups/country.dto";
import { CityResponseDto } from "src/swagger/respnse/lookups/city.dto";
import { InjuriesAndDiseasesResponseDto } from "src/swagger/respnse/lookups/inguriesAndDiseases.dto";

@Controller("lookups")
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get("countries")
  @ApiOperation({ summary: "Get all countries" })
  @ApiResponse({
    status: 200,
    description: "contury retrived",
    type: [CountryResponseDto],
  })
  getContries() {
    return this.lookupsService.getContries();
  }

  @Get("cities/:countryId")
  @ApiOperation({ summary: "Get all cities by country" })
  @ApiParam({
    name: "countryId",
    description: "country id",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "cities retrived",
    type: [CityResponseDto],
  })
  getCities(@Param("countryId") country: string) {
    return this.lookupsService.getCities(country);
  }



@Get("injuries-and-diseases")
@ApiOperation({ summary: "Get all injuries and diseases" })
@ApiResponse({
  status: 200,
  description: "injuries and diseases retrived",
  type: InjuriesAndDiseasesResponseDto,
})
  async getInjuriesAndDiseases() {
    const diseases = await this.lookupsService.getDiseases();
    const injuries =await this.lookupsService.getInjuries();
    return { diseases, injuries };
  }
}
