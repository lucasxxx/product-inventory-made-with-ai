const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchProducts(page = 1, pageSize = 20) {
  const res = await fetch(`${API_URL}/products?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}