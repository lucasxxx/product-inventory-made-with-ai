"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";
import { Product } from '@product-inventory/shared-types';
import { fetchProducts } from "@/lib/api";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

const PAGE_SIZE = 8;

export default function SearchResultsPage() {
  const { query } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchQuery = query as string;
    if (!searchQuery) return;

    setLoading(true);
    fetchProducts(1, PAGE_SIZE, searchQuery)
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setError("Failed to load products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            Showing results for "{query}"
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching products...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2">
            <Search className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              We couldn't find any products matching "{query}"
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <ProductList products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
