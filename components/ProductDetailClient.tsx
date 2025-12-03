'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Shield, Truck, RefreshCw, Minus, Plus, Share2 } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const sizes = ['250', '255', '260', '265', '270', '275', '280', '285', '290'];
  const images = product.image_url ? [product.image_url] : ['/placeholder-sneaker.svg'];
  
  const getImageUrl = (index: number) => {
    if (imageErrors[index]) {
      return '/placeholder-sneaker.svg';
    }
    return images[index] || '/placeholder-sneaker.svg';
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요');
      return;
    }
    router.push(`/checkout?productId=${product.id}&size=${selectedSize}&quantity=${quantity}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image
            src={getImageUrl(selectedImage)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => setImageErrors({ ...imageErrors, [selectedImage]: true })}
          />
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-gray-200 hover:border-blue-500/50 transition-all"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${isLiked ? 'fill-blue-600 text-blue-600' : 'text-gray-700'}`}
            />
          </button>
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-blue-500/50'
                }`}
              >
                <Image
                  src={getImageUrl(index)}
                  alt=""
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={() => setImageErrors({ ...imageErrors, [index]: true })}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Brand & Name */}
        <div>
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">
            {product.brand}
          </p>
          <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="font-bold text-4xl text-gray-900">
              ₩{formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-900 font-medium">사이즈</label>
            <button className="text-sm text-blue-600 hover:underline">
              사이즈 가이드
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-500/50 text-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-3">
          <label className="text-gray-900 font-medium">수량</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <AddToCartButton productId={product.id} size={selectedSize || undefined} quantity={quantity} />
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-6 py-4 rounded-lg hover:shadow-lg transition-all"
          >
            바로 구매
          </button>
          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 h-14 w-14 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">정품 보장</p>
            <p className="text-xs text-gray-600">100% 인증</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">무료 배송</p>
            <p className="text-xs text-gray-600">5만원 이상</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">반품 가능</p>
            <p className="text-xs text-gray-600">7일 이내</p>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 mb-3">상품 설명</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

