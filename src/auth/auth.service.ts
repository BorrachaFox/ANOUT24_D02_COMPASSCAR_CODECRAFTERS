import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: any) {
    return {
      accessToken: this.jwtService.sign({
        id: user.id,
        email: user.email,
      }),
    };
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password may be incorrect');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password may be incorrect');
    }

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = this.usersService.create(data);

    return this.createToken(user);
  }
}
