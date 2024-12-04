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

export class CreateCarDTO {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-\d{1}[A-J0-9]{1}\d{2}$/)
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
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsNotEmpty()
  items: string[];

  update_at?: Date;
}
