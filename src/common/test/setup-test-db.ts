import { execSync } from 'child_process';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CommissionsModule } from 'src/commissions/commissions.module';

export interface TestContext {
  module: TestingModule;
  prisma: PrismaService;
  container: StartedPostgreSqlContainer;
}

export async function setupTestDb(): Promise<TestContext> {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('tpnest_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  const url = container.getConnectionUri();

  process.env.DATABASE_URL = url;

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'pipe',
  });

  const module = await Test.createTestingModule({
    imports: [PrismaModule, UsersModule, CommissionsModule],
  }).compile();

  const prisma = module.get<PrismaService>(PrismaService);

  return { module, prisma, container };
}

export async function teardownTestDb(ctx: TestContext): Promise<void> {
  await ctx.module.close();
  try {
    await ctx.container.stop();
  } catch {
    // Docker Desktop permission issue — container will be cleaned up on next run
  }
}

/**
 * Respecte l'ordre des FK : Commission référence User
 */
export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$transaction([
    prisma.commission.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
