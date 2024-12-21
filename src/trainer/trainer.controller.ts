import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TrainerService } from "./trainer.service";
import { UserResponseDto } from "src/swagger/respnse/user/createUser.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GlobalErrorResponseDto } from "src/swagger/respnse/lookups/globalError.dto";
import { UpdateUserDto } from "src/dto/updateUser.dto";

@Controller("trainers")
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @ApiOperation({ summary: "Get trainer  by admin or manager" })
  @ApiResponse({
    status: 200,
    description: "The trainner have been successfully fetched.",
    type: [UserResponseDto],
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
    description: "Search key for filtering trainers",
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
    return this.trainerService.getAllTrainers(
      user.id,
      user.role,
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
    type: UserResponseDto,
  })
  getClientById(@Param("id") id: number) {
    return this.trainerService.getTrainerById(id);
  }

  @Put(":id")
  @UseGuards(GeneralAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update a client by ID" })
  @ApiResponse({
    status: 200,
    description: "The client has been successfully updated.",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Client not found.",
    type: GlobalErrorResponseDto,
  })
  @ApiBody({ type: UpdateUserDto })
  updateClient(
    @Param("id") id: number,
    @Body() data: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.trainerService.updateTrainer(id, data, file);
  }
}
