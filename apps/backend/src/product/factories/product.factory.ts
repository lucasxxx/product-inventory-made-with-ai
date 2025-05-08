import { faker } from '@faker-js/faker';
import { Product } from '@product-inventory/shared-types';

let productCounter = 1;

export const createProduct = (overrides = {}) => {
  const count = productCounter++;
  return {
    name: `Test Product ${count}`,
    description: 'Test Description',
    sku: `TEST-SKU-${count.toString().padStart(3, '0')}`,
    price: 99.99,
    quantity: 10,
    category: 'Test Category',
    imageUrl: 'https://example.com/image.jpg',
    supplier: 'Test Supplier',
    barcode: faker.string.numeric(13),
    isActive: true,
    userId: 1,
    ...overrides,
  };
};

export const createProducts = (count: number): Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return Array.from({ length: count }, () => createProduct());
};
