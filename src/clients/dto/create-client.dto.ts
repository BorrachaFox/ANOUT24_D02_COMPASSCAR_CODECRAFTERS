import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: "Add the customer's full name." })
  @MinLength(2)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Add customer CPF.',
    example: '111.444.777-35',
  })
  @IsString()
  cpf: string;

  @ApiProperty({
    description: "Add the customer's date of birth.",
    format: 'yyyy-mm-dd',
    example: '2000-12-01',
  })
  @Type(() => Date)
  @IsDate()
  birthday: string;

  @ApiProperty({
    description: 'Add customer email.',
    example: 'qwerty@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Add a valid Brazilian number.',
    examples: ['5515996125834', '+55(15)99612-5834'],
  })
  @IsString()
  @IsPhoneNumber('BR')
  phone: string;
}
