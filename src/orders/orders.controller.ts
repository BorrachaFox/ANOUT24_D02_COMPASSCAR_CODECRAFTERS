import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders-service';
import { CreateOrdersDto } from './dto/create-order-dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrdersDto: CreateOrdersDto) {
    return this.ordersService.create(createOrdersDto);
  }
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDTO,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
