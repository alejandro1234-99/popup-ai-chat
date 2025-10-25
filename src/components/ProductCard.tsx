import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: {
    title: string;
    image: string;
    price: string;
    description: string;
    url: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="w-[240px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {product.image && (
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        )}
        <p className="text-base font-bold text-blue-600 pt-1">{product.price}</p>
        <button
          onClick={() => window.open(product.url, "_blank")}
          className="w-full mt-2 rounded-full bg-blue-600 text-white px-4 py-2 text-xs font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1.5"
        >
          Ver producto
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
