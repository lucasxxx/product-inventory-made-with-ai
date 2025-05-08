import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, Product, User } from '@product-inventory/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto, @Req() req: RequestWithUser) {
    return this.productService.create(createProductDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('search') search?: string,
  ) {
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    if (search) {
      return this.productService.searchProducts(search, parsedPage, parsedPageSize);
    }

    return this.productService.findAll(parsedPage, parsedPageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productService.update(+id, updateProductDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.productService.remove(+id, req.user.id);
  }

  @Get('sku/:sku')
  findBySku(@Param('sku') sku: string) {
    return this.productService.findBySku(sku);
  }
}