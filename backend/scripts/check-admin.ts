import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const adminCount = await prisma.administrator.count();
  console.log('Administrator count:', adminCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
