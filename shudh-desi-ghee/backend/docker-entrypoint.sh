#!/bin/sh
set -e

echo "Applying database schema..."
npx prisma db push --skip-generate

echo "Seeding Shudh Desi Ghee catalog..."
npm run seed || echo "Seed completed with warnings."

echo "Starting backend server..."
exec "$@"
