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
} from "@nestjs/swagger";
import { createClientDto } from "src/dto/createClient.dto";
import { GlobalErrorResponseDto } from "src/swagger/respnse/lookups/globalError.dto";
import { TrainerGuard } from "src/guards/TrainerGuard";
import { FileInterceptor } from "@nestjs/platform-express";
import { clientResponseDto } from "src/swagger/respnse/client/createClient.dto";
import { ClientBodyDto } from "src/dto/clientBody.dto";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";
import { updateClientDto } from "src/dto/updateClient.dto";
import { UpdateClientBodyDto } from "src/dto/updateClientBody.dto";

@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client by trainer" })
  @ApiResponse({
    status: 201,
    description: "The client has been successfully created.",
    type: clientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "User already exists.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: ClientBodyDto })
  @ApiConsumes("multipart/form-data")
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  createClient(
    @Body() createClientDto: createClientDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    const user = req.user;
    return this.clientService.createClient(
      createClientDto,
      file,
      user.id,
      user.role
    );
  }

  @Get()
  @ApiOperation({ summary: "Get clients by trainer or manager" })
  @ApiResponse({
    status: 200,
    description: "The clients have been successfully fetched.",
    type: [clientResponseDto],
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination (default is 1)",
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    description: "Number of items per page (default is 10)",
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: "searchKey",
    required: false,
    description: "Search key for filtering clients",
    type: String,
  })
  @ApiQuery({
    name: "orderBy",
    required: false,
    description: "Order by field for sorting clients",
    enum: ["ALPHA-ASC", "ALPHA-DESC", "NEWEST", "OLDEST"],
  })
  @UseGuards(GeneralAuthGuard)
  getAllClients(@Req() req, @Query() query) {
    const user = req.user;
    const { page, perPage, searchKey, orderBy, ...filters } = query;
    return this.clientService.getAllClients(
      user.id,
      user,
      page,
      perPage,
      searchKey,
      orderBy
    );
  }

  @Get(":id")
  @UseGuards(GeneralAuthGuard)
  @ApiOperation({ summary: "Get a client by ID" })
  @ApiResponse({
    status: 200,
    description: "The client has been successfully fetched.",
    type: clientResponseDto,
  })
  getClientById(@Param("id") id: number, @Req() req) {
    return this.clientService.getClientById(id);
  }

  @Put(":id")
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update a client by ID" })
  @ApiResponse({
    status: 200,
    description: "The client has been successfully updated.",
    type: clientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Client not found.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: UpdateClientBodyDto })
  updateClient(
    @Param("id") id: number,
    @Body() data: updateClientDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.clientService.updateClient(id, data, file);
  }
}
