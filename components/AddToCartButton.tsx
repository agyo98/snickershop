'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

interface AddToCartButtonProps {
  productId: string;
  size?: string;
  quantity?: number;
}

export default function AddToCartButton({ productId, size, quantity = 1 }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!size) {
      setMessage('사이즈를 선택해주세요');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      
      // user_id 가져오기 (로그인 사용자 또는 임시 사용자)
      let userId: string;
      if (user?.id) {
        userId = user.id;
      } else {
        userId = localStorage.getItem('temp_user_id') || crypto.randomUUID();
        if (!localStorage.getItem('temp_user_id')) {
          localStorage.setItem('temp_user_id', userId);
        }
      }

      // 기존 장바구니에 같은 상품, 사이즈가 있는지 확인
      const { data: existingCart } = await supabase
        .from('cart_sneaker')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size)
        .maybeSingle();

      if (existingCart) {
        // 수량 증가
        const { error } = await supabase
          .from('cart_sneaker')
          .update({ quantity: existingCart.quantity + quantity })
          .eq('id', existingCart.id);

        if (error) throw error;
        setMessage('장바구니에 추가되었습니다! (수량 증가)');
      } else {
        // 새로 추가
        const { error } = await supabase
          .from('cart_sneaker')
          .insert({
            user_id: userId,
            product_id: productId,
            size: size,
            quantity: quantity,
          });

        if (error) throw error;
        setMessage('장바구니에 추가되었습니다!');
      }

      // 장바구니 업데이트 이벤트 발생
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex-1">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-5 h-5" />
        {loading ? '추가 중...' : '장바구니'}
      </button>
      {message && (
        <p className={`mt-2 text-center text-sm ${message.includes('오류') || message.includes('선택') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

