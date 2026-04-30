import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Commission } from 'src/generated/prisma/browser';
import { UpdateStatusCommissionDto } from './dto/update-status-commission.dto';

@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async create(
    @Body() createCommissionDto: CreateCommissionDto,
  ): Promise<Commission> {
    const { userId, ...rest } = createCommissionDto;
    return await this.commissionsService.create({
      ...rest,
      user: { connect: { id: userId } },
    });
  }

  @Get()
  findAll() {
    return this.commissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commissionsService.findOne({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCommissionDto: UpdateCommissionDto,
  ) {
    return this.commissionsService.update({
      where: { id },
      data: updateCommissionDto,
    });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusCommissionDto,
  ) {
    return this.commissionsService.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commissionsService.remove({ id });
  }
}
