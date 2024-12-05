import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';

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
    const today = new Date();
    const age = new Date(updateClientDto.birthday);
    const clientAge = today.getFullYear() - age.getFullYear();

    if (clientAge <= 18) {
      throw new BadRequestException('Client must be 19 years or older');
    }

    const { email } = updateClientDto;
    const validateEmail = await this.prisma.client.findFirst({
      where: {
        email,
        status: 'ACTIVE',
      },
    });
    if (validateEmail) {
      throw new ConflictException('Email already in use by an active client.'); //TODO: Possível utils para usar com outros endpoints
    }

    const { cpf } = updateClientDto;
    const validateCpf = await this.prisma.client.findFirst({
      where: {
        cpf,
        status: 'ACTIVE',
      },
    });
    if (validateCpf) {
      throw new ConflictException('Cpf already in use by an active client.'); //TODO: Possível utils para usar com outros endpoints
    }

    try {
      await this.prisma.client.update({
        where: { id },
        data: {
          ...updateClientDto,
          birthday: age,
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
          in: ['ACTIVE', 'PENDING'],
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
