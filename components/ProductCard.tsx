'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  image?: string;
  category?: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const imageUrl = product.image_url || product.image || '/placeholder-sneaker.svg';
  const displayImageUrl = imageError ? '/placeholder-sneaker.svg' : imageUrl;

  return (
    <div
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-500 hover:border-blue-500/50 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={displayImageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* New Badge */}
          {product.isNew && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full z-10">
              NEW
            </span>
          )}

          {/* Like Button - Outside of Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-gray-200 hover:border-blue-500/50 transition-all duration-300 z-20"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isLiked ? 'fill-blue-600 text-blue-600' : 'text-gray-700'}`}
            />
          </button>

          {/* Link Overlay */}
          <Link
            href={`/product/${product.id}`}
            className="absolute inset-0 z-0"
          >
            <span className="sr-only">View product</span>
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-4 relative pointer-events-none">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="font-bold text-xl text-gray-900">
            ₩{formatPrice(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
}

