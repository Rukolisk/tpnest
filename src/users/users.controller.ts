import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/generated/prisma/client.js';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<GetUserDto[]> {
    const users = await this.usersService.findAll({});
    return users.map((user) => GetUserDto.fromUser(user));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    const user = await this.usersService.findOne({ id });
    return GetUserDto.fromUser(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove({ id });
  }
}
