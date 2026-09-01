import prisma from '../src/config/db.js';

async function migrateColorVariants() {
  console.log('Starting colorVariants migration...');
  
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check/migrate.`);

  let updatedCount = 0;

  for (const product of products) {
    let name = 'Royal Purple';
    let hex = '#5a2d82';

    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      const firstCol = product.colors[0];
      if (typeof firstCol === 'object' && firstCol !== null) {
        name = firstCol.name || name;
        hex = firstCol.hex || hex;
      } else if (typeof firstCol === 'string') {
        name = firstCol;
      }
    }

    const mainImg = product.image;
    const secImg = product.secondaryImage || product.image;

    const colorVariants = [
      {
        name,
        hex,
        image: mainImg,
        secondaryImage: secImg
      }
    ];

    await prisma.product.update({
      where: { id: product.id },
      data: {
        colorVariants: colorVariants
      }
    });

    updatedCount++;
    console.log(`Migrated product ${product.id} ("${product.name}") -> variant: ${name} (${hex})`);
  }

  console.log(`Successfully migrated ${updatedCount} products to colorVariants.`);
}

migrateColorVariants()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
