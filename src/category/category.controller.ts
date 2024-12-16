import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { ForgetPasswordResponseDto } from "src/swagger/respnse/user/forgetPassword.dto";
import { CreateCategoryResponseDto } from "src/swagger/respnse/categories/createCategoryResponse.dto";
import { CreateCategoryDto } from "src/dto/createCategory.dto";
import { MangerAuthGuard } from "src/guards/ManagerAuthGuard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GeneralAuthGuard } from "src/guards/GeneralAuthGuard";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: "create category" })
  @ApiResponse({
    status: 200,
    description: "The category has been successfully created.",
    type: CreateCategoryResponseDto,
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(MangerAuthGuard)
  async createCategory(
    @Body() data: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.categoryService.createCategory(data, file);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: 200,
    description: "The categories have been successfully fetched.",
    type: [CreateCategoryResponseDto],
  })
  @UseGuards(GeneralAuthGuard)
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }
}
