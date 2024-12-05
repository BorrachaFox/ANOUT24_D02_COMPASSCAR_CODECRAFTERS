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
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';
import { ClientEmailActiveGuard } from 'src/guards/clients/client-email-active.guard';
import { ClientCpfActiveGuard } from 'src/guards/clients/client-cpf-active.guard';
import { ClientNotFoundGuard } from 'src/guards/clients/client-not-found.guard';

@UseGuards(IsAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @UseGuards(ClientEmailActiveGuard, ClientCpfActiveGuard)
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('cpf') cpf?: string,
    @Query('birthday') birthday?: string,
    @Query('email') email?: string,
  ) {
    return this.clientsService.findAll(email, name, birthday, cpf);
  }

  @UseGuards(ClientNotFoundGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @UseGuards(ClientNotFoundGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @UseGuards(ClientNotFoundGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
