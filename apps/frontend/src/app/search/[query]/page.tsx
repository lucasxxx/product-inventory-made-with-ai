"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import { Product } from '@product-inventory/shared-types';

const PAGE_SIZE = 4;

export default function SearchResultsPage() {
  const { query } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/products/search?search=${encodeURIComponent(
        query as string
      )}&page=1&pageSize=${PAGE_SIZE}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(
        data.products.map((p: any) => ({
          ...p,
          description: p.description ?? "",
          sku: p.sku ?? "",
          price: p.price ?? 0,
          category: p.category ?? "",
          imageUrl: p.imageUrl ?? "",
          supplier: p.supplier ?? "",
          barcode: p.barcode ?? "",
          isActive: p.isActive ?? true,
          userId: p.userId ?? 0,
          createdAt: p.createdAt ?? "",
          updatedAt: p.updatedAt ?? "",
        }))
      ))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl p-4 sm:p-8 bg-black rounded-3xl shadow-md text-white">
        <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
        {!loading && !error && <ProductList products={products} />}
      </div>
    </div>
  );
}
