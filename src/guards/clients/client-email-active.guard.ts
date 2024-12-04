import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class ClientEmailActiveGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const client = await this.prismaService.client.findFirst({
      where: { email, status: Status.ACTIVE },
    });

    if (client) {
      throw new UnauthorizedException('email is already used');
    }

    return true;
  }
}
