import Link from 'next/link';

type ProductCardProps = {
    id: number;
    name: string;
    imageUrl?: string;
    quantity: number;
  };
  
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-gray-700 text-gray-300' };
    if (quantity < 5) return { label: 'Low Stock', color: 'bg-yellow-600 text-yellow-100' };
    return { label: 'In Stock', color: 'bg-green-700 text-green-100' };
  };
  
  export default function ProductCard({ id, name, imageUrl, quantity }: ProductCardProps) {
    const status = getStockStatus(quantity);
  
    return (
      <Link href={`/products/${id}`} className="block">
        <div className="flex items-center bg-black rounded-xl border border-gray-700 p-4 shadow-sm hover:bg-gray-900 transition">
          <img
            src={imageUrl || '/placeholder.png'}
            alt={name}
            className="w-16 h-16 rounded-lg object-cover bg-gray-800 mr-4"
          />
          <div className="flex-1">
            <div className="font-semibold text-lg text-white">{name}</div>
            <div className="text-gray-400">{quantity} in stock</div>
          </div>
          <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </Link>
    );
  }