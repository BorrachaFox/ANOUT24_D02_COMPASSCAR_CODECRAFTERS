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
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { IsAuthGuard } from 'src/guards/auth/isAuth.guards';
import {
  DeleteResponses,
  GetAllResponses,
  GetOneResponses,
  PatchResponses,
  PostResponses,
} from 'src/swagger/swagger-users';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  @HttpCode(204)
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
