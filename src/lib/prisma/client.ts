import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // In Prisma 7, you can pass adapter or accelerateUrl here if needed
    // For standard PostgreSQL connection, the URL from prisma.config.ts is used
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
