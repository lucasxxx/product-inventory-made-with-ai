import { faker } from '@faker-js/faker';
import { Product } from '@prisma/client';

export const createProduct = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: faker.string.alphanumeric(10).toUpperCase(),
    price: parseFloat(faker.commerce.price()),
    quantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.commerce.department(),
    imageUrl: faker.image.url(),
    supplier: faker.company.name(),
    barcode: faker.string.numeric(12),
    isActive: faker.datatype.boolean(),
  };
};

export const createProducts = (count: number): Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return Array.from({ length: count }, () => createProduct());
};
