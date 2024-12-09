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
