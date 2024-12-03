import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbPrisma: PrismaService) {}
  create(CreateUserDTO: CreateUserDTO) {
    return 'This action adds a new user';
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
      const users = await this.dbPrisma.user.findMany({
        where,
      });

      if (users.length === 0) {
        throw new NotFoundException('No users found  ');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const usersWithoutPassword = users.map(({ password, ...user }) => user);

      return usersWithoutPassword;
    } catch {
      throw new NotFoundException('user not found with this filter');
    }
  }

  async findOne(id: number) {
    const user = await this.dbPrisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
