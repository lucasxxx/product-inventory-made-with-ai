import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../interfaces/product.interface';
import { BadRequestException } from '@nestjs/common';

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
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn().mockResolvedValue([[], 0]),
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

      const result = await service.create(productData, 1);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({ data: { ...productData, userId: 1 } });
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

      await expect(service.create(invalidProductData, 1)).rejects.toThrow('Validation failed');
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({ data: { ...invalidProductData, userId: 1 } });
    });

    it('should throw BadRequestException if duplicate name, sku, or barcode exists', async () => {
      const productData = {
        name: 'Duplicate Name',
        sku: 'DUPLICATE-SKU',
        price: 19.99,
        quantity: 100,
        barcode: 'DUPLICATE-BARCODE',
      };
      mockPrismaService.product.findFirst.mockResolvedValue({ id: 2, ...productData });
      await expect(service.create(productData, 1)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.product.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: productData.name },
            { sku: productData.sku },
            { barcode: productData.barcode },
          ],
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { id: 1, name: 'Product 1', sku: 'SKU1', price: 10, quantity: 5, barcode: '123', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Product 2', sku: 'SKU2', price: 20, quantity: 10, barcode: '456', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);
      mockPrismaService.$transaction = jest.fn().mockResolvedValue([expectedProducts, expectedProducts.length]);

      const page = 1;
      const pageSize = 2;
      const result = await service.findAll(page, pageSize);
      expect(result).toEqual({
        products: expectedProducts,
        total: expectedProducts.length,
        page,
        pageSize,
        totalPages: 1,
      });
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

      const result = await service.update(id, updateData, 1);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({ where: { id }, data: updateData });
    });

    it('should throw BadRequestException if updating to duplicate name, sku, or barcode', async () => {
      const id = 1;
      const updateData = {
        name: 'Duplicate Name',
        sku: 'DUPLICATE-SKU',
        barcode: 'DUPLICATE-BARCODE',
      };
      const product = { id, userId: 1 };
      mockPrismaService.product.findUnique.mockResolvedValue(product);
      mockPrismaService.product.findFirst.mockResolvedValue({ id: 2, ...updateData });
      await expect(service.update(id, updateData, 1)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: { not: id },
          OR: [
            { name: updateData.name },
            { sku: updateData.sku },
            { barcode: updateData.barcode },
          ],
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'Test Product', sku: 'SKU123', price: 19.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.product.delete.mockResolvedValue(expectedProduct);

      const result = await service.remove(id, 1);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('searchProducts', () => {
    it('should return paginated search results', async () => {
      const search = 'Test';
      const page = 1;
      const pageSize = 2;
      const expectedProducts = [
        { id: 1, name: 'Test Product', sku: 'SKU1', price: 10, quantity: 5, barcode: '123', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Another Test', sku: 'SKU2', price: 20, quantity: 10, barcode: '456', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.$transaction = jest.fn().mockResolvedValue([expectedProducts, expectedProducts.length]);

      const result = await service.searchProducts(search, page, pageSize);

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          },
          skip: 0,
          take: 2,
          orderBy: { id: 'asc' },
        }),
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      ]);
      expect(result).toEqual({
        products: expectedProducts,
        total: expectedProducts.length,
        page,
        pageSize,
        totalPages: 1,
      });
    });
  });
});
