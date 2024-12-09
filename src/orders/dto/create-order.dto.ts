import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ValidateStartDate } from '../../Decorators/orders/validate-start-date.decorator';
import { ValidateEndDate } from '../../Decorators/orders/validate-end-date.decorator';
import { ValidateDateRange } from '../../Decorators/orders/validate-date-range.decorator';

export class CreateOrdersDto {
  @IsInt()
  client_id: number;

  @IsInt()
  car_id: number;

  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.start_date)
  @ValidateStartDate({ message: 'The start date cannot be before today.' })
  start_date: string;

  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.final_date)
  @ValidateEndDate({ message: 'The end date cannot be earlier than today.' })
  @ValidateDateRange({
    message: 'The end date cannot be less than the start date.',
  })
  final_date: string;

  @IsString()
  cep: string;
}
