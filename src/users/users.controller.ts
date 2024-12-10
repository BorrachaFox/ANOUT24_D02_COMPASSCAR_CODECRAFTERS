import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsAuthGuard } from '../guards/auth/isAuth.guards';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  DeleteResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  PostResponses,
} from '../swagger/swagger-users';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Status } from '@prisma/client';

@UseGuards(IsAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PostResponses()
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @GetAllResponses()
  @Get()
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  async findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @GetOneResponses()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @PatchResponses()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @DeleteResponses()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
