import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function migrateImages() {
  console.log('🚀 Starting Cloudinary Image Migration...');
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

  const imagesDir = path.join(__dirname, '../../public/images/products');
  const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  console.log(`Found ${files.length} images in ${imagesDir}`);

  const urlMapping = {};

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const publicId = path.parse(file).name;

    console.log(`Uploading ${file} -> surangi-naar/products/${publicId}...`);

    const uploadRes = await cloudinary.uploader.upload(filePath, {
      folder: 'surangi-naar/products',
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });

    console.log(`✅ Uploaded: ${uploadRes.secure_url}`);
    urlMapping[`/images/products/${file}`] = uploadRes.secure_url;
  }

  console.log('\n--- Full Upload Mapping ---');
  console.log(JSON.stringify(urlMapping, null, 2));

  // 1. Update src/data/mockData.js
  const mockDataPath = path.join(__dirname, '../../src/data/mockData.js');
  if (fs.existsSync(mockDataPath)) {
    let mockContent = fs.readFileSync(mockDataPath, 'utf8');
    for (const [localPath, cloudUrl] of Object.entries(urlMapping)) {
      mockContent = mockContent.split(localPath).join(cloudUrl);
    }
    fs.writeFileSync(mockDataPath, mockContent, 'utf8');
    console.log('✅ Updated src/data/mockData.js with Cloudinary URLs');
  }

  // 2. Update backend/prisma/seed.js
  const seedPath = path.join(__dirname, '../prisma/seed.js');
  if (fs.existsSync(seedPath)) {
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    for (const [localPath, cloudUrl] of Object.entries(urlMapping)) {
      seedContent = seedContent.split(localPath).join(cloudUrl);
    }
    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log('✅ Updated backend/prisma/seed.js with Cloudinary URLs');
  }

  console.log('\n🎉 Image Migration Complete!');
}

migrateImages().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
