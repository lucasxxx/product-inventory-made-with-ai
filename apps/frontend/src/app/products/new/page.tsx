'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { CreateProductDto } from '@product-inventory/shared-types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createProduct } from '@/lib/api';

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
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        <ProductForm
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      </div>
    </ProtectedRoute>
  );
} 