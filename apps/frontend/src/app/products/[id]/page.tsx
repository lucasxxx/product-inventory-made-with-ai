"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ArrowLeft, Edit, Trash2, Package, DollarSign, Hash, Tag, Calendar, CheckCircle2, XCircle } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-destructive text-center">
          <XCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground text-center">
          <Package className="h-8 w-8 mx-auto mb-2" />
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
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
          <div className="flex flex-col sm:flex-row gap-8">
            {product.imageUrl ? (
              <div className="w-full sm:w-64 h-64 rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full sm:w-64 h-64 rounded-lg bg-muted flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.description || "No description available"}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <span>{product.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span>{product.category || "—"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span>{new Date(product.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span>{new Date(product.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {product.isActive ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm text-muted-foreground">Status:</span>
                <span>{product.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="px-6 sm:px-8 py-4 bg-muted/50 border-t border-border/50 flex gap-4">
            <button
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => router.push(`/products/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              onClick={handleRemove}
              disabled={removing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
