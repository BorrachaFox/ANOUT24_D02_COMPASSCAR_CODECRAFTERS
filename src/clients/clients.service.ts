import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(CreateClientDto: CreateClientDto) {
    const today = new Date();
    const birthday = new Date(CreateClientDto.birthday);
    const clientAge = today.getFullYear() - birthday.getFullYear();

    if (clientAge <= 18) {
      throw new BadRequestException('Client must be 19 years or older');
    }

    return this.prisma.client.create({
      data: {
        ...CreateClientDto,
        birthday,
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

      if (client.length === 0) {
        throw new NotFoundException('No client found');
      }

      return client;
    } catch {
      throw new NotFoundException('client not found with this filter');
    }
  }

  async findOne(id: number) {
    try {
      this.prisma.client.findFirst({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({
      where: {
        id,
      },
    });

    if (updateClientDto.birthday) {
      const today = new Date();
      const birthday = new Date(updateClientDto.birthday);
      const clientAge = today.getFullYear() - birthday.getFullYear();

      if (clientAge <= 18) {
        throw new BadRequestException('Client must be 18 years or older');
      }
    }

    if (updateClientDto.email && updateClientDto.email != client.email) {
      const emailAlreadyExist = await this.prisma.client.findFirst({
        where: {
          email: updateClientDto.email,
        },
      });

      if (emailAlreadyExist) {
        throw new ConflictException(
          'Email already in use by an active client.',
        );
      }
    }

    if (updateClientDto.cpf && updateClientDto.cpf != client.cpf) {
      const cpfAlreadyExist = await this.prisma.client.findFirst({
        where: {
          cpf: updateClientDto.cpf,
        },
      });

      if (cpfAlreadyExist) {
        throw new ConflictException('Cpf already in use by an active client.');
      }
    }

    try {
      return this.prisma.client.update({
        where: { id },
        data: {
          ...updateClientDto,
        },
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
          in: ['OPEN', 'APPROVED'],
        },
      },
    });

    if (orderVerification) {
      throw new BadRequestException('Client contains pending or active order.');
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
