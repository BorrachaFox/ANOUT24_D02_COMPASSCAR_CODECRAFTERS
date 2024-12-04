import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientCpfActiveGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { cpf } = request.body;

    const client = await this.prismaService.client.findFirst({
      where: { cpf, status: Status.ACTIVE },
    });

    console.log(client);

    if (client) {
      throw new UnauthorizedException('Cpf is already used');
    }

    return true;
  }
}
