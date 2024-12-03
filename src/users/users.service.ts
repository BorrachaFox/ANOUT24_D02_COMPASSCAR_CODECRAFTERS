import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: CreateUserDTO) {
    
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        created_at : true,
        update_at : true
      },
    });

    if (!user) {
      return null; 
    }
    return user;

   
  }


  update(id: number, updateUserDto: UpdateUserDTO) {
    return `This action updates a #${id} user`;
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
        status: 'inactive',
        update_at: new Date(),
      },   
  });
  return `User ${id} deactivated successfully.`;
}

}
