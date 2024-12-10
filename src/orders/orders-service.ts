import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Status } from '@prisma/client';
import { CarsService } from '../cars/cars.service';
import { ClientsService } from '../clients/clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import { SaveOrderDto } from './dto/save-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientService: ClientsService,
    private readonly carService: CarsService,
  ) {}

  async create(createOrdersDto: CreateOrdersDto) {
    await this.clientService.existsClient(createOrdersDto.client_id);

    const cepFormatado = createOrdersDto.cep.replace(/\D/g, '');
    if (cepFormatado.length !== 8) {
      throw new BadRequestException(
        'Invalid CEP. The CEP must have 8 numbers.',
      );
    }

    const car = await this.carService.existsCar(createOrdersDto.car_id);
    const dataCEP = await this.fetchViaAPI(cepFormatado);
    if (!dataCEP || dataCEP.erro) {
      throw new BadRequestException(
        'Invalid CEP. No data found for the provided CEP.',
      );
    }

    const startDate = new Date(createOrdersDto.start_date).toISOString();
    const finalDate = new Date(createOrdersDto.final_date).toISOString();

    const diffInMs =
      new Date(createOrdersDto.final_date).valueOf() -
      new Date(createOrdersDto.start_date).valueOf();
    const diffInDays = diffInMs / (1000 * 60 * 60);

    const rental_fee = Number(dataCEP.gia) / 100;

    const orderCreating: SaveOrderDto = {
      ...createOrdersDto,
      start_date: startDate,
      final_date: finalDate,
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const validateOrder = await this.existsOrder(id);
    let uf, city, rentalFee;
    if (updateOrderDto.cep) {
      const cepData = await this.fetchViaAPI(updateOrderDto.cep);
      uf = cepData.uf;
      city = cepData.city;
      rentalFee = cepData.rentalFee;
    }
    let validateCar = null;

    if (updateOrderDto.car_id) {
      await this.validateCarOrder(updateOrderDto.car_id);
      const existingOrderWithCar = await this.prisma.order.findFirst({
        where: {
          car_id: updateOrderDto.car_id,
          status: {
            not: OrderStatus.CLOSED,
          },
          NOT: {
            id: id,
          },
        },
      });
      if (existingOrderWithCar) {
        throw new ConflictException(
          'The car is already associated with an open or approved order.',
        );
      }
    } else {
      const order = await this.prisma.order.findFirst({
        where: {
          id: id,
        },
      });
      validateCar = await this.prisma.car.findFirst({
        where: {
          id: order.car_id,
        },
      });
    }

    const currentDate = new Date(
      new Date().toISOString().split('T')[0],
    ).getTime();
    const startDate = updateOrderDto.start_date
      ? new Date(
          new Date(updateOrderDto.start_date).toISOString().split('T')[0],
        ).getTime()
      : new Date(
          new Date(validateOrder.start_date).toISOString().split('T')[0],
        ).getTime();
    const finalDate = updateOrderDto.final_date
      ? new Date(
          new Date(updateOrderDto.final_date).toISOString().split('T')[0],
        ).getTime()
      : new Date(
          new Date(validateOrder.final_date).toISOString().split('T')[0],
        ).getTime();
    const days = Math.ceil((finalDate - startDate) / (1000 * 3600 * 24));

    const totalRentalPrice =
      validateCar.daily_rate * days +
      parseFloat(rentalFee || validateOrder.rental_fee);

    let status = validateOrder.status;
    if (updateOrderDto.status) {
      if (
        updateOrderDto.status === 'APPROVED' &&
        validateOrder.status === 'OPEN'
      ) {
        status = 'APPROVED';
      } else if (
        updateOrderDto.status === 'CLOSED' &&
        validateOrder.status === 'APPROVED'
      ) {
        status = 'CLOSED';
      }
    }

    let lateFee = validateOrder.late_fee;
    console.log(finalDate);
    console.log(currentDate);
    if (updateOrderDto.status === 'CLOSED' && currentDate > finalDate) {
      console.log(`a`);
      const overdueDays = Math.ceil(
        (currentDate - finalDate) / (1000 * 3600 * 24),
      );
      console.log(overdueDays);
      lateFee = 2 * validateCar.daily_rate * overdueDays;
    }
    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        status: status,
        uf: uf || validateOrder.uf,
        city: city || validateOrder.city,
        rental_fee: parseFloat(rentalFee || validateOrder.rental_fee),
        total_rental_price: totalRentalPrice,
        update_at: new Date(),
        late_fee: lateFee,
        order_closing_time:
          updateOrderDto.status === 'CLOSED'
            ? new Date()
            : validateOrder.order_closing_time,
      },
    });
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

  async validateCarOrder(id: number) {
    const validateCar = await this.carService.existsCar(id);
    if (validateCar.status != Status.ACTIVE) {
      throw new ConflictException('Car is not active');
    }
    return validateCar;
  }
}
