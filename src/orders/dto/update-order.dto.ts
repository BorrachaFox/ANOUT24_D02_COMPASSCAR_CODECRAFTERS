import { PartialType } from '@nestjs/mapped-types';
import { OrderSaveDTO } from './order-save.dto';

export class UpdateOrderDto extends PartialType(OrderSaveDTO) {}
