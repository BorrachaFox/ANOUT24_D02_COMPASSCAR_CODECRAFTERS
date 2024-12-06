import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateOrdersDto {
  @ApiProperty({ description: 'Add costumer id.' })
  @IsInt()
  client_id: number;

  @ApiProperty({ description: 'Add the vehicle id.' })
  @IsInt()
  car_id: number;

  @ApiProperty({
    description: 'Add vehicle rental start date.',
    format: 'yyyy-mm-dd',
  })
  @Type(() => Date)
  @IsDate()
  start_date: string;

  @ApiProperty({
    description: 'Add vehicle rental end date.',
    format: 'yyyy-mm-dd',
  })
  @IsDate()
  @Type(() => Date)
  final_date: string;

  @ApiProperty({
    description: "Add the customer's zip code.",
    format: '00000000',
  })
  @IsString()
  cep: string;
}
