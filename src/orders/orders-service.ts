import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdersDto } from './dto/create-order-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrdersDto: CreateOrdersDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: createOrdersDto.client_id },
    });

    if (!client) {
      throw new Error('Client ID is invalid or does not exist.');
    }

    const car = await this.prisma.car.findUnique({
      where: { id: createOrdersDto.car_id },
    });
    console.log(car, client);

    if (!createOrdersDto.car_id) {
      throw new Error('Car ID is required.');
    }

    return this.prisma.order.create({
      data: createOrdersDto,
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
