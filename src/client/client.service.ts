import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { Strategy } from "passport-jwt";
import { ClientStrategyDto } from "src/dto/clientStrategy.dto";
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
    trainerId: number,
    role: Role
  ) {
    if (role !== Role.TRAINER && role !== Role.ADMIN) {
      throw new BadRequestException("You are not allowed to create a client");
    }

    const existingClient = await this.prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      throw new BadRequestException("Client already exists");
    }

    let image = "";
    if (file) {
      image = await handleImageUploads(file, "clients");
    }

    const clientData = await this.prisma.client.create({
      data: {
        ...data,
        image,
        userId: trainerId,
        cityId: parseInt(data.cityId),
        weight: parseInt(data.weight),
        height: parseInt(data.height),
      },
      select: this.getClientSelectFields(),
    });

    return clientData;
  }

  async getAllClients(userId: number, user: any, page, perPage, searchKey, orderBy) {
    const skip = ((page || 1) - 1) * (perPage || 5);
    const take = Number(perPage || 5);

    const whereClause = await this.buildWhereClause(userId, user, searchKey);
    const orderByList = this.getOrderByList(orderBy);

    const clientCount = await this.prisma.client.count({ where: whereClause });
    const totalPages = Math.ceil(clientCount / take);

    const clients = await this.prisma.client.findMany({
      skip,
      take,
      where: whereClause,
      select: this.getClientSelectFields(),
      orderBy: orderByList,
    });

    return { clients, totalPages: totalPages || 1 };
  }

  async getClientById(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: this.getClientSelectFields(),
    });

    if (!client) {
      throw new BadRequestException("Client not found");
    }

    return client;
  }

  async updateClient(id: number, data: updateClientDto, file: Express.Multer.File) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new BadRequestException("Client not found");
    }

    let image = file ? await this.updateClientImage(client.image, file) : client.image;
    const cityId = data.cityId
      ? await this.validateAndFetchCityId(data.cityId)
      : client.cityId;

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: this.buildUpdateClientData(data, client, image, cityId),
      select: this.getClientSelectFields(),
    });

    return updatedClient;
  }

  async addInjuryToClient(clientId: number, injuryId: number) {
    const client = await this.ensureClientExists(clientId);
    const injury = await this.ensureInjuryExists(injuryId);

    const clientInjury = await this.prisma.clientInjury.findFirst({
      where: { clientId, injuryId },
    });

    if (clientInjury) {
      await this.prisma.clientInjury.delete({
        where: { clientId_injuryId: { clientId, injuryId } },
      });

      return { message: "Injury removed from client" };
    }

    await this.prisma.clientInjury.create({ data: { clientId, injuryId } });
    return { message: "Injury added to client" };
  }

  async addDiseaseToClient(clientId: number, diseaseId: number) {
    const client = await this.ensureClientExists(clientId);
    const disease = await this.ensureDiseaseExists(diseaseId);

    const clientDisease = await this.prisma.clientDisease.findFirst({
      where: { clientId, diseaseId },
    });

    if (clientDisease) {
      await this.prisma.clientDisease.delete({
        where: { clientId_diseaseId: { clientId, diseaseId } },
      });

      return { message: "Disease removed from client" };
    }

    await this.prisma.clientDisease.create({ data: { clientId, diseaseId } });
    return { message: "Disease added to client" };
  }

  async getClientInjuriesAndDiseases(clientId: number) {
    const client = await this.ensureClientExists(clientId);

    const [injuries, diseases] = await Promise.all([
      this.prisma.clientInjury.findMany({
        where: { clientId },
        select: { injury: { select: { id: true, name: true } } },
      }),
      this.prisma.clientDisease.findMany({
        where: { clientId },
        select: { disease: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      injuries: injuries.map(({ injury }) => injury),
      diseases: diseases.map(({ disease }) => disease),
    };
  }

  async updateClientStrategy(clientId: number, data: ClientStrategyDto) {
     await this.ensureClientExists(clientId);

  // check if client has a strategy
  const strategy = await this.prisma.clientStrategy.findFirst({
    where: { clientId },
  });

  let strategyData ;

  if (strategy) {
    strategyData= await this.prisma.clientStrategy.update({
      where: { id: strategy.id },
      data: {
        targetWeight: parseInt(data.targetWeight)??strategy.targetWeight,
        muclesMass: parseInt(data.muclesMass)??strategy.muclesMass,
        boudyFatMass: parseInt(data.boudyFatMass)??strategy.boudyFatMass,
        trainingType: data.trainingType ?? strategy.trainingType,
      },
    });
  } else {
    strategyData = await this.prisma.clientStrategy.create({
      data: {
        targetWeight: parseInt(data.targetWeight)??strategy.targetWeight,
        muclesMass: parseInt(data.muclesMass)??  strategy.muclesMass,
        boudyFatMass: parseInt(data.boudyFatMass)??strategy.boudyFatMass,
        clientId,
      },
    });
  }

  delete strategyData.clientId;
  delete strategyData.client;
  return strategyData;
}

async getClientStrategy(clientId: number) {
  await this.ensureClientExists(clientId);
  const strategy = await this.prisma.clientStrategy.findFirst({
    where: { clientId },
    select: {
      targetWeight: true,
      muclesMass: true,
      boudyFatMass: true,
      trainingType: true,
    }
  });

  if (!strategy) {
    return {
      targetWeight: 0,
      muclesMass: 0,
      boudyFatMass: 0,
      trainingType: "STATIC",
    };
  }
  return strategy;
}



//-----------------------------------------------------------------------------------------------------------------------------------------

  // Utility Methods
  private async ensureClientExists(clientId: number) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new BadRequestException("Client not found");
    return client;
  }

  private async ensureInjuryExists(injuryId: number) {
    const injury = await this.prisma.injury.findUnique({ where: { id: injuryId } });
    if (!injury) throw new BadRequestException("Injury not found");
    return injury;
  }

  private async ensureDiseaseExists(diseaseId: number) {
    const disease = await this.prisma.disease.findUnique({ where: { id: diseaseId } });
    if (!disease) throw new BadRequestException("Disease not found");
    return disease;
  }

  private async updateClientImage(currentImage: string, file: Express.Multer.File) {
    await this.fileService.deleteFile(currentImage);
    return await handleImageUploads(file, "clients");
  }

  private async validateAndFetchCityId(cityId: string) {
    const city = await this.prisma.city.findUnique({
      where: { id: Number(cityId) },
      select: { id: true },
    });

    if (!city) throw new BadRequestException("City not found");
    return city.id;
  }

  private buildUpdateClientData(
    data: updateClientDto,
    client: any,
    image: string,
    cityId: number
  ) {
    return {
      image,
      cityId,
      status: data.status ?? client.status,
      fullname: data.fullname ?? client.fullname,
      phone: data.phone ?? client.phone,
      address: data.address ?? client.address,
      postalCode: data.postalCode ?? client.postalCode,
      gender: data.gender ?? client.gender,
      weight: data.weight ? Number(data.weight) : client.weight,
      height: data.height ? Number(data.height) : client.height,
      medicalNotes: data.medicalNotes ?? client.medicalNotes,
    };
  }

  private async buildWhereClause(userId: number, user: any, searchKey?: string) {
    const whereClause: any = {};
    const orConditions: any[] = [];

    if (searchKey) {
      orConditions.push(
        { email: { contains: searchKey, mode: "insensitive" } },
        { fullname: { contains: searchKey, mode: "insensitive" } }
      );
    }

    if (user.role === Role.TRAINER) {
      whereClause.userId = { in: [userId, user.belongToId] };
    } else if (user.role === Role.ADMIN) {
      const trainers = await this.prisma.user.findMany({
        where: { belongToId: userId, role: Role.TRAINER },
      });
      whereClause.userId = { in: trainers.map((t) => t.id).concat(userId) };
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

    return whereClause;
  }

  private getOrderByList(orderBy?: string) {
    const orderByList: any[] = [];

    switch (orderBy) {
      case "ALPHA-ASC":
        orderByList.push({ fullname: "asc" });
        break;
      case "ALPHA-DESC":
        orderByList.push({ fullname: "desc" });
        break;
      case "NEWEST":
        orderByList.push({ createdAt: "desc" });
        break;
      case "OLDEST":
        orderByList.push({ createdAt: "asc" });
        break;
    }

    return orderByList;
  }

  private getClientSelectFields() {
    return {
      id: true,
      fullname: true,
      email: true,
      image: true,
      phone: true,
      address: true,
      postalCode: true,
      status: true,
      gender: true,
      weight: true,
      height: true,
      medicalNotes: true,
      birthDate: true,
      city: {
        select: {
          id: true,
          name: true,
          country: { select: { id: true, name: true } },
        },
      },
      user: { select: { id: true, fullname: true, email: true } },
    };
  }
}
