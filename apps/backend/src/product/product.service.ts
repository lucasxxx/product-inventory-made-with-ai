// ... existing imports ...
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data: createProductDto });
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  // Get a single product by ID
  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  // Update a product by ID
  async update(id: number, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  // Delete a product by ID
  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  // Get a single product by SKU
  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { sku } });
  }
}