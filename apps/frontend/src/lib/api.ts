export async function fetchProducts() {
    const res = await fetch('http://localhost:4000/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }