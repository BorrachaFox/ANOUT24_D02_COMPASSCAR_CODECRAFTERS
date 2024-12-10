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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IsAuthGuard } from '../guards/auth/isAuth.guards';
import { CreateOrdersDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import {
  DeleteResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  PostResponses,
} from 'src/swagger/swagger-orders';

@ApiBearerAuth('access-token')
@UseGuards(IsAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @PostResponses()
  @Post()
  create(@Body() createOrdersDto: CreateOrdersDto) {
    return this.ordersService.create(createOrdersDto);
  }

  @GetAllResponses()
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @GetOneResponses()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @PatchResponses()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @DeleteResponses()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
