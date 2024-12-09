import { $Enums, OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ValidateDateRange } from 'src/Decorators/orders/validate-date-range.decorator';
import { ValidateEndDate } from 'src/Decorators/orders/validate-end-date.decorator';
import { ValidateStartDate } from 'src/Decorators/orders/validate-start-date.decorator';

export class UpdateOrderDTO {
  @IsOptional()
  @IsInt()
  car_id: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.start_date)
  @IsNotEmpty()
  @ValidateStartDate({ message: 'The start date cannot be before today.' })
  start_date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.final_date)
  @IsNotEmpty()
  @ValidateEndDate({ message: 'The end date cannot be earlier than today.' })
  @ValidateDateRange({
    message: 'The end date cannot be less than the start date.',
  })
  final_date: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn([OrderStatus.OPEN, OrderStatus.APPROVED, OrderStatus.CLOSED])
  status: $Enums.OrderStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cep: string;
}
