import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, CreateProductDto, UpdateProductDto } from '@product-inventory/shared-types';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    // Check for duplicates
    const duplicate = await this.prisma.product.findFirst({
      where: {
        OR: [
          { name: createProductDto.name },
          { sku: createProductDto.sku },
          { barcode: createProductDto.barcode },
        ],
      },
    });
    if (duplicate) {
      throw new BadRequestException('Product with the same name, SKU, or barcode already exists');
    }
    try {
      return await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Product with the same name, SKU, or barcode already exists');
      }
      throw error;
    }
  }

  async findAll(page: number, pageSize: number) {
    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.product.count(),
    ]);
    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Update a product by ID
  async update(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.userId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this product');
    }

    // Check for duplicates (excluding current product)
    const duplicate = await this.prisma.product.findFirst({
      where: {
        id: { not: id },
        OR: [
          { name: updateProductDto.name },
          { sku: updateProductDto.sku },
          { barcode: updateProductDto.barcode },
        ],
      },
    });
    if (duplicate) {
      throw new BadRequestException('Product with the same name, SKU, or barcode already exists');
    }
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Product with the same name, SKU, or barcode already exists');
      }
      throw error;
    }
  }

  // Delete a product by ID
  async remove(id: number, userId: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.userId !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this product');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // Get a single product by SKU
  async findBySku(sku: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async searchProducts(search: string, page: number, pageSize: number) {
    const where = {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
      ],
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);
    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}