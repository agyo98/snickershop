'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.';

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
      <main className="flex-1 flex items-center justify-center py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 animate-fade-up">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            {/* Error Message */}
            <h1 className="font-bold text-4xl text-gray-900 mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              결제 실패
            </h1>
            <p className="text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {errorMessage}
            </p>

            {/* Error Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-medium text-gray-900 mb-3">문제 해결 방법</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  카드 정보가 올바르게 입력되었는지 확인해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  카드 한도를 확인해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  브라우저를 새로고침한 후 다시 시도해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  문제가 계속되면 고객센터로 문의해주세요.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <Link href="/checkout" className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-6 py-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  다시 시도하기
                </button>
              </Link>
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    홈으로
                  </button>
                </Link>
                <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
