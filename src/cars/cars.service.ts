import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDTO } from './dto/create-car.dto';
import { UpdateCarDTO } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDTO) {
    createCarDto.plate = createCarDto.plate.toUpperCase();
    const existingCar = await this.prisma.car.findFirst({
      where: {
        plate: createCarDto.plate,
        status: Status.ACTIVE,
      },
    });

    if (existingCar) {
      throw new ConflictException(
        'There is already a car with that same license plate.',
      );
    }
    return this.prisma.car.create({ data: createCarDto });
  }

  findAll(query) {
    const where: Record<string, any> = {};

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    let limit = parseInt(query.limit, 10) || 5;

    if (limit <= 0) {
      limit = 5;
    } else if (limit > 10) {
      limit = 10;
    }

    const take: number = Number(limit);
    const skip: number = Number((page - 1) * limit);

    const { brand, km, year, status, daily_rate } = query;

    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    if (km) where.km = { gte: Number(km) };
    if (year) where.year = { gte: Number(year) };
    if (status) where.status = { contains: status, mode: 'insensitive' };
    if (daily_rate) where.daily_rate = { gte: Number(daily_rate) };

    return this.prisma.car.findMany({
      where,
      skip,
      take,
    });
  }

  findOne(id: number) {
    return this.existsCar(id);
  }

  async update(id: number, updateCarDto: UpdateCarDTO) {
    await this.existsCar(id);
    const { brand, model, plate, items, km, year, daily_rate } = updateCarDto;
    //const data: Record<string, any> = {};
    const data: UpdateCarDTO = {};

    if (!brand && model) throw new BadRequestException('brand is required');
    if (brand && !model) throw new BadRequestException('model is required');

    if (brand) data.brand = brand;
    if (model) data.model = model;
    if (plate) data.plate = plate.toUpperCase();
    if (items) data.items = items;
    if (km) data.km = km;
    if (year) data.year = year;
    if (daily_rate) data.daily_rate = daily_rate;
    data.update_at = new Date();
    await this.prisma.car.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const presentData = await this.existsCar(id);
    await this.prisma.car.update({
      where: { id },
      data: {
        status: Status.INACTIVE,
      },
    });
  }

  async existsCar(id: number) {
    const existingCar = await this.prisma.car.findFirst({
      where: { id },
    });
    if (!existingCar) {
      throw new BadRequestException('Car not found.');
    }
    return existingCar;
  }
}
