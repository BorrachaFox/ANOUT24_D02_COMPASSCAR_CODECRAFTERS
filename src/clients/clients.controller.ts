import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';
import {
  PostResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  DeleteResponses,
} from 'src/swagger/swagger-clients';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Status } from '@prisma/client';

@ApiBearerAuth('access-token')
@UseGuards(IsAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @PostResponses()
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @GetAllResponses()
  @Get()
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'cpf', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  async findAll(@Query() query: any) {
    return this.clientsService.findAll(query);
  }

  @GetOneResponses()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @PatchResponses()
  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @DeleteResponses()
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
