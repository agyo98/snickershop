import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, brand, price, image, isNew }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-500 hover:border-primary/50 hover:shadow-hover">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* New Badge */}
          {isNew && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
              NEW
            </span>
          )}
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:border-primary/50 transition-all duration-300"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {brand}
          </p>
          <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="font-display text-xl text-foreground">
            ₩{formatPrice(price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
