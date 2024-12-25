import { BadRequestException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { UpdateUserDto } from "src/dto/updateUser.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/utils/fileService";
import { handleImageUploads } from "src/utils/saveImage";

@Injectable()
export class TrainerService {
  constructor(
    private readonly prisma: PrismaService,
    private fileService: FileService
  ) {}

  async getAllTrainers(
    userId: number,
    role: string,
    page,
    perPage,
    searchKey,
    orderBy
  ) {
    const skip = ((page || 1) - 1) * (perPage || 10);
    const take = Number(perPage || 10);

    if (role !== Role.ADMIN && role !== Role.MANAGER) {
      throw new BadRequestException(
        "Only managers and admin can view all trainers"
      );
    }

    // Define the common query structure for selection
    const commonSelect = {
      id: true,
      fullname: true,
      email: true,
      image: true,
      phone: true,
      address: true,
      postalCode: true,
      status: true,
      role: true,
      city: {
        select: {
          id: true,
          name: true,
          country: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    };

    // Initialize whereClause as an empty object
    let whereClause: any = {};

    // Initialize an array to hold the OR conditions
    const orConditions: any = [];
    const orderByList: any = [];

    // Apply email filter if provided
    if (searchKey) {
      orConditions.push({
        email: {
          contains: searchKey,
          mode: "insensitive",
        },
      });

      orConditions.push({
        fullname: {
          contains: searchKey,
          mode: "insensitive",
        },
      });
    }

    // Apply role-based filters
    if (role === Role.ADMIN) {
      whereClause.belongToId = userId; // Admin filters by their own ID
    }

    // If there are OR conditions, add them to whereClause
    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

    whereClause.role = Role.TRAINER;

    if (orderBy) {
      if (orderBy === "ALPHA-ASC") {
        orderByList.push({
          fullname: "asc",
        });
      } else if (orderBy === "ALPHA-DESC") {
        orderByList.push({
          fullname: "desc",
        });
      } else if (orderBy === "NEWEST") {
        orderByList.push({
          createdAt: "desc",
        });
      } else if (orderBy === "OLDEST") {
        orderByList.push({
          createdAt: "asc",
        });
      }
    }

    // Get the count of matching trainers
    const trainerCount = await this.prisma.user.count({
      where: whereClause,
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(trainerCount / perPage);

    // Fetch the trainers with pagination and filters
    const trainers = await this.prisma.user.findMany({
      skip,
      take,
      where: whereClause,
      select: commonSelect,
      orderBy: orderByList,
    });

    return {
      trainers,
      totalPages: totalPages || 1,
    };
  }

  async getTrainerById(id: number) {
    const trainer = await this.prisma.user.findUnique({
      where: { id, role: Role.TRAINER },
      select: {
        id: true,
        fullname: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        postalCode: true,
        status: true,
        role: true,

        city: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!trainer) {
      throw new BadRequestException("Trainer not found");
    }
    return trainer;
  }

  async updateTrainer(
    id: number,
    data: UpdateUserDto,
    file: Express.Multer.File
  ) {
    const trainer = await this.prisma.user.findUnique({
      where: { id, role: Role.TRAINER },
    });
    if (!trainer) {
      throw new BadRequestException("trainer not found");
    }

    let image = "";
    let cityId: number;
    if (file) {
      await this.fileService.deleteFile(trainer.image);
      image = await handleImageUploads(file, "users");
    }

    // get city
    if (data.cityId) {
      let city = await this.prisma.city.findUnique({
        where: { id: Number(data.cityId) },
        select: { id: true },
      });

      if (!city) {
        throw new BadRequestException("City not found");
      }

      cityId = city.id;
    } else {
      cityId = trainer.cityId;
    }

    const updatedtrainer = await this.prisma.user.update({
      where: { id },
      data: {
        image: image ? image : trainer.image,
        cityId: cityId,
        status: data.status ? data.status : trainer.status,
        fullname: data.fullname ? data.fullname : trainer.fullname,
        phone: data.phone ? data.phone : trainer.phone,
        address: data.address ? data.address : trainer.address,
        postalCode: data.postalCode ? data.postalCode : trainer.postalCode,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        postalCode: true,
        status: true,
        role: true,

        city: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return updatedtrainer;
  }

  async deleteTrainer(id: number, userId: number, role: Role) {
    const trainer = await this.prisma.user.findUnique({
      where: { id, role: Role.TRAINER, isDeleted: false },
    });
    if (!trainer) {
      throw new BadRequestException("Trainer not found");
    }

    if (role == Role.ADMIN && trainer.belongToId !== userId) {
      throw new BadRequestException(
        "You cannot delete a trainer that does not belong to you"
      );
    } else if (role == Role.TRAINER) {
      throw new BadRequestException(
        "You cannot delete a trainer that does not belong to you"
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return { message: "Trainer deleted successfully" };
  }
}
