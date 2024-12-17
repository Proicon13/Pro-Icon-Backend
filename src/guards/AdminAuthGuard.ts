import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Status } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "defaultSecretKey",
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      if (user.role !== "ADMIN") {
        throw new UnauthorizedException("User is not an admin");
      }

      if (user.status !== Status.ACTIVE) {
        throw new UnauthorizedException("User is not active");
      }

      request.user = user;
    

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    console.log(token);
    return type === "Bearer" ? token : undefined;
  }
}
