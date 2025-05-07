"use client";

import { useState, useEffect } from 'react';
import ProductHeader from '@/components/ProductHeader';
import ProductList from '@/components/ProductList';
import { fetchProducts } from '@/lib/api';

export default function Home() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl p-4 sm:p-8 bg-black rounded-3xl shadow-md text-white">
        <ProductHeader
          search={search}
          setSearch={setSearch}
          onAdd={() => {/* handle add product */}}
        />
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
        {!loading && !error && <ProductList products={filtered} />}
      </div>
    </div>
  );
}
