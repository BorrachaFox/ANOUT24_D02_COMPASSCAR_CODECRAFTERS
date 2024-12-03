import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbPrisma: PrismaService) {}

  create(createUserDto: CreateUserDTO) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDTO) {
    const validateUser = await this.dbPrisma.user.findFirst({ where: { id } });
    if (!validateUser) {
      throw new NotFoundException('User not found.');
    }

    const { email } = updateUserDto;
    const validateEmail = await this.dbPrisma.user.findFirst({
      where: {
        email,
        status: 'active',
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
      await this.dbPrisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
    } catch (_err) {
      throw new BadRequestException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
