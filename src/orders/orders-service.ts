import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdersDto } from './dto/create-order-dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  private async buscarCepEValidar(cep: string) {
    const cepFormatado = cep.replace(/\D/g, '');
    if (cepFormatado.length !== 8) {
      throw new BadRequestException('Invalid CEP. The CEP must have 8 numbers.');
    }
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);
      if (response.data.erro) {
        throw new NotFoundException('CEP not found.');
      }
      const { uf, localidade, gia } = response.data;
      const rentalFee = (parseInt(gia) / 100).toFixed(2);
      return { uf, city: localidade, rentalFee };
    } catch (error) {
      throw error;
    }
  }
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

  async update(id: number, updateOrderDto: UpdateOrderDTO) {
   const validateOrder = await this.prisma.order.findFirst({ where: {id}});
    if (!validateOrder) {
      throw new NotFoundException('Order not found.');
    }
    let uf, city, rentalFee;
    if (updateOrderDto.cep) {
      const cepData = await this.buscarCepEValidar(updateOrderDto.cep);
      uf = cepData.uf;
      city = cepData.city;
      rentalFee = cepData.rentalFee;
    }
    let validateCar = null
    if (updateOrderDto.car_id) {
      validateCar = await this.prisma.car.findFirst({
        where: {
          id : updateOrderDto.car_id,
          status: 'ACTIVE',
        },
      });
      if (!validateCar) {
        throw new ConflictException('Car is not active');
      }
      const existingOrderWithCar = await this.prisma.order.findFirst({
        where: {
          car_id: updateOrderDto.car_id,
          status: {
            not: 'CLOSED',
          },
          NOT: {
            id: id,
          },
        },
      });
      if (existingOrderWithCar) {
        throw new ConflictException('The car is already associated with an open or approved order.');
      }
    } else {
      const order = await this.prisma.order.findFirst({
        where: {
          id : id,
        },
      });
      validateCar = await this.prisma.car.findFirst({
        where: {
          id : order.car_id,
        },
      });
    }

    const currentDate = new Date(new Date().toISOString().split('T')[0]).getTime()
    const startDate = updateOrderDto.start_date 
      ? new Date(new Date(updateOrderDto.start_date).toISOString().split('T')[0]).getTime() 
      : new Date(new Date(validateOrder.start_date).toISOString().split('T')[0]).getTime();
    const finalDate = updateOrderDto.final_date 
      ? new Date(new Date(updateOrderDto.final_date).toISOString().split('T')[0]).getTime() 
      : new Date(new Date(validateOrder.final_date).toISOString().split('T')[0]).getTime();

    const days = Math.ceil((finalDate - startDate) / (1000 * 3600 * 24));
 
    const totalRentalPrice = (validateCar.daily_rate * days) 
      + parseFloat(rentalFee || validateOrder.rental_fee);

    let status = validateOrder.status;
    if(updateOrderDto.status) {
      if (updateOrderDto.status === 'APPROVED' && validateOrder.status === 'OPEN') {
        status = 'APPROVED'
      } else if (updateOrderDto.status === 'CLOSED' && validateOrder.status === 'APPROVED') {
        status = 'CLOSED'
      }
    }
    
    let lateFee = validateOrder.late_fee
    console.log(finalDate)
    console.log(currentDate)
    if(updateOrderDto.status === 'CLOSED' && currentDate > finalDate) {
      console.log(`a`)
      const overdueDays = Math.ceil((currentDate - finalDate) / (1000 * 3600 * 24));
      console.log(overdueDays)
      lateFee = 2 * validateCar.daily_rate * overdueDays;
    }
    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        status : status,
        uf: uf || validateOrder.uf,
        city: city || validateOrder.city,
        rental_fee: parseFloat(rentalFee || validateOrder.rental_fee),
        total_rental_price: totalRentalPrice,
        update_at: new Date(),
        late_fee : lateFee,
        order_closing_time: 
          (updateOrderDto.status === 'CLOSED'
            ? new Date()
            : validateOrder.order_closing_time
          ),
      },
    });
  }
}
