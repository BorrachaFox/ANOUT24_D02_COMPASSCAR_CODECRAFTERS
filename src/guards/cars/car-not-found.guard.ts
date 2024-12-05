import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarNotFoundGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.params.id);

    const user = await this.prismaService.car.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('car not found');
    }
    return true;
  }
}
