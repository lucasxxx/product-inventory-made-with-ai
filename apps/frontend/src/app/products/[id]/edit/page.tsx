'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm, { ProductFormValues } from '@/components/ProductForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(product => {
        setInitialValues({
          name: product.name || '',
          description: product.description || '',
          sku: product.sku || '',
          price: product.price?.toString() || '',
          quantity: product.quantity?.toString() || '',
          category: product.category || '',
          imageUrl: product.imageUrl || '',
          supplier: product.supplier || '',
          barcode: product.barcode || '',
        });
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleUpdate = async (values: ProductFormValues) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update product');
      }
      router.push(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialValues) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;
  if (!initialValues) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          isEdit={true}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </ProtectedRoute>
  );
} 