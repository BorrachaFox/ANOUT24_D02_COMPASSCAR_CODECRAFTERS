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
}
