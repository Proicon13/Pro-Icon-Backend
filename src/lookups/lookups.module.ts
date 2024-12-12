import { Module } from "@nestjs/common";
import { LookupsController } from "./lookups.controller";
import { LookupsService } from "./lookups.service";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LookupsService, PrismaService],
  controllers: [LookupsController],
})
export class LookupsModule {}
