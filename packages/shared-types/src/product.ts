export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  quantity: number;
  category: string | null;
  imageUrl: string | null;
  supplier: string | null;
  barcode: string;
  isActive: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  supplier?: string;
  barcode: string;
  isActive?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {} 