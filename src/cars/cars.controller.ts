import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';
import { CarsService } from './cars.service';
import { CreateCarDTO } from './dto/create-car.dto';
import { UpdateCarDTO } from './dto/update-car.dto';
import { CarPlateFormatGuard } from '../guards/cars/car-plate-format.guard';
import {
  DeleteResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  PostResponses,
} from 'src/swagger/swagger-cars';

@UseGuards(IsAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @PostResponses()
  @Post()
  @UseGuards(CarPlateFormatGuard)
  create(@Body() createCarDto: CreateCarDTO) {
    return this.carsService.create(createCarDto);
  }

  @GetAllResponses()
  @Get()
  async findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @GetOneResponses()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOne(id);
  }

  @PatchResponses()
  @Patch(':id')
  @UseGuards(CarPlateFormatGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDTO,
  ) {
    return this.carsService.update(id, updateCarDto);
  }

  @DeleteResponses()
  @Delete(':id')
  //@UseGuards(CarNotFoundGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}
