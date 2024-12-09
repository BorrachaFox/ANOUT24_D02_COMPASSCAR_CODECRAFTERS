import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { validatorCpf } from 'src/Decorators/validationCpf/validate-cpf-decorators';

export class CreateClientDto {
  @IsString()
  name: string;

  @validatorCpf()
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
