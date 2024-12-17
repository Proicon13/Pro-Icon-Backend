import { BadRequestException, Injectable } from "@nestjs/common";
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
        }
      }


    });

    const{createdAt,updatedAt,cityId,userId,...result} = clientData
    return result
  }
}
