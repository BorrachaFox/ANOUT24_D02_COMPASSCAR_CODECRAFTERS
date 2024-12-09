import { PartialType } from '@nestjs/mapped-types';
import { SaveOrderDto } from './save-order.dto';
import { $Enums, OrderStatus } from '@prisma/client';
import { IsIn } from 'class-validator';

export class UpdateOrderDto extends PartialType(SaveOrderDto) {
  @IsIn([
    OrderStatus.OPEN,
    OrderStatus.APPROVED,
    OrderStatus.CLOSED,
    OrderStatus.CANCELED,
  ])
  status?: $Enums.OrderStatus;
}
