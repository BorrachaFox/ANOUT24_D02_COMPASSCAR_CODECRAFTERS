import { PartialType } from '@nestjs/swagger';
import { CreateCarDTO } from './create-car.dto';

export class UpdateCarDTO extends PartialType(CreateCarDTO) {}
