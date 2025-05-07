import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const productData = {
        name: 'Test Product',
        sku: 'SKU123',
        price: 19.99,
        quantity: 100,
        barcode: '1234567890',
      };
      const expectedProduct = { id: 1, ...productData, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.product.create.mockResolvedValue(expectedProduct);

      const result = await service.create(productData);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({ data: productData });
    });

    it('should fail if required values are empty', async () => {
      const invalidProductData = {
        name: '', // Empty name
        sku: '', // Empty SKU
        price: -1, // Invalid price
        quantity: -1, // Invalid quantity
        barcode: '', // Empty barcode
      };

      // Mock Prisma to throw an error
      mockPrismaService.product.create.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(invalidProductData)).rejects.toThrow('Validation failed');
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({ data: invalidProductData });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { id: 1, name: 'Product 1', sku: 'SKU1', price: 10, quantity: 5, barcode: '123', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Product 2', sku: 'SKU2', price: 20, quantity: 10, barcode: '456', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll();
      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findBySku', () => {
    it('should return a product by SKU', async () => {
      const sku = 'SKU123';
      const expectedProduct = { id: 1, name: 'Test Product', sku, price: 19.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.product.findUnique.mockResolvedValue(expectedProduct);

      const result = await service.findBySku(sku);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({ where: { sku } });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = 1;
      const updateData = { price: 24.99 };
      const expectedProduct = { id, name: 'Test Product', sku: 'SKU123', price: 24.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.product.update.mockResolvedValue(expectedProduct);

      const result = await service.update(id, updateData);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({ where: { id }, data: updateData });
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'Test Product', sku: 'SKU123', price: 19.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.product.delete.mockResolvedValue(expectedProduct);

      const result = await service.remove(id);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
