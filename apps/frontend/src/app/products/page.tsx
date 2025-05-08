import { Product } from '@product-inventory/shared-types';
import { ProductsResponse } from '@/types/api';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';

export default async function ProductsPage() {
  const response = await fetchProducts();
  const products = response as ProductsResponse;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <ProductList products={products.products.map(product => ({
        ...product,
        imageUrl: product.imageUrl || undefined,
        description: product.description || undefined,
        category: product.category || undefined,
        supplier: product.supplier || undefined,
      }))} />
    </div>
  );
} 