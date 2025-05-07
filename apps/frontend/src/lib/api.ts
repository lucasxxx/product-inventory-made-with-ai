const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchProducts(page = 1, pageSize = 20) {
  const res = await fetch(`${API_URL}/products?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function searchProducts(search: string, page = 1, pageSize = 20) {
  const params = new URLSearchParams({
    search,
    page: String(page),
    pageSize: String(pageSize),
  });
  const res = await fetch(`${API_URL}/products/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search products');
  return res.json();
}