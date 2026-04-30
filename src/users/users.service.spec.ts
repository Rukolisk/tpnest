// users.service.spec.ts
import { UsersService } from './users.service';
import {
  setupTestDb,
  teardownTestDb,
  cleanDatabase,
  TestContext,
} from 'src/common/test/setup-test-db';

describe('UsersService (integration)', () => {
  let ctx: TestContext;
  let service: UsersService;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get<UsersService>(UsersService);
  }, 60_000); // Testcontainers peut prendre du temps au démarrage

  afterEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  afterAll(async () => {
    await teardownTestDb(ctx);
  });

  it('should create a user', async () => {
    const user = await service.create({
      email: 'test@test.com',
      firstName: 'Bastien',
      lastName: 'Dupont',
    });

    expect(user.email).toBe('test@test.com');
    expect(user.firstName).toBe('Bastien');
  });

  it('should throw NotFoundException if user not found', async () => {
    await expect(service.findOne({ id: 999 })).rejects.toThrow(
      'User not found',
    );
  });
});
