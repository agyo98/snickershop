'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import CartItem from '@/components/CartItem';
import { getOrCreateSessionId, getSessionId, getSessionExpiresAt, cleanupSessionCart } from '@/utils/session';

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
      // temp_user_id가 없으면 생성
      let userId = user?.id || localStorage.getItem('temp_user_id');
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('temp_user_id', userId);
      }

      // 세션 ID 가져오기 또는 생성
      const sessionId = getOrCreateSessionId();

      try {
        const supabase = createClient();
        // session_id가 null이거나 현재 session_id와 일치하는 데이터 조회 (하위 호환성)
        const { data, error } = await supabase
          .from('cart_sneaker')
          .select(`
            *,
            products_sneaker (*)
          `)
          .eq('user_id', userId)
          .or(`session_id.is.null,session_id.eq.${sessionId}`)
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

    // 기존 데이터에 session_id 업데이트 (하위 호환성)
    const updateOldCartItems = async () => {
      try {
        const supabase = createClient();
        const userId = user?.id || localStorage.getItem('temp_user_id');
        if (!userId) return;

        const sessionId = getOrCreateSessionId();
        const expiresAt = getSessionExpiresAt();

        // session_id가 null인 기존 데이터에 현재 session_id 업데이트
        await supabase
          .from('cart_sneaker')
          .update({
            session_id: sessionId,
            expires_at: expiresAt?.toISOString() || null,
          })
          .eq('user_id', userId)
          .is('session_id', null);
      } catch (error) {
        console.error('Error updating old cart items:', error);
      }
    };
    updateOldCartItems();

    // 만료된 세션 데이터 정리 (페이지 로드 시 한 번)
    const cleanupExpiredSessions = async () => {
      try {
        const supabase = createClient();
        // 만료된 세션 데이터 삭제 함수 호출
        await supabase.rpc('cleanup_expired_cart_sessions');
      } catch (error) {
        console.error('Error cleaning up expired sessions:', error);
      }
    };
    cleanupExpiredSessions();

    // 장바구니 업데이트 이벤트 리스너
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // 세션 종료 시 장바구니 데이터 삭제
    const handlePageHide = () => {
      // pagehide 이벤트는 비동기 작업을 보장하지 않으므로
      // navigator.sendBeacon을 사용하거나 동기적으로 처리
      const supabase = createClient();
      const sessionId = getSessionId();
      if (sessionId) {
        // 비동기 작업이지만 최선의 노력으로 실행
        cleanupSessionCart(supabase).catch(console.error);
      }
    };

    const handleBeforeUnload = () => {
      // beforeunload는 비동기 작업을 보장하지 않지만
      // 최선의 노력으로 실행
      const supabase = createClient();
      const sessionId = getSessionId();
      if (sessionId) {
        cleanupSessionCart(supabase).catch(console.error);
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const refreshCart = async () => {
    const userId = user?.id || localStorage.getItem('temp_user_id');
    if (!userId) return;

    const sessionId = getSessionId();
    if (!sessionId) {
      // session_id가 없으면 기존 데이터 조회 (하위 호환성)
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('cart_sneaker')
          .select(`
            *,
            products_sneaker (*)
          `)
          .eq('user_id', userId)
          .is('session_id', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCartItems(data || []);
      } catch (error) {
        console.error('Error refreshing cart:', error);
      }
      return;
    }

    try {
      const supabase = createClient();
      // session_id가 null이거나 현재 session_id와 일치하는 데이터 조회
      const { data, error } = await supabase
        .from('cart_sneaker')
        .select(`
          *,
          products_sneaker (*)
        `)
        .eq('user_id', userId)
        .or(`session_id.is.null,session_id.eq.${sessionId}`)
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

