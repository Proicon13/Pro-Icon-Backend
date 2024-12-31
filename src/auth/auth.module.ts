import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModule } from "src/user/user.module";
import { MailService } from "src/mail/mail.service";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true, // This makes the JWT configuration available globally
      secret: process.env.JWT_SECRET || "defaultSecretKey", // Fall back to a default secret if not set
    }),
  ],
  providers: [
    AuthService,
    PrismaService, // PrismaService for database interaction
    MailService,
  ],
  exports: [AuthService], // Export AuthService to be used in other modules
  controllers: [AuthController],
})
export class AuthModule {}
