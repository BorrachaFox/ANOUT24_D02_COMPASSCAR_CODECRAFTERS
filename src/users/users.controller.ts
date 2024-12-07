import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEmailActiveGuard } from '../guards/user/user-email-active.guard';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';

//@UseGuards(IsAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(UserEmailActiveGuard)
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll(email, name, status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Patch(':id')
  @UseGuards(UserEmailActiveGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const userId = +id;
    return await this.usersService.remove(userId);
  }
}
