"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductHeaderProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
};

export default function ProductHeader({ search, setSearch, onAdd }: ProductHeaderProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/search/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-white"
        >
          Products
        </Link>
        <button
          type="button"
          className="border border-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-900 transition text-white bg-black"
          onClick={onAdd}
        >
          + Add Product
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
      </form>
    </div>
  );
}