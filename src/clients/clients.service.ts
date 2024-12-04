import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    try {
      this.prisma.client.findFirst({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException();()
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      await this.prisma.client.update({
        where: { id },
        data: { ...updateClientDto },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const orderVerification = await this.prisma.order.findFirst({
      where: {
        client_id: id,
        status: {
          in: ['ACTIVE', 'PENDING']
        },
      }
    })
    if (orderVerification) {
      throw new BadRequestException('Client contains pending or active order.')
    }

    try {
      await this.prisma.client.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

