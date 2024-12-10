import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ValidateStartDate } from '../../Decorators/orders/validate-start-date.decorator';
import { ValidateEndDate } from '../../Decorators/orders/validate-end-date.decorator';
import { ValidateDateRange } from '../../Decorators/orders/validate-date-range.decorator';

export class CreateOrdersDto {
  @ApiProperty({ description: 'Add costumer id.' })
  @IsInt()
  client_id: number;

  @ApiProperty({ description: 'Add the vehicle id.' })
  @IsInt()
  car_id: number;

  @IsDate()
  @ApiProperty({
    description: 'Add vehicle rental start date.',
    format: 'yyyy-mm-dd',
  })
  @Type(() => Date)
  @ValidateIf((o) => o.start_date)
  @ValidateStartDate({ message: 'The start date cannot be before today.' })
  start_date: string;

  @ApiProperty({
    description: 'Add vehicle rental end date.',
    format: 'yyyy-mm-dd',
  })
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.final_date)
  @ValidateEndDate({ message: 'The end date cannot be earlier than today.' })
  @ValidateDateRange({
    message: 'The end date cannot be less than the start date.',
  })
  final_date: string;

  @ApiProperty({
    description: "Add the customer's zip code.",
    format: '00000000',
  })
  @IsString()
  cep: string;
}
