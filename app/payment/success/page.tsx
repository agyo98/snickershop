'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Copy } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const orderId = searchParams.get('orderId');
  const paymentKey = searchParams.get('paymentKey');
  const amount = searchParams.get('amount');

  // Prevent duplicate API calls
  const confirmationAttempted = useRef(false);

  useEffect(() => {
    const confirmPayment = async () => {
      // Prevent duplicate calls
      if (confirmationAttempted.current) {
        return;
      }

      if (!orderId || !paymentKey || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      // Mark that we're attempting confirmation
      confirmationAttempted.current = true;

      try {
        // 결제 승인 API 호출
        const response = await fetch('/api/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            paymentKey,
            amount: parseInt(amount),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '결제 승인에 실패했습니다.');
        }

        const data = await response.json();
        setOrderData(data);

        // 장바구니에서 구매한 아이템만 제거
        const supabase = createClient();
        const userId = user?.id || localStorage.getItem('temp_user_id');

        if (userId) {
          // 이 주문에 포함된 order_items 조회
          const { data: orderItems, error: fetchError } = await supabase
            .from('order_items')
            .select('cart_item_id')
            .eq('order_id', data.order?.id || orderId)
            .not('cart_item_id', 'is', null); // cart_item_id가 NULL이 아닌 것만 (장바구니 구매)

          if (fetchError) {
            console.error('Error fetching order items:', fetchError);
          } else if (orderItems && orderItems.length > 0) {
            // 장바구니 아이템 ID 목록 추출
            const cartItemIds = orderItems
              .map(item => item.cart_item_id)
              .filter(id => id !== null);

            if (cartItemIds.length > 0) {
              // 해당 장바구니 아이템들만 삭제
              const { error: deleteError } = await supabase
                .from('cart_sneaker')
                .delete()
                .in('id', cartItemIds);

              if (deleteError) {
                console.error('Error clearing cart items:', deleteError);
              } else {
                // 장바구니 업데이트 이벤트 발생 및 라우터 갱신
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('cartUpdated'));
                }
                router.refresh();
              }
            }
          } else {
            console.log('No cart items found to delete for this order');
          }
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setError(err.message || '결제 처리 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    confirmPayment();
  }, [orderId, paymentKey, amount, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const copyOrderNumber = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      alert('주문번호가 복사되었습니다');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-lg text-white">S</span>
                </div>
                <span className="font-bold text-xl text-gray-900">SNEAKR</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">결제를 처리하고 있습니다...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-lg text-white">S</span>
                </div>
                <span className="font-bold text-xl text-gray-900">SNEAKR</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-4xl">✕</span>
            </div>
            <h1 className="font-bold text-4xl text-gray-900 mb-3">결제 처리 실패</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-3">
              <Link href="/cart" className="block">
                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  장바구니로 돌아가기
                </button>
              </Link>
              <Link href="/" className="block">
                <button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  홈으로 가기
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-lg text-white">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900">SNEAKR</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon & Message */}
            <div className="text-center mb-10 animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3">
                주문 완료!
              </h1>
              <p className="text-gray-600">
                주문이 성공적으로 완료되었습니다. 감사합니다!
              </p>
            </div>

            {/* Order Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Order Number */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">주문번호</p>
                  <p className="font-bold text-xl text-gray-900">{orderId}</p>
                </div>
                <button
                  onClick={copyOrderNumber}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  복사
                </button>
              </div>

              {/* Total */}
              <div className="pt-6 flex justify-between items-center">
                <span className="font-medium text-gray-900">총 결제 금액</span>
                <span className="font-bold text-3xl text-gray-900">
                  ₩{formatPrice(parseInt(amount || '0'))}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">배송 안내</h3>
                  <p className="text-sm text-gray-600">
                    주문하신 상품은 영업일 기준 1-3일 내에 발송됩니다.
                    <br />
                    배송 시작 시 알림을 보내드립니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/" className="flex-1">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-6 py-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  쇼핑 계속하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
