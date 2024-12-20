import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/utils/fileService';

@Module({
  controllers: [ClientController],
  providers: [ClientService, PrismaService,FileService],
})
export class ClientModule {}
