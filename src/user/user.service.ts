// src/users/user.service.ts

import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { UpdateUserDto } from "src/dto/updateUser.dto";
import { handleImageUploads } from "src/utils/saveImage";

@Injectable()
export class UserService {
  fileService: any;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // Find all users
  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  // Update a user's details
    async updateUser(
       id: number,
       data: UpdateUserDto,
       file: Express.Multer.File
     ) {
       const user = await this.prisma.user.findUnique({
         where: { id },
       });
       if (!user) {
         throw new BadRequestException("user not found");
       }
   
       let image = "";
       let cityId: number;
       if (file) {
         await this.fileService.deleteFile(user.image);
         image = await handleImageUploads(file, "users");
       }
   
       // get city
       if (data.cityId) {
         let city = await this.prisma.city.findUnique({
           where: { id: Number(data.cityId) },
           select: { id: true },
         });
   
         if (!city) {
           throw new BadRequestException("City not found");
         }
   
         cityId = city.id;
       } else {
         cityId = user.cityId;
       }
   
       const updateduser = await this.prisma.user.update({
         where: { id },
         data: {
           image: image ? image : user.image,
           cityId: cityId,
           fullname: data.fullname ? data.fullname : user.fullname,
           phone: data.phone ? data.phone : user.phone,
           address: data.address ? data.address : user.address,
           postalCode: data.postalCode ? data.postalCode : user.postalCode,
         },
         select: {
           id: true,
           fullname: true,
           email: true,
           image: true,
           phone: true,
           address: true,
           postalCode: true,
           status: true,
           role: true,
   
           city: {
             select: {
               id: true,
               name: true,
               country: {
                 select: {
                   id: true,
                   name: true,
                 },
               },
             },
           },
         },
       });
       return updateduser;
     }
  }
