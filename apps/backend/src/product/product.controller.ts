import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '4'
  ) {
    return this.productService.findAll(Number(page), Number(pageSize));
  }

  @Get('search')
  async search(
    @Query('search') search: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20'
  ) {
    try {
      if (!search || !search.trim()) {
        return {
          products: [],
          total: 0,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: 0,
        };
      }
      return await this.productService.searchProducts(
        search,
        Number(page),
        Number(pageSize)
      );
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
    return this.productService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(Number(id));
  }

  @Get('sku/:sku')
  findBySku(@Param('sku') sku: string) {
    return this.productService.findBySku(sku);
  }

 
}