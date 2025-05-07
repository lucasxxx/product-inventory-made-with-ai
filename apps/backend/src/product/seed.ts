import { PrismaClient } from '@prisma/client';
import { createProducts } from './factories/product.factory';

const prisma = new PrismaClient();

async function seed() {
  try {
    const products = createProducts(100);
    await prisma.product.createMany({ data: products });
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
