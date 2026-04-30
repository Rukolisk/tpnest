// commissions.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CommissionsController', () => {
  let controller: CommissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionsController],
      providers: [
        CommissionsService,
        { provide: PrismaService, useValue: { commission: {} } },
      ],
    }).compile();

    controller = module.get<CommissionsController>(CommissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
