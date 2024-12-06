import { PartialType } from '@nestjs/mapped-types';
import { SaveOrderDto } from './save-order.dto';

export class UpdateOrderDto extends PartialType(SaveOrderDto) {}
