import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDTO) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll(email: string, name: string, status: string) {
    const where: any = {};
    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    try {
      const users = await this.prisma.user.findMany({
        where,
      });

      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const usersWithoutPassword = users.map(({ password, ...user }) => user);

      return usersWithoutPassword;
    } catch {
      throw new NotFoundException('user not found with this filter');
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        created_at: true,
        update_at: true,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDTO) {
    const validateUser = await this.prisma.user.findFirst({ where: { id } });
    if (!validateUser) {
      throw new NotFoundException('User not found.');
    }

    const { email } = updateUserDto;
    const validateEmail = await this.prisma.user.findFirst({
      where: {
        email,
        status: 'ACTIVE',
      },
    });
    if (validateEmail) {
      throw new ConflictException('Email already in use by an active user.');
    }

    let { password } = updateUserDto;
    if (password) {
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
    } catch (_err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    let user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        update_at: new Date(),
      },
    });
    return `User ${id} deactivated successfully.`;
  }
}
