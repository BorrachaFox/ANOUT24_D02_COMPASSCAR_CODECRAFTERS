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
import { IsCarPlate } from '../../Decorators/cars/car-plate-format.decorator';

export class CreateCarDTO {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  @IsCarPlate()
  plate: string;

  @IsInt()
  @IsNotEmpty()
  @Min(new Date().getFullYear() + 1 - 10)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  km: number;

  @Min(1)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  daily_rate: number;

  @IsArray()
  @IsArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsNotEmpty()
  items: string[];

  update_at?: Date;
}
