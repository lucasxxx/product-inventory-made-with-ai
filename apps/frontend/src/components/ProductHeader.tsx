type ProductHeaderProps = {
    search: string;
    setSearch: (value: string) => void;
    onAdd: () => void;
  };
  
  export default function ProductHeader({ search, setSearch, onAdd }: ProductHeaderProps) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <button
            className="border border-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-900 transition text-white bg-black"
            onClick={onAdd}
          >
            + Add Product
          </button>
        </div>
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    );
  }