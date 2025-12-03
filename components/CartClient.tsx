'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import CartItem from '@/components/CartItem';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
}

interface CartItemData {
  id: string;
  quantity: number;
  size?: string | null;
  products_sneaker: Product;
}

export default function CartClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      // 로그인한 사용자는 user.id 사용, 비로그인 사용자는 temp_user_id 사용
      let userId = user?.id;
      if (!userId) {
        userId = localStorage.getItem('temp_user_id');
        if (!userId) {
          userId = crypto.randomUUID();
          localStorage.setItem('temp_user_id', userId);
        }
      }

      try {
        const supabase = createClient();
        
        // user_id로만 장바구니 조회
        const { data, error } = await supabase
          .from('cart_sneaker')
          .select(`
            *,
            products_sneaker (*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCartItems(data || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    // 장바구니 업데이트 이벤트 리스너
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const refreshCart = async () => {
    const userId = user?.id || localStorage.getItem('temp_user_id');
    if (!userId) return;

    try {
      const supabase = createClient();
      
      // user_id로만 장바구니 조회
      const { data, error } = await supabase
        .from('cart_sneaker')
        .select(`
          *,
          products_sneaker (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const product = item.products_sneaker as Product;
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} cartItem={item} onUpdate={refreshCart} />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">총 제품 개수</span>
            <span className="font-semibold text-gray-900">{totalItems}개</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">총 금액</span>
            <span className="text-2xl font-bold text-blue-600">
              ₩{total.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

