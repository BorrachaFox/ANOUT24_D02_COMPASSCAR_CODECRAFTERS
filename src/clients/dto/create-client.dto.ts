import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  cpf: string;

  @Type(() => Date)
  @IsDate()
  birthday: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber('BR')
  phone: string;
}
