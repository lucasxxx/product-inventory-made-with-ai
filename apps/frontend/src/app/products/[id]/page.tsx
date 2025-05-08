"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type Product = {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  supplier?: string;
  barcode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/products/${id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then(setProduct)
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    setRemoving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove product");
      router.push("/");
    } catch {
      setError("Failed to remove product");
    } finally {
      setRemoving(false);
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;
  if (!product) return <div className="text-center text-gray-400">Product not found</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-black rounded-3xl shadow-md text-white">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded mb-4" />
      )}
      <ul className="space-y-2">
        <li><strong>ID:</strong> {product.id}</li>
        <li><strong>Description:</strong> {product.description || "—"}</li>
        <li><strong>SKU:</strong> {product.sku}</li>
        <li><strong>Price:</strong> ${product.price}</li>
        <li><strong>Quantity:</strong> {product.quantity}</li>
        <li><strong>Category:</strong> {product.category || "—"}</li>
        <li><strong>Supplier:</strong> {product.supplier || "—"}</li>
        <li><strong>Barcode:</strong> {product.barcode}</li>
        <li><strong>Active:</strong> {product.isActive ? "Yes" : "No"}</li>
        <li><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</li>
        <li><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}</li>
      </ul>
      {isAuthenticated && (
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push(`/products/${id}/edit`)}
          >
            Update
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      )}
    </div>
  );
}
