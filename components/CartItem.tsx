'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
}

interface CartItemProps {
  cartItem: {
    id: string;
    quantity: number;
    size?: string | null;
    products_sneaker: Product;
  };
  onUpdate?: () => void;
}

export default function CartItem({ cartItem, onUpdate }: CartItemProps) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const product = cartItem.products_sneaker as Product;
  
  const imageUrl = imageError ? '/placeholder-sneaker.svg' : (product.image_url || '/placeholder-sneaker.svg');

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    try {
      const supabase = createClient();

      if (newQuantity === 0) {
        // 삭제
        await supabase
          .from('cart_sneaker')
          .delete()
          .eq('id', cartItem.id);
      } else {
        // 수량 업데이트
        await supabase
          .from('cart_sneaker')
          .update({ quantity: newQuantity })
          .eq('id', cartItem.id);
      }
      
      setQuantity(newQuantity);
      onUpdate?.();
      // 장바구니 업데이트 이벤트 발생
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
          onError={() => setImageError(true)}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>
        {cartItem.size && (
          <p className="text-sm text-gray-500">사이즈: {cartItem.size}</p>
        )}
        <p className="text-lg font-bold text-gray-900 mt-2">
          ₩{product.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(quantity - 1)}
          disabled={loading || quantity <= 1}
          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-12 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => updateQuantity(quantity + 1)}
          disabled={loading}
          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
        <button
          onClick={() => updateQuantity(0)}
          disabled={loading}
          className="ml-4 text-red-500 hover:text-red-700 text-sm"
        >
          삭제
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          ₩{(product.price * quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

