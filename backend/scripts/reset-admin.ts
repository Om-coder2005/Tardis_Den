import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.administrator.deleteMany();
  console.log('Administrator table cleared!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
