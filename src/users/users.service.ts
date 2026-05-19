import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma, Commission } from 'src/generated/prisma/client.js';
import { OffsetPaginationParams } from 'src/common/pipes/offset-pagination.pipe';
import { CursorPaginationParams } from 'src/common/pipes/cursor-pagination.pipe';

export type UserWithFullName = User & { fullName: string };
export type UserWithCommissions = User & { commissions?: Commission[] };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(pagination: OffsetPaginationParams) {
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findAllWithCursor(params: CursorPaginationParams) {
    const items = await this.prisma.user.findMany({
      take: params.limit + 1,
      skip: params.cursor ? 1 : 0,
      cursor: params.cursor ? { id: String(params.cursor) } : undefined,
      orderBy: { id: 'asc' },
    });

    const hasNextPage = items.length > params.limit;
    const data = hasNextPage ? items.slice(0, params.limit) : items;
    const nextCursor = hasNextPage ? (data[data.length - 1]?.id ?? null) : null;

    return { data, nextCursor, hasNextPage };
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithCommissions> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { commissions: true },
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    await this.findOne(params.where);
    return this.prisma.user.update({ data: params.data, where: params.where });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    await this.findOne(where);
    return this.prisma.user.delete({ where });
  }
}
