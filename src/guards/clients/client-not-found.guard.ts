import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class ClientNotFoundGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = Number(request.params.id);

    const client = await this.prismaService.client.findMany({
      where: { id: clientId },
    });

    if (client.length === 0) {
      throw new NotFoundException('client not found');
    }
    return true;
  }
}
