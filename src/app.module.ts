import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LookupsModule } from './lookups/lookups.module';

@Module({
  imports: [UserModule, AuthModule, LookupsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
