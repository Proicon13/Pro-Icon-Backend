import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { createClientDto } from "src/dto/createClient.dto";
import { updateClientDto } from "src/dto/updateClient.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/utils/fileService";
import { handleImageUploads } from "src/utils/saveImage";

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private fileService: FileService
  ) {}

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

  async getAllClients(
    userId: number,
    role: string,
    page,
    perPage,
    searchKey,
    orderBy
  ) {
    const skip = ((page || 1) - 1) * (perPage || 10);
    const take = Number(perPage || 10);

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

    // Initialize whereClause as an empty object
    let whereClause: any = {};

    // Initialize an array to hold the OR conditions
    const orConditions: any = [];
    const orderByList: any = [];

    // Apply email filter if provided
    if (searchKey) {
      orConditions.push({
        email: {
          contains: searchKey.toString(),
          mode: "insensitive",
        },

        fullname: {
          contains: searchKey.toString(),
          mode: "insensitive",
        },
      });
    }

    // Apply role-based filters
    if (role === Role.TRAINER) {
      whereClause.userId = userId; // Directly add userId condition for trainers
    }

    // If there are OR conditions, add them to whereClause
    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

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

    // Get the count of matching clients
    const clientCount = await this.prisma.client.count({
      where: whereClause,
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(clientCount / perPage);

    // Fetch the clients with pagination and filters
    const clients = await this.prisma.client.findMany({
      skip,
      take,
      where: whereClause,
      select: commonSelect,
      orderBy: orderByList,
    });

    return {
      clients,
      totalPages: totalPages || 1,
    };
  }

  async getClientById(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
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

    if (!client) {
      throw new BadRequestException("Client not found");
    }
    return client;
  }

  async updateClient(
    id: number,
    data: updateClientDto,
    file: Express.Multer.File
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new BadRequestException("Client not found");
    }

    let image = "";
    let cityId: number;
    if (file) {
      await this.fileService.deleteFile(client.image);
      image = await handleImageUploads(file, "clients");
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
      cityId = client.cityId;
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: {
        image: image ? image : client.image,
        cityId: cityId,
        status: data.status ? data.status : client.status,
        fullname: data.fullname ? data.fullname : client.fullname,
        phone: data.phone ? data.phone : client.phone,
        address: data.address ? data.address : client.address,
        postalCode: data.postalCode ? data.postalCode : client.postalCode,
        gender: data.gender ? data.gender : client.gender,
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
    return updatedClient;
  }
}
