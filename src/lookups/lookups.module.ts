import { Module } from "@nestjs/common";
import { LookupsController } from "./lookups.controller";
import { LookupsService } from "./lookups.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [LookupsController],
  providers: [LookupsService, PrismaService],
})
export class LookupsModule {}
