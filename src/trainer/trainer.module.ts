import { Module } from '@nestjs/common';
import { TrainerController } from './trainer.controller';
import { TrainerService } from './trainer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/utils/fileService';

@Module({
  controllers: [TrainerController],
  providers: [TrainerService, PrismaService, FileService]
})
export class TrainerModule {}
