import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import {
  ApiBody,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
} from "@nestjs/swagger";
import { createClientDto } from "src/dto/createClient.dto";
import { GlobalErrorResponseDto } from "src/swagger/respnse/lookups/globalError.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { clientResponseDto } from "src/swagger/respnse/client/createClient.dto";
import { ClientBodyDto } from "src/dto/clientBody.dto";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";
import { updateClientDto } from "src/dto/updateClient.dto";
import { UpdateClientBodyDto } from "src/dto/updateClientBody.dto";
import { DeleteResponseDto } from "src/swagger/respnse/user/deleteResponse.dto";
import { InjuriesAndDiseasesResponseDto } from "src/swagger/respnse/lookups/inguriesAndDiseases.dto";
import { ClientStrategyDto } from "src/dto/clientStrategy.dto";

@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client by trainer" })
  @ApiResponse({ status: 201, description: "Client created.", type: clientResponseDto })
  @ApiResponse({ status: 400, description: "User already exists.", type: GlobalErrorResponseDto })
  @ApiBody({ type: ClientBodyDto })
  @ApiConsumes("multipart/form-data")
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  createClient(
    @Body() createClientDto: createClientDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    return this.clientService.createClient(createClientDto, file, req.user.id, req.user.role);
  }

  @Get()
  @ApiOperation({ summary: "Get clients by trainer or manager" })
  @ApiResponse({ status: 200, description: "Clients fetched.", type: [clientResponseDto] })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "perPage", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "searchKey", required: false, type: String })
  @ApiQuery({ name: "orderBy", required: false, enum: ["ALPHA-ASC", "ALPHA-DESC", "NEWEST", "OLDEST"] })
  @UseGuards(GeneralAuthGuard)
  getAllClients(@Req() req, @Query() query) {
    const { page, perPage, searchKey, orderBy, ...filters } = query;
    return this.clientService.getAllClients(req.user.id, req.user, page, perPage, searchKey, orderBy);
  }

  @Get(":id")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "Get a client by ID" })
  @ApiResponse({ status: 200, description: "Client fetched.", type: clientResponseDto })
  getClientById(@Param("id") id: number) {
    return this.clientService.getClientById(id);
  }

  @Put(":id")
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update a client by ID" })
  @ApiResponse({ status: 200, description: "Client updated.", type: clientResponseDto })
  @ApiResponse({ status: 400, description: "Client not found.", type: GlobalErrorResponseDto })
  @ApiBody({ type: UpdateClientBodyDto })
  updateClient(
    @Param("id") id: number,
    @Body() data: updateClientDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.clientService.updateClient(id, data, file);
  }

  @Get(":clientId/injuries/:injuryId")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "add or remove injuries by client ID" })
  @ApiResponse({ status: 200, description: "Injuries fetched.", type: DeleteResponseDto })
  @ApiParam({ name: "clientId", type: Number })
  @ApiParam({ name: "injuryId", type: Number })
  getInjuriesByClientId(@Param("clientId") clientId: number, @Param("injuryId") injuryId: number) {
    return this.clientService.addInjuryToClient(clientId, injuryId);
  }

  @Get(":clientId/diseases/:diseaseId")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "add or remove diseases by client ID" })
  @ApiResponse({ status: 200, description: "Diseases fetched.", type: DeleteResponseDto })
  @ApiParam({ name: "clientId", type: Number })
  @ApiParam({ name: "diseaseId", type: Number })
  getDiseasesByClientId(@Param("clientId") clientId: number, @Param("diseaseId") diseaseId: number) {
    return this.clientService.addDiseaseToClient(clientId, diseaseId);
  }

  @Get(":clientId/injuriesAndDiseases")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "Get injuries and diseases by client ID" })
  @ApiResponse({ status: 200, description: "Injuries and diseases fetched.", type: InjuriesAndDiseasesResponseDto })
  @ApiParam({ name: "clientId", type: Number })
  getClientInjuriesAndDiseases(@Param("clientId") clientId: number, @Req() req) {
    return this.clientService.getClientInjuriesAndDiseases(clientId);
  }


  @Put(":clientId/strategy")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "Update a client strategy by ID" })
  @ApiResponse({ status: 200, description: "Client strategy updated.", type: clientResponseDto })
  @ApiResponse({ status: 400, description: "Client not found.", type: GlobalErrorResponseDto })
  @ApiBody({ type: ClientStrategyDto })
  updateClientStrategy(@Param("clientId") clientId: number, @Body() data: ClientStrategyDto) {
    return this.clientService.updateClientStrategy(clientId, data);
  }

  @Get(":clientId/strategy")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "Get a client strategy by ID" })
  @ApiResponse({ status: 200, description: "Client strategy fetched.", type: ClientStrategyDto })
  getClientStrategy(@Param("clientId") clientId: number) {
    return this.clientService.getClientStrategy(clientId);
  }
}
