import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCarDto: CreateCarDto) {
    
    return 'This action adds a new car';
  }

  findAll(query) {
    let { brand, km, year, status, daily_price, page, limit } = query;
    const where: Record<string, any> = {};

    if(((page) && (page > 10)) || (!page)) page = 10;
    if(((limit) && (limit > 5)) || (!limit)) page = 5;

    const take:number = Number(limit)
    let skip: number = Number((page - 1) * limit);

    if(brand) where.brand = { contains: brand};
    if(km) where.km = { contains: km};
    if(year) where.year = { contains: year};
    if(status) where.status = { contains: status};
    if(daily_price) where.daily_price = { contains: daily_price};
    return this.prisma.car.findMany({
        where,
        skip,
        take,
      },
    );
  }

  findOne(id: number) {
    return this.prisma.car.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    const { brand, model, plate, items, km, year, daily_price } = updateCarDto;
    //const data: Record<string, any> = {};
    const data: UpdateCarDto = {}

    if((!brand) && (model)) throw new BadRequestException('brand is required');
    if((brand) && (!model)) throw new BadRequestException('model is required');

    if(brand) data.brand = brand;
    if(model) data.model = model;
    if(plate) data.plate = plate;
    if(items) data.items = items;
    if(km) data.km = km;
    if(year) data.year = year;
    if(daily_price) data.daily_price = daily_price;
    data.update_at = new Date();
    return this.prisma.car.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return this.prisma.car.update({
      where: { id },
      data: {
        status: Status.INACTIVE,
        update_at: new Date(),
      }
    })
  }
}
