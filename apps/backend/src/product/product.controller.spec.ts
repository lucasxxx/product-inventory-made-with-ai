import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findBySku: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockProductService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(productData);
      expect(result).toEqual(expectedProduct);
      expect(mockProductService.create).toHaveBeenCalledWith(productData);
    });

    it('should fail if required values are empty', async () => {
      const invalidProductData = {
        name: '', // Empty name
        sku: '', // Empty SKU
        price: -1, // Invalid price
        quantity: -1, // Invalid quantity
        barcode: '', // Empty barcode
      };

      // Mock service to throw an error
      mockProductService.create.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.create(invalidProductData)).rejects.toThrow('Validation failed');
      expect(mockProductService.create).toHaveBeenCalledWith(invalidProductData);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { id: 1, name: 'Product 1', sku: 'SKU1', price: 10, quantity: 5, barcode: '123', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Product 2', sku: 'SKU2', price: 20, quantity: 10, barcode: '456', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockProductService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();
      expect(result).toEqual(expectedProducts);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findBySku', () => {
    it('should return a product by SKU', async () => {
      const sku = 'SKU123';
      const expectedProduct = { id: 1, name: 'Test Product', sku, price: 19.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockProductService.findBySku.mockResolvedValue(expectedProduct);

      const result = await controller.findBySku(sku);
      expect(result).toEqual(expectedProduct);
      expect(mockProductService.findBySku).toHaveBeenCalledWith(sku);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = 1;
      const updateData = { price: 24.99 };
      const expectedProduct = { id, name: 'Test Product', sku: 'SKU123', price: 24.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockProductService.update.mockResolvedValue(expectedProduct);

      const result = await controller.update(id.toString(), updateData);
      expect(result).toEqual(expectedProduct);
      expect(mockProductService.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = 1;
      const expectedProduct = { id, name: 'Test Product', sku: 'SKU123', price: 19.99, quantity: 100, barcode: '1234567890', createdAt: new Date(), updatedAt: new Date() };

      mockProductService.remove.mockResolvedValue(expectedProduct);

      const result = await controller.remove(id.toString());
      expect(result).toEqual(expectedProduct);
      expect(mockProductService.remove).toHaveBeenCalledWith(id);
    });
  });
});
