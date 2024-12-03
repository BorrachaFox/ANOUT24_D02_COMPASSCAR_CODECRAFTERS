import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '../../enums/status.enum';
import { User } from '../../users/entities/user.entity';

export class userCreateMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const user: User = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user.status === Status.ACTIVE) {
      throw new UnauthorizedException('email is already used');
    }
    next();
  }
}
