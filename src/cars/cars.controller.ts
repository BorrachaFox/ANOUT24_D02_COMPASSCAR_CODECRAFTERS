import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import {
  DeleteResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  PostResponses,
} from 'src/swagger/swagger-cars';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Status } from '@prisma/client';

@ApiBearerAuth('access-token')
@UseGuards(IsAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @PostResponses()
  @Post()
  create(@Body() createCarDto: CreateCarDTO) {
    return this.carsService.create(createCarDto);
  }

  @GetAllResponses()
  @Get()
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'km', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'daily_rate', required: false, type: Number })
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
  @HttpCode(204)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDTO,
  ) {
    return this.carsService.update(id, updateCarDto);
  }

  @DeleteResponses()
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}
