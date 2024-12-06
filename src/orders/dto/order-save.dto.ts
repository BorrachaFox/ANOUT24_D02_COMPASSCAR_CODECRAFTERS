import { CreateOrdersDto } from './create-order.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderSaveDTO extends CreateOrdersDto {
  @IsString()
  uf: string;

  @IsString()
  city: string;

  @IsNumber()
  rental_fee?: number;

  @IsNumber()
  total_rental_price: number;

  @IsDateString()
  order_closing_time?: Date;

  @IsNumber()
  late_fee?: Date;
}
