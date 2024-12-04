import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(CreateClientDto: CreateClientDto) {
    const today = new Date();
    const age = new Date(CreateClientDto.birthday);
    const clientAge = today.getFullYear() - age.getFullYear();

    if (clientAge <= 18) {
      throw new BadRequestException('Client must be 19 years or older');
    }

    return this.prisma.client.create({
      data: {
        ...CreateClientDto,
        birthday: age,
      },
    });
  }

  async findAll(email: string, name: string, status: string, cpf: string) {
    const where: any = {};
    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (cpf) {
      where.cpf = {
        contains: cpf,
      };
    }

    if (status) {
      where.status = status;
    }

    try {
      const client = await this.prisma.client.findMany({
        where,
      });
      console.log(client);

      if (client.length === 0) {
        throw new NotFoundException('No client found');
      }

      return client;
    } catch {
      throw new NotFoundException('client not found with this filter');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
