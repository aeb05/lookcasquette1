import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();

  return (
    <div
      className="group opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category badge */}
          <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-full border border-border/50 tracking-wider uppercase">
            {product.category}
          </span>

          {/* Quick add */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-display text-lg tracking-wider opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-glow"
          >
            <ShoppingCart size={16} />
            AJOUTER AU PANIER
          </button>
        </div>
      </Link>

      <Link to={`/product/${product.id}`} className="block mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-0.5">{product.category}</p>
          </div>
          <span className="font-display text-xl text-primary">{product.price} MAD</span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
