import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateOrdersDto {
  @IsInt()
  client_id: number;

  @IsInt()
  car_id: number;

  @Type(() => Date)
  @IsDate()
  start_date: string;

  @IsDate()
  @Type(() => Date)
  final_date: string;

  @IsString()
  cep: string;

  @IsString()
  uf: string;

  @IsString()
  city: string;

  @IsNumber()
  rental_fee: number;

  @IsNumber()
  total_rental_price: number;

  @Type(() => Date)
  @IsDate()
  order_closing_time: Date;

  @IsNumber()
  late_fee: number;
}
