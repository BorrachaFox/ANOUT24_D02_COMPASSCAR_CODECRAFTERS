import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarPlateFormatGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const plateCar: string = String(request.body.plate).toUpperCase();

    const newPlateRegex: RegExp = /^[A-Z]{3}-\d{1}[A-J0-9]{1}\d{2}$/;
    const oldPlateRegex: RegExp = /^[A-Z]{3}-\d{4}$/;

    if (!newPlateRegex.test(plateCar) && !oldPlateRegex.test(plateCar)) {
      throw new BadRequestException(
        'plate must be in the correct format ABC-1C34 or ABC-1234',
      );
    }
    return true;
  }
}
