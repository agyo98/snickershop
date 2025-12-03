'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { User, Package, LogOut, Edit2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const supabase = createClient();
        
        // 주문 내역 가져오기
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.nickname || user.email?.split('@')[0] || '사용자'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                >
                  <Package className="w-5 h-5" />
                  <span>장바구니</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>

          {/* 주문 내역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 내역</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">주문 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">주문번호: {order.order_no}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString('ko-KR')}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'DONE'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'CANCELED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status === 'DONE'
                            ? '완료'
                            : order.status === 'IN_PROGRESS'
                            ? '진행중'
                            : order.status === 'CANCELED'
                            ? '취소됨'
                            : '준비중'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-gray-900">
                          ₩{order.amount.toLocaleString()}
                        </p>
                        {order.status === 'DONE' && (
                          <button
                            onClick={() => router.push(`/payment/success?orderId=${order.order_no}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            상세보기
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

