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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsAuthGuard } from '../guards/auth/isAuth.guards';
import { CreateOrdersDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { Status } from '@prisma/client';

@ApiBearerAuth('access-token')
@UseGuards(IsAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrdersDto: CreateOrdersDto) {
    return this.ordersService.create(createOrdersDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: String })
  async findAll(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
