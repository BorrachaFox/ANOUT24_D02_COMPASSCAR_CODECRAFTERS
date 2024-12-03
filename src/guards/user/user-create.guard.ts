import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmailAvailableGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const user = await this.prismaService.user.findFirst({
      where: { email, status: 'ACTIVE' },
    });

    if (user) {
      throw new UnauthorizedException('email is already used');
    }

    return true;
  }
}
