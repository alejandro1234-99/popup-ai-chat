import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

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
    <div className="w-[240px] flex-shrink-0 snap-start bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2">{product.title}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <p className="text-base font-bold text-foreground">{product.price}</p>
        <Button
          size="sm"
          variant="default"
          className="w-full text-xs gap-1"
          onClick={() => window.open(product.url, "_blank")}
        >
          Ver producto
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
