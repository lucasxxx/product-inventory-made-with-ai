import { Product } from '@product-inventory/shared-types';
import Link from 'next/link';

interface ProductListProps {
  products: Product[];
  lastProductRef?: (node: any) => void;
}

export default function ProductList({ products, lastProductRef }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          ref={index === products.length - 1 ? lastProductRef : null}
          className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/20"
        >
          {product.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {product.name}
            </h2>
            <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
              <span>SKU: {product.sku}</span>
              <span>Qty: {product.quantity}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400">{product.category}</span>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="block w-full text-center bg-indigo-600/80 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}