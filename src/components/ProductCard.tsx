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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow max-w-[320px]">
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-base text-foreground leading-tight">{product.title}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <p className="text-lg font-bold text-foreground pt-1">{product.price}</p>
        <Button
          size="sm"
          variant="default"
          className="w-full mt-2 gap-1"
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
