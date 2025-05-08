"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

type ProductHeaderProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ProductHeader({ search, setSearch }: ProductHeaderProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              type="button"
              className="border border-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-900 transition text-white bg-black"
              onClick={() => {
                console.log('Add Product clicked');
                router.push('/products/new');
              }}
            >
              + Add Product
            </button>
          )}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src={user?.imageUrl || '/placeholder.png'}
                  alt={user?.name || 'Profile'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white hover:text-gray-300 transition"
            >
              Login
            </Link>
          )}
        </div>
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