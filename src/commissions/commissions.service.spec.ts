import { CommissionsService } from './commissions.service';
import { CommissionStatus } from 'src/generated/prisma/client';
import {
  setupTestDb,
  teardownTestDb,
  cleanDatabase,
  TestContext,
} from 'src/common/test/setup-test-db';

describe('CommissionsService (integration)', () => {
  let ctx: TestContext;
  let service: CommissionsService;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get<CommissionsService>(CommissionsService);
  }, 60_000);

  afterEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  afterAll(async () => {
    await teardownTestDb(ctx);
  });

  // Helper pour créer un user de test rapidement
  async function createTestUser(email = 'test@test.com') {
    return ctx.prisma.user.create({
      data: { email, firstName: 'Bastien', lastName: 'Dupont' },
    });
  }

  describe('create', () => {
    it('should create a commission with PENDING status by default', async () => {
      const user = await createTestUser();

      const commission = await service.create({
        title: 'Ma commission',
        description: 'Description',
        user: { connect: { id: user.id } },
      });

      expect(commission.title).toBe('Ma commission');
      expect(commission.status).toBe(CommissionStatus.PENDING);
      expect(commission.userId).toBe(user.id);
    });
  });

  describe('findAll', () => {
    it('should return all commissions', async () => {
      const user = await createTestUser();

      await ctx.prisma.commission.createMany({
        data: [
          { title: 'C1', description: 'Description 1', userId: user.id },
          { title: 'C2', description: 'Description 2', userId: user.id },
        ],
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });

    it('should return empty array when no commissions', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a commission', async () => {
      const user = await createTestUser();
      const commission = await ctx.prisma.commission.create({
        data: {
          title: 'Test',
          description: 'Test description',
          userId: user.id,
        },
      });

      const result = await service.findOne({ id: commission.id });

      expect(result?.id).toBe(commission.id);
      expect(result?.title).toBe('Test');
    });

    it('should return null if not found', async () => {
      const result = await service.findOne({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update commission title', async () => {
      const user = await createTestUser();
      const commission = await ctx.prisma.commission.create({
        data: {
          title: 'Ancien',
          description: 'Test description',
          userId: user.id,
        },
      });

      const updated = await service.update({
        where: { id: commission.id },
        data: { title: 'Nouveau' },
      });

      expect(updated.title).toBe('Nouveau');
    });
  });

  describe('updateStatus', () => {
    it('should update commission status', async () => {
      const user = await createTestUser();
      const commission = await ctx.prisma.commission.create({
        data: {
          title: 'Test',
          description: 'Test description',
          userId: user.id,
        },
      });

      const updated = await service.updateStatus({
        where: { id: commission.id },
        data: { status: CommissionStatus.ACCEPTED },
      });

      expect(updated.status).toBe(CommissionStatus.ACCEPTED);
    });

    it('should transition through all statuses', async () => {
      const user = await createTestUser();
      const commission = await ctx.prisma.commission.create({
        data: {
          title: 'Test',
          description: 'Test description',
          userId: user.id,
        },
      });

      for (const status of [
        CommissionStatus.ACCEPTED,
        CommissionStatus.IN_PROGRESS,
        CommissionStatus.COMPLETED,
      ]) {
        const updated = await service.updateStatus({
          where: { id: commission.id },
          data: { status },
        });
        expect(updated.status).toBe(status);
      }
    });
  });

  describe('remove', () => {
    it('should delete a commission', async () => {
      const user = await createTestUser();
      const commission = await ctx.prisma.commission.create({
        data: {
          title: 'Test',
          description: 'Test description',
          userId: user.id,
        },
      });

      await service.remove({ id: commission.id });

      const result = await service.findOne({ id: commission.id });
      expect(result).toBeNull();
    });
  });
});
