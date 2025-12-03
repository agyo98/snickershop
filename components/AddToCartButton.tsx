'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getOrCreateSessionId, getSessionExpiresAt } from '@/utils/session';

interface AddToCartButtonProps {
  productId: string;
  size?: string;
  quantity?: number;
}

export default function AddToCartButton({ productId, size, quantity = 1 }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      const tempUserId = localStorage.getItem('temp_user_id') || crypto.randomUUID();
      if (!localStorage.getItem('temp_user_id')) {
        localStorage.setItem('temp_user_id', tempUserId);
      }

      // 세션 ID 가져오기 또는 생성
      const sessionId = getOrCreateSessionId();
      const expiresAt = getSessionExpiresAt();

      // 기존 장바구니에 같은 상품, 사이즈가 있는지 확인
      // session_id가 null이거나 현재 session_id와 일치하는 경우 (하위 호환성)
      const { data: existingCart } = await supabase
        .from('cart_sneaker')
        .select('*')
        .eq('user_id', tempUserId)
        .eq('product_id', productId)
        .eq('size', size)
        .or(`session_id.is.null,session_id.eq.${sessionId}`)
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
            user_id: tempUserId,
            product_id: productId,
            size: size,
            quantity: quantity,
            session_id: sessionId,
            expires_at: expiresAt?.toISOString() || null,
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

