import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LookupsModule } from './lookups/lookups.module';
import { MailService } from './mail/mail.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [UserModule, AuthModule, LookupsModule,ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), 
    serveRoot: '/uploads', 
  }), CategoryModule, ClientModule,],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService],
})
export class AppModule {}
