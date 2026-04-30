import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Commission,
  CommissionStatus,
  Prisma,
} from 'src/generated/prisma/client.js';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CommissionCreateInput) {
    return this.prisma.commission.create({ data });
  }

  findAll() {
    return this.prisma.commission.findMany();
  }

  findOne(where: Prisma.CommissionWhereUniqueInput) {
    return this.prisma.commission.findUnique({ where });
  }

  async update(params: {
    where: Prisma.CommissionWhereUniqueInput;
    data: Prisma.CommissionUpdateInput;
  }): Promise<Commission> {
    await this.findOne(params.where);
    return this.prisma.commission.update(params);
  }

  async updateStatus(params: {
    where: Prisma.CommissionWhereUniqueInput;
    data: { status: CommissionStatus };
  }): Promise<Commission> {
    await this.findOne(params.where);
    return this.prisma.commission.update({
      where: params.where,
      data: { status: params.data.status },
    });
  }

  async remove(where: Prisma.CommissionWhereUniqueInput): Promise<Commission> {
    await this.findOne(where);
    return this.prisma.commission.delete({ where });
  }
}
