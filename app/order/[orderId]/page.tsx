'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowLeft, Copy } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                const supabase = createClient();

                // 주문 정보 가져오기
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('order_no', params.orderId)
                    .eq('user_id', user.id)
                    .single();

                if (orderError) throw orderError;

                if (!order) {
                    setError('주문 정보를 찾을 수 없습니다.');
                    setLoading(false);
                    return;
                }

                setOrderData(order);
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching order details:', err);
                setError('주문 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [params.orderId, user, router]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const copyOrderNumber = () => {
        if (params.orderId) {
            navigator.clipboard.writeText(params.orderId);
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
                        <p className="text-gray-600">주문 정보를 불러오는 중...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !orderData) {
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
                        <h1 className="font-bold text-4xl text-gray-900 mb-3">오류</h1>
                        <p className="text-gray-600 mb-8">{error || '주문 정보를 찾을 수 없습니다.'}</p>
                        <div className="space-y-3">
                            <Link href="/profile" className="block">
                                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    마이페이지로 돌아가기
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
                        {/* Back Button */}
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>마이페이지로 돌아가기</span>
                        </Link>

                        {/* Success Icon & Message */}
                        <div className="text-center mb-10 animate-fade-up">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-blue-600" />
                            </div>
                            <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3">
                                주문 상세
                            </h1>
                            <p className="text-gray-600">
                                주문이 성공적으로 완료되었습니다.
                            </p>
                        </div>

                        {/* Order Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            {/* Order Number */}
                            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">주문번호</p>
                                    <p className="font-bold text-xl text-gray-900">{orderData.order_no}</p>
                                </div>
                                <button
                                    onClick={copyOrderNumber}
                                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    복사
                                </button>
                            </div>

                            {/* Order Date */}
                            <div className="py-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">주문일시</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(orderData.created_at).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="py-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">주문 상태</p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${orderData.status === 'DONE'
                                            ? 'bg-green-100 text-green-800'
                                            : orderData.status === 'IN_PROGRESS'
                                                ? 'bg-blue-100 text-blue-800'
                                                : orderData.status === 'CANCELED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {orderData.status === 'DONE'
                                        ? '완료'
                                        : orderData.status === 'IN_PROGRESS'
                                            ? '진행중'
                                            : orderData.status === 'CANCELED'
                                                ? '취소됨'
                                                : '준비중'}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="pt-6 flex justify-between items-center">
                                <span className="font-medium text-gray-900">총 결제 금액</span>
                                <span className="font-bold text-3xl text-gray-900">
                                    ₩{formatPrice(orderData.amount)}
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
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-6 py-4 rounded-lg hover:shadow-lg transition-all">
                                    쇼핑 계속하기
                                </button>
                            </Link>
                            <Link href="/profile" className="flex-1">
                                <button className="w-full border border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    마이페이지
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
