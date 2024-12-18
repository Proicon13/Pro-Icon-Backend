import { BadRequestException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { createClientDto } from "src/dto/createClient.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { handleImageUploads } from "src/utils/saveImage";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(
    data: createClientDto,
    file: Express.Multer.File,
    trainerId: number
  ) {
    // check if client exists
    const client = await this.prisma.client.findUnique({
      where: {
        email: data.email,
      },
    });

    if (client) {
      throw new BadRequestException("Client already exists");
    }

    let image = "";
    if (file) {
      image = await handleImageUploads(file, "clients");
    }

    const clientData = await this.prisma.client.create({
      data: {
        ...data,
        image: image,
        userId: trainerId,
        cityId: parseInt(data.cityId),
      },
      include: {
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
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    const { createdAt, updatedAt, cityId, userId, ...result } = clientData;
    return result;
  }

  async getAllClients(userId: number, role: string, page, perPage) {
    const skip = ((page || 1) - 1) * (perPage || 10);
    const take = Number(perPage || 10);
    // Define the common query structure
    const commonSelect = {
      id: true,
      fullname: true,
      email: true,
      image: true,
      phone: true,
      address: true,
      postalCode: true,
      status: true,
      gender: true,
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
      user: {
        select: {
          id: true,
          fullname: true,
          email: true,
        },
      },
    };

    // Apply role-based filters
    const whereClause = role === Role.TRAINER ? { userId: userId } : {};

    const clientCount = await this.prisma.client.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(clientCount / perPage);

    const clients = await this.prisma.client.findMany({
      skip,
      take,
      where: whereClause,
      select: commonSelect,
    });

    return {
      clients,
      totalPages: totalPages || 1,
    };
  }
}
