import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3001'],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false, // non modifiable par le client au sign-up
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const [firstName, ...rest] = (user.name ?? '').split(' ');
          const lastName = rest.join(' ') || null;
          return {
            data: { ...user, firstName: firstName || null, lastName },
          };
        },
      },
    },
  },
});
