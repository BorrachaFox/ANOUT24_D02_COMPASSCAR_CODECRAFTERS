import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const today = new Date();
    const birthday = new Date(createClientDto.birthday);
    const clientAge = today.getFullYear() - birthday.getFullYear();

    if (clientAge <= 18) {
      throw new BadRequestException('Client must be 18 years or older');
    }

    const conflictingClient = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: createClientDto.email }, { cpf: createClientDto.cpf }],
      },
    });

    if (conflictingClient) {
      if (conflictingClient.email === createClientDto.email) {
        throw new ConflictException(
          'Email already in use by an active client.',
        );
      }
      if (conflictingClient.cpf === createClientDto.cpf) {
        throw new ConflictException('Cpf already in use by an active client.');
      }
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
    await this.existsClient(id);
    return this.prisma.client.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.existsClient(id);
    const birthday = new Date(updateClientDto.birthday);

    if (updateClientDto.birthday) {
      const today = new Date();
      const clientAge = today.getFullYear() - birthday.getFullYear();

      if (clientAge <= 18) {
        throw new BadRequestException('Client must be 18 years or older');
      }
    }

    const conflictingClient = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: updateClientDto.email }, { cpf: updateClientDto.cpf }],
      },
    });

    if (conflictingClient) {
      if (conflictingClient.email === updateClientDto.email) {
        throw new ConflictException(
          'Email already in use by an active client.',
        );
      }
      if (conflictingClient.cpf === updateClientDto.cpf) {
        throw new ConflictException('Cpf already in use by an active client.');
      }
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
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.existsClient(id);
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

  async existsClient(id: number) {
    const client = await this.prisma.client.findFirst({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException('Client does not exist');
    }
  }
}
