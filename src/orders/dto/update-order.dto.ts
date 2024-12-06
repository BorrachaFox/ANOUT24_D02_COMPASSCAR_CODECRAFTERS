import { PartialType } from '@nestjs/swagger';
import { OrderSaveDTO } from './order-save.dto';

export class UpdateOrderDto extends PartialType(OrderSaveDTO) {}
