import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreated()
  @AllowAnonymous()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, ...rest } = createUserDto;
    const name = [firstName, lastName].filter(Boolean).join(' ') || rest.email;
    return this.usersService.create({ ...rest, firstName, lastName, name });
  }

  @Get()
  @AllowAnonymous()
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
  @Roles(Role.USER, Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    const user = await this.usersService.findOne({ id });
    return GetUserDetailDto.fromUser(user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiNoContent()
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove({ id });
  }
}
