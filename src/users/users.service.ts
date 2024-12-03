import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly dbPrisma: PrismaService) {}
  create(CreateUserDTO: CreateUserDTO) {
    return 'This action adds a new user';
  }

  async findAll() {
    return this.dbPrisma.user.findMany();
  }

  findOne(id: number) {
    return this.dbPrisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
