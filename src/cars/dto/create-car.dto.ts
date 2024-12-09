import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { IsArrayUnique } from '../../Decorators/cars/car-items-unique.decorator';
import { IsCarPlate } from 'src/Decorators/cars/car-plate-format.decorator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateCarDTO {
  @ApiProperty({ description: 'Add vehicle brand.' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Add vehicle model.' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Add plate car.',
    format: "'A-Z', 'A-Z', 'A-Z', '0-9', 'A-J' or '0-9', '0-9', '0-9'",
    examples: ['ABC3D12', 'XYZ4023'],
  })
  @IsString()
  @IsNotEmpty()
  @IsCarPlate()
  plate: string;

  @ApiProperty({ description: 'Add vehicle year.', format: 'yyyy' })
  @IsInt()
  @IsNotEmpty()
  @Min(new Date().getFullYear() + 1 - 10)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ description: 'Add km vehicle.', example: 50999 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  km: number;

  @ApiProperty({
    description: 'Adds the daily price of the vehicle.',
    example: 299.99,
  })
  @Min(1)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  daily_rate: number;

  @ApiProperty({
    description: 'Add vehicle items.',
    example: ['air conditioning', 'autopilot'],
  })
  @IsArray()
  @IsArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsNotEmpty()
  items: string[];

  @ApiHideProperty()
  update_at?: Date;
}
