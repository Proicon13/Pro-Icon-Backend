import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiBody, ApiOperation, ApiResponse,ApiConsumes } from '@nestjs/swagger';
import { createClientDto } from 'src/dto/createClient.dto';
import { GlobalErrorResponseDto } from 'src/swagger/respnse/lookups/globalError.dto';
import { TrainerGuard } from 'src/guards/TrainerGuard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { clientResponseDto } from 'src/swagger/respnse/client/createClient.dto';
import { ClientBodyDto } from 'src/dto/clientBody.dto';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService ) {}

    @Post()
    @ApiOperation({ summary: "Create a new client by trainer" })
    @ApiResponse({
      status: 201,
      description: "The client has been successfully created.",
      type: clientResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: "User already exists.",
      type: GlobalErrorResponseDto,
    })
    @ApiBody({ type: ClientBodyDto })
    @ApiConsumes("multipart/form-data")
    @UseGuards(TrainerGuard)
    @UseInterceptors(FileInterceptor("file"))
    
    createClient(@Body() createClientDto: createClientDto, @UploadedFile() file: Express.Multer.File, @Req() req) {
        const userId = req.user.id
        return this.clientService.createClient(createClientDto, file, userId);
    }
}
