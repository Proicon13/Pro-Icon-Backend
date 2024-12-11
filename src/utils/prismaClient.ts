// src/prisma/prisma.client.ts

import { PrismaClient } from '@prisma/client';

// Create a Prisma Client instance
export const prisma = new PrismaClient();

// Use `as const` to tell TypeScript that 'beforeExit' is a literal string
// prisma.$on('beforeExit' as const, async () => {
//     console.log('Prisma is disconnecting...');
//     await prisma.$disconnect();
//   });