import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Status } from '@prisma/client';
import { ValidateUsers } from 'src/users/utils/validate-users.utils';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDTO) {
    await this.userEmailVerification(createUserDto.email);
    const password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(10),
    );
    try {
      return this.prisma.user.create({ data: { ...createUserDto, password } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query) {
    const usersNoFilter = await this.prisma.user.findMany({
      take: 1,
    });
    ValidateUsers.userFoundAll(usersNoFilter);

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    let limit = parseInt(query.limit, 10) || 5;

    if (limit <= 0) {
      limit = 5;
    } else if (limit > 10) {
      limit = 10;
    }

    const take: number = Number(limit);
    const skip: number = Number((page - 1) * limit);
    const { email, name, status } = query;
    const where: Record<string, any> = {};

    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (status) where.status = status;

    try {
      const usersWithFilters = await this.prisma.user.findMany({
        where,
        skip,
        take,
      });
      ValidateUsers.userFiltersFounded(usersWithFilters);
      return usersWithFilters.map(({ password, ...user }) => user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    const user = await this.existsUser(id);
    const { password, ...usersWithoutPassword } = user;
    try {
      return usersWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDTO) {
    await this.existsUser(id);
    if (updateUserDto.email) {
      await this.userEmailVerification(updateUserDto.email);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(10),
      );
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    await this.existsUser(id);
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          status: Status.INACTIVE,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existsUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }
    return user;
  }

  async userEmailVerification(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, status: Status.ACTIVE },
    });
    if (user) {
      throw new UnauthorizedException('Email is already used.');
    }
    return user;
  }
}
