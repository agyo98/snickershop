'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import type { Product, CartItem } from '@/types/product.types';

interface CartItemData extends CartItem {
  products_sneaker: Product;
}

// Toss Payments V2 SDK 타입 정의
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      payment: (params: { customerKey: string }) => {
        requestPayment: (params: {
          method: string;
          amount: {
            currency: string;
            value: number;
          };
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
          customerEmail?: string;
          customerName?: string;
          customerMobilePhone?: string;
        }) => Promise<void>;
      };
    };
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const supabase = createClient();
        const userId = user?.id || localStorage.getItem('temp_user_id');

        if (!userId) {
          router.push('/login');
          return;
        }

        // 바로구매인 경우 (쿼리 파라미터 확인)
        const productId = searchParams.get('productId');
        const size = searchParams.get('size');
        const quantity = searchParams.get('quantity');

        if (productId && size && quantity) {
          // 바로구매: 해당 상품 정보를 가져와서 임시 장바구니 아이템으로 설정
          const { data: product, error: productError } = await supabase
            .from('products_sneaker')
            .select('*')
            .eq('id', productId)
            .single();

          if (productError || !product) {
            router.push('/cart');
            return;
          }

          // 임시 장바구니 아이템 생성 (DB에 저장하지 않음)
          setCartItems([{
            id: 'temp-' + Date.now(),
            user_id: userId,
            product_id: productId,
            size: size,
            quantity: parseInt(quantity, 10),
            created_at: new Date().toISOString(),
            products_sneaker: product as Product,
          } as CartItemData]);
          setLoading(false);
          return;
        }

        // 일반 장바구니에서 가져오기
        const { data, error } = await supabase
          .from('cart_sneaker')
          .select(`
            *,
            products_sneaker (*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
          router.push('/cart');
          return;
        }

        setCartItems(data || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, router, searchParams]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = item.products_sneaker as Product;
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handlePayment = async () => {
    // 배송지 정보 검증
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.zipCode) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const supabase = createClient();
      const userId = user?.id || localStorage.getItem('temp_user_id');
      const totalAmount = calculateTotal();

      // 주문번호 생성 (타임스탬프 + 랜덤 문자열)
      const orderNo = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 주문 생성 (READY 상태)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_no: orderNo,
          amount: totalAmount,
          status: 'READY',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 바로구매인지 장바구니 구매인지 확인
      const isDirectPurchase = searchParams.get('productId') !== null;

      // 주문 아이템 저장
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        price: item.products_sneaker.price,
        // 바로구매면 NULL, 장바구니 구매면 cart_item_id 저장
        cart_item_id: isDirectPurchase ? null : item.id,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) {
        console.error('Error creating order items:', orderItemsError);
        throw new Error('주문 아이템 저장에 실패했습니다.');
      }

      // Toss Payments V2 SDK 초기화
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error('Toss Payments client key is not set');
      }

      const customerKey = userId || 'guest';

      // V2 SDK 사용 - payment() 메서드로 결제창 객체 생성
      const tossPayments = window.TossPayments(clientKey);
      const paymentInstance = tossPayments.payment({ customerKey });

      // 결제창 열기
      await paymentInstance.requestPayment({
        method: 'CARD', // 카드 결제
        amount: {
          currency: 'KRW',
          value: totalAmount,
        },
        orderId: orderNo,
        orderName: cartItems.length === 1
          ? cartItems[0].products_sneaker.name
          : `${cartItems[0].products_sneaker.name} 외 ${cartItems.length - 1}개`,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderNo}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderNo}`,
        customerEmail: user?.email || undefined,
        customerName: deliveryInfo.name,
        customerMobilePhone: deliveryInfo.phone.replace(/-/g, ''),
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`결제 요청 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">결제하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 배송지 정보 및 주문 상품 요약 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 배송지 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">배송지 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    받는 분 이름 *
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.name}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      우편번호 *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.zipCode}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주소 *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="서울시 강남구"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상세 주소
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.detailAddress}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, detailAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="아파트/동/호수"
                  />
                </div>
              </div>
            </div>

            {/* 주문 상품 요약 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const product = item.products_sneaker as Product;
                  const imageUrl = imageErrors[item.id]
                    ? '/placeholder-sneaker.svg'
                    : (product.image_url || '/placeholder-sneaker.svg');
                  return (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={() => setImageErrors({ ...imageErrors, [item.id]: true })}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        {item.size && <p className="text-sm text-gray-500">사이즈: {item.size}</p>}
                        <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₩{(product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 결제 정보 및 버튼 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">결제 정보</h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">₩{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-medium">₩0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">총 결제 금액</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₩{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? '처리 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
