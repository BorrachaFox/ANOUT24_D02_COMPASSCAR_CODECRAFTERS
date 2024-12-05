import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDTO } from './create-car.dto';

export class UpdateCarDTO extends PartialType(CreateCarDTO) {}
