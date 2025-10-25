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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-3 space-y-2">
        <h4 className="font-semibold text-sm text-foreground">{product.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-primary">{product.price}</span>
          <Button
            size="sm"
            variant="default"
            className="h-8 text-xs gap-1"
            onClick={() => window.open(product.url, "_blank")}
          >
            Ver producto
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
