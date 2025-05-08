"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductHeader from '@/components/ProductHeader';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';
import { Product } from '@product-inventory/shared-types';

const PAGE_SIZE = 4;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setLoading(true);
    fetchProducts(page, PAGE_SIZE)
      .then(data => {
        setProducts(prev => [...prev, ...data.products]);
        setHasMore(page < data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Product Inventory
          </h1>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
            <ProductList
              products={products}
              lastProductRef={lastProductRef}
            />
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
