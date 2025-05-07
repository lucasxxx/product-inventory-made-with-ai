import ProductCard from './ProductCard';

type Product = {
  id: number;
  name: string;
  imageUrl?: string;
  quantity: number;
};

type ProductListProps = {
  products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}