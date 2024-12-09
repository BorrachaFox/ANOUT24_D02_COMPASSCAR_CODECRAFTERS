import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ValidateClient } from 'src/clients/utils/validate-client.utils';
import { CPFDocumentUtils } from 'src/clients/utils/cpf-formater-client.utils';
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
    try {
      return this.prisma.client.create({
        data: {
          ...createClientDto,
          birthday,
          cpf,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query) {
    const clientNoFilter = await this.prisma.client.findMany({ take: 1 });
    ValidateClient.clientFoundedAll(clientNoFilter);
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    let limit = parseInt(query.limit, 10) || 5;

    if (limit <= 0) {
      limit = 5;
    } else if (limit > 10) {
      limit = 10;
    }

    const take: number = Number(limit);
    const skip: number = Number((page - 1) * limit);
    
    const where: Record<string, any> = {};
    const { email, name, cpf, status } = query;
    if (email) where.email = { contains: email, mode: 'insensitive'};
    if (name) where.name = { contains: name, mode: 'insensitive'};
    if (cpf) where.cpf = { contains: cpf };
    if (status) where.status = status;

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
      return this.prisma.client.update({
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
}
