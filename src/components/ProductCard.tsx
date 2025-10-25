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
    <div className="min-w-[240px] max-w-[250px] flex-shrink-0 bg-[#1F2937] border border-[#374151] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_16px_rgba(96,165,250,0.2)] transition-all duration-300">
      {product.image && (
        <div className="aspect-square overflow-hidden bg-[#111827]">
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
        <h3 className="font-semibold text-sm text-[#F3F4F6] leading-tight line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-[#9CA3AF] line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        )}
        <p className="text-base font-bold text-[#60A5FA] pt-1">{product.price}</p>
        <button
          onClick={() => window.open(product.url, "_blank")}
          className="w-full mt-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-4 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
        >
          Ver producto
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
