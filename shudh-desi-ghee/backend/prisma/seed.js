import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  BRAND_CONTACT,
  PROMO_MESSAGES,
  CATEGORIES,
  HERO_SLIDES,
  PRODUCTS,
  DISCOUNT_CODES,
  INITIAL_ORDERS,
  ADMIN,
} from './ghee-catalog.js';

const prisma = new PrismaClient();

function formatColorVariants(prod) {
  return (prod.colorVariants || []).map((v) => {
    if (v.images && Array.isArray(v.images)) return v;
    const images = [];
    if (v.image) images.push(v.image);
    if (v.secondaryImage && v.secondaryImage !== v.image) images.push(v.secondaryImage);
    if (images.length === 0 && prod.image) images.push(prod.image);
    const { image, secondaryImage, ...rest } = v;
    return { ...rest, images };
  });
}

async function main() {
  console.log('🌱 Starting Shudh Desi Ghee database seed...');

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: BRAND_CONTACT,
    create: BRAND_CONTACT,
  });
  console.log('✅ Store Settings seeded');

  await prisma.promoMessage.deleteMany({});
  for (let i = 0; i < PROMO_MESSAGES.length; i++) {
    await prisma.promoMessage.create({ data: { message: PROMO_MESSAGES[i], order: i + 1 } });
  }
  console.log('✅ Promo Messages seeded');

  await prisma.category.deleteMany({});
  for (const cat of CATEGORIES) {
    await prisma.category.create({ data: cat });
  }
  console.log('✅ Categories seeded');

  await prisma.heroSlide.deleteMany({});
  for (const slide of HERO_SLIDES) {
    const { posterOnly, ...data } = slide;
    await prisma.heroSlide.create({ data });
  }
  console.log('✅ Hero Slides seeded');

  await prisma.product.deleteMany({});
  for (const prod of PRODUCTS) {
    const formattedVariants = formatColorVariants(prod);
    await prisma.product.create({
      data: {
        ...prod,
        colorVariants: formattedVariants,
        image: formattedVariants[0]?.images[0] || prod.image,
        secondaryImage: formattedVariants[0]?.images[1] || prod.secondaryImage,
      },
    });
  }
  console.log('✅ Products seeded');

  for (const discount of DISCOUNT_CODES) {
    await prisma.discountCode.upsert({
      where: { code: discount.code },
      update: discount,
      create: discount,
    });
  }
  console.log('✅ Discount Codes seeded');

  for (const order of INITIAL_ORDERS) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: order,
      create: order,
    });
  }
  console.log('✅ Initial Orders seeded');

  const adminEmail = (process.env.ADMIN_EMAIL || ADMIN.email).trim().toLowerCase();
  const hashedAdminPassword =
    process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash(ADMIN.password, 10));

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
      name: ADMIN.name,
      passwordHash: hashedAdminPassword,
    },
    create: {
      name: ADMIN.name,
      email: adminEmail,
      passwordHash: hashedAdminPassword,
      role: 'admin',
      provider: 'email',
    },
  });
  console.log('✅ Admin User seeded');

  console.log('🎉 Shudh Desi Ghee seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
