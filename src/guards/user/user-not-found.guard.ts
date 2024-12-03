import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.params.id);

    const user = await this.prismaService.user.findMany({
      where: { id: userId },
    });

    if (user.length === 0) {
      throw new NotFoundException('user not found');
    }
    return true;
  }
}
