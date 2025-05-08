'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { CreateProductDto } from '@product-inventory/shared-types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createProduct } from '@/lib/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (data: CreateProductDto) => {
    setError('');
    setIsLoading(true);
    try {
      await createProduct(data);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Product</h1>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <ProductForm
              onSubmit={handleCreate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 