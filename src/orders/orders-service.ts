import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import { ClientsService } from '../clients/clients.service';
import { CarsService } from '../cars/cars.service';
import { SaveOrderDto } from './dto/save-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientService: ClientsService,
    private readonly carService: CarsService,
  ) {}

  async create(createOrdersDto: CreateOrdersDto) {
    await this.clientService.existsClient(createOrdersDto.client_id);
    const car = await this.carService.existsCar(createOrdersDto.car_id);
    const dataCEP = await this.fetchViaAPI(createOrdersDto.cep);

    const diffInMs =
      new Date(createOrdersDto.final_date).valueOf() -
      new Date(createOrdersDto.start_date).valueOf();
    const diffInDays = diffInMs / (1000 * 60 * 60);

    const rental_fee = Number(dataCEP.gia) / 100;

    const orderCreating: SaveOrderDto = {
      ...createOrdersDto,
      uf: dataCEP.uf,
      city: dataCEP.localidade,
      rental_fee: rental_fee,
      total_rental_price: car.daily_rate * diffInDays + rental_fee,
    };

    return this.prisma.order.create({ data: orderCreating });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: number) {
    try {
      return this.existsOrder(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const order = await this.existsOrder(id);
    if (order.status != OrderStatus.OPEN) {
      throw new ConflictException('Order cannot be canceled');
    }
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELED, update_at: new Date() },
    });
  }

  async fetchViaAPI(cep: string) {
    const formatCep = cep.split('-');
    const newCep = [...formatCep];
    const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
    return response.json();
  }

  async existsOrder(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
