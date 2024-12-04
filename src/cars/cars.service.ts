import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';

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
    const carFiltred = this.prisma.car.findMany({
      where,
      skip,
      take,
      },
    );
    return carFiltred;
  }

  findOne(id: number) {
    return this.prisma.car.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
