import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateColorImages() {
  console.log('--- Starting Color Variants Image Migration ---');
  
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check.`);

  let updatedCount = 0;

  for (const product of products) {
    if (!product.colorVariants || !Array.isArray(product.colorVariants)) {
      continue;
    }

    let modified = false;
    const updatedVariants = product.colorVariants.map(variant => {
      // If images array already exists and is valid, preserve it
      if (Array.isArray(variant.images) && variant.images.length > 0) {
        return variant;
      }

      modified = true;
      const images = [];

      // Add main image
      const mainImg = variant.image || product.image;
      if (mainImg && typeof mainImg === 'string' && mainImg.trim() !== '') {
        images.push(mainImg);
      }

      // Add secondary image if it exists and is distinct from main image
      const secImg = variant.secondaryImage || product.secondaryImage;
      if (
        secImg &&
        typeof secImg === 'string' &&
        secImg.trim() !== '' &&
        secImg !== mainImg &&
        !images.includes(secImg)
      ) {
        images.push(secImg);
      }

      // Ensure at least 1 image
      if (images.length === 0 && product.image) {
        images.push(product.image);
      }

      const { image, secondaryImage, ...rest } = variant;
      return {
        ...rest,
        images,
      };
    });

    if (modified) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          colorVariants: updatedVariants,
          image: updatedVariants[0]?.images[0] || product.image,
          secondaryImage: updatedVariants[0]?.images[1] || updatedVariants[0]?.images[0] || product.secondaryImage,
        },
      });
      updatedCount++;
    }
  }

  console.log(`Successfully migrated ${updatedCount} products to images array format.`);
  await prisma.$disconnect();
}

migrateColorImages().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
