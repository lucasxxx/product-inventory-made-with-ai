"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductHeader from '@/components/ProductHeader';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';

type Product = {
  id: number;
  name: string;
  imageUrl?: string;
  quantity: number;
  // add other fields as needed
};

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
    <div className="min-h-screen bg-black flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl p-4 sm:p-8 bg-black rounded-3xl shadow-md text-white">
        <ProductList
          products={products}
          lastProductRef={lastProductRef}
        />
        {loading && <div className="text-center text-gray-400">Loading...</div>}
      </div>
    </div>
  );
}
