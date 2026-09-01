import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupPendingOrders() {
  console.log('--- Cleaning Up Unpaid Pending Prepaid Orders ---');
  
  const result = await prisma.order.deleteMany({
    where: {
      status: 'Pending',
      paymentMethod: {
        contains: 'Prepaid',
      },
    },
  });

  console.log(`Deleted ${result.count} uncompleted pending prepaid orders from DB.`);
  await prisma.$disconnect();
}

cleanupPendingOrders().catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
