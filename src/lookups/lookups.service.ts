import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LookupsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContries() {
    return await this.prisma.country.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getCities(country: string) {
    return await this.prisma.city.findMany({
      where: {
        countryId: Number(country),
      },

      select: {
        id: true,
        name: true,
        country: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
