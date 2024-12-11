// src/prisma/prisma.service.ts

import { Injectable, OnModuleDestroy, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnApplicationShutdown {
  constructor() {
    super();
  }

  // Gracefully disconnect Prisma Client when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Gracefully disconnect Prisma Client when the application is shutting down
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
