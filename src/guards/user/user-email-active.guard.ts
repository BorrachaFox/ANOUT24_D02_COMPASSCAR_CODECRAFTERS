import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UserEmailActiveGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const user = await this.prismaService.user.findFirst({
      where: { email, status: Status.ACTIVE },
    });

    if (user) {
      throw new UnauthorizedException('email is already used');
    }

    return true;
  }
}
