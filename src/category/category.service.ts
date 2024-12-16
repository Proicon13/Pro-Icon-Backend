import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "src/dto/createCategory.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { handleImageUploads } from "src/utils/saveImage";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto, file: Express.Multer.File) {
    // check if file exists
    try {
      //check if category exists
      const category = await this.prisma.category.findUnique({
        where: {
          name: data.name,
        },
      });

      if (category) {
        throw new BadRequestException("Category already exists");
      }

      let image = "";
      if (file) {
        image = await handleImageUploads(file, "categories");
      }
      return this.prisma.category.create({
        data: { ...data, image },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          programs: {
            select: {
              id: true,
              name: true,
              description: true,
              duration: true,
              image: true,
              createdById: true,
              pulse: true,
              hertez: true,
            },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }



  async getAllCategories() {
    return await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        programs: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            image: true,
            createdById: true,
            pulse: true,
            hertez: true,
        
          },
        },
      },
    });
  }
}
