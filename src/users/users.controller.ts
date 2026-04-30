import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/generated/prisma/client.js';
import { GetUserDto } from './dto/get-user.dto';
import {
  CursorPaginationParams,
  CursorPaginationPipe,
} from '../common/pipes/cursor-pagination.pipe';
import {
  OffsetPaginationParams,
  OffsetPaginationPipe,
} from 'src/common/pipes/offset-pagination.pipe';
import { GetUserDetailDto } from './dto/get-user-detail.dto';
import {
  ApiCreated,
  ApiNoContent,
} from 'src/common/decorators/api-response.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreated()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /*@Get()
  async findAll(): Promise<GetUserDto[]> {
    const users = await this.usersService.findAll({});
    return users.map((user) => GetUserDto.fromUser(user));
  }*/

  @Get()
  async findAll(
    @Query(OffsetPaginationPipe) pagination: OffsetPaginationParams,
  ) {
    const { data, total, page, limit, totalPages } =
      await this.usersService.findAll(pagination);
    return {
      data: data.map((user) => GetUserDto.fromUser(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Must be declared before :id to avoid route conflict
  @Get('cursor')
  async findAllWithCursor(
    @Query(CursorPaginationPipe) params: CursorPaginationParams,
  ) {
    const { data, nextCursor, hasNextPage } =
      await this.usersService.findAllWithCursor(params);
    return {
      data: data.map((user) => GetUserDto.fromUser(user)),
      nextCursor,
      hasNextPage,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    const user = await this.usersService.findOne({ id });
    return GetUserDetailDto.fromUser(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @ApiNoContent()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove({ id });
  }
}
