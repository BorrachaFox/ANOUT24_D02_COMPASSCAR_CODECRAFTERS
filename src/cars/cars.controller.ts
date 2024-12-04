import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';
import { UserEmailActiveGuard } from "src/guards/user/user-email-active.guard";
import { CarNotFoundGuard } from '../guards/cars/car-not-found.guard';
import { CarsService } from './cars.service';

@UseGuards(IsAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(UserEmailActiveGuard)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(CarNotFoundGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CarNotFoundGuard)
  update(@Param('id',ParseIntPipe) id: number, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(CarNotFoundGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}
