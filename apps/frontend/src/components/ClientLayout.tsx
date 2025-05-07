"use client";

import { useState } from "react";
import ProductHeader from "@/components/ProductHeader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProductHeader
        search={search}
        setSearch={setSearch}
        onAdd={() => {}}
      />
      <main>{children}</main>
    </div>
  );
}
