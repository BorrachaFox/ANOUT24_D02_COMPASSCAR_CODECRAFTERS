import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ValidateClient } from './utils/validate-client.utils';
import { CPFDocumentUtils } from './utils/cpf-formater-client.utils';
import { OrderStatus, Status } from '@prisma/client';
import { query } from 'express';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const cpf = CPFDocumentUtils.formatCPF(createClientDto.cpf);
    const today = new Date();
    const birthday = new Date(createClientDto.birthday);
    const clientAge = today.getFullYear() - birthday.getFullYear();

    ValidateClient.validateAge(clientAge);

    const clientFound = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: createClientDto.email }, { cpf: createClientDto.cpf }],
      },
    });

    if (clientFound) {
      ValidateClient.emailUsing(clientFound.email, createClientDto.email);
      ValidateClient.cpfUsing(clientFound.cpf, cpf);
    }

    return this.prisma.client.create({
      data: {
        ...createClientDto,
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
        skip,
        take,
      });
      ValidateClient.clientFiltersFounded(client);

      return client;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    await this.existsClient(id);
    try {
      return this.prisma.client.findFirst({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.existsClient(id);
    const birthday = new Date(updateClientDto.birthday);

    if (updateClientDto.birthday) {
      const today = new Date();
      const clientAge = today.getFullYear() - birthday.getFullYear();
      ValidateClient.validateAge(clientAge);
    }

    const clientFound = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: updateClientDto.email }, { cpf: updateClientDto.cpf }],
      },
    });
    if (clientFound) {
      ValidateClient.emailUsing(clientFound.email, updateClientDto.email);
      ValidateClient.cpfUsing(
        clientFound.cpf,
        CPFDocumentUtils.formatCPF(updateClientDto.cpf),
      );
    }

    if (updateClientDto.cpf) {
      updateClientDto.cpf = CPFDocumentUtils.formatCPF(updateClientDto.cpf);
    }

    const data = updateClientDto.birthday
      ? { ...updateClientDto, birthday }
      : { ...updateClientDto };

    try {
      this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    await this.existsClient(id);
    const orderVerification = await this.prisma.order.findFirst({
      where: {
        client_id: id,
        status: {
          in: [OrderStatus.OPEN, OrderStatus.APPROVED],
        },
      },
    });

    if (orderVerification) {
      throw new BadRequestException('Client contains pending or active order.');
    }

    try {
      await this.prisma.client.update({
        where: { id },
        data: { status: Status.INACTIVE },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existsClient(id: number) {
    const client = await this.prisma.client.findFirst({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException('Client does not exist');
    }
  }

  function CpfValidations(cpf: string): boolean {
    const cpfNumbersOnly = cpf.replace(/\D/g, '');

    if (cpfNumbersOnly.length !== 11 || /^(\d)\1+$/.test(cpfNumbersOnly)) {
      return false;
    }

    const calculateDigit = (base: string, initialWeight: number): number => {
      const sum = base.split('').reduce((acc, num, idx) => {
        return acc + parseInt(num) * (initialWeight - idx);
      }, 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const base = cpfNumbersOnly.substring(0, 9);
    const digito1 = calculateDigit(base, 10);
    const digito2 = calculateDigit(base + digito1, 11);

    return cpfNumbersOnly === base + digito1.toString() + digito2.toString();
  }
}
