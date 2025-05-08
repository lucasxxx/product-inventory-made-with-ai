"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductHeader from '@/components/ProductHeader';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';
import { Product } from '@product-inventory/shared-types';

const PAGE_SIZE = 8;

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
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Product Inventory
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through our extensive collection of products. Find exactly what you need with our intuitive interface.
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-border/50 animate-fade-in">
            <ProductList
              products={products}
              lastProductRef={lastProductRef}
            />
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
