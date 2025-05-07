import ProductCard from './ProductCard';

type Product = {
  id: number;
  name: string;
  imageUrl?: string;
  quantity: number;
};

type ProductListProps = {
  products: Product[];
  lastProductRef?: (node: any) => void;
};

export default function ProductList({ products, lastProductRef }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product, idx) => {
        const isLast = lastProductRef && idx === products.length - 1;
        if (isLast) {
          return (
            <div key={product.id} ref={lastProductRef}>
              <ProductCard {...product} />
            </div>
          );
        }
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
}