import { Controller, Get, Param, Req } from "@nestjs/common";
import { LookupsService } from "./lookups.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CountryResponseDto } from "src/swagger/respnse/lookups/country.dto";
import { CityResponseDto } from "src/swagger/respnse/lookups/city.dto";

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
}
