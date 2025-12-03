'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm text-gray-300">Premium Sneaker Marketplace</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            YOUR NEXT
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GRAIL AWAITS</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            한정판 스니커즈부터 클래식까지, 당신이 찾는 모든 신발을 만나보세요.
            <br className="hidden md:block" />
            100% 정품 보장, 안전한 거래.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-10 py-4 rounded-lg hover:shadow-lg transition-all min-w-[200px] flex items-center justify-center gap-2"
            >
              쇼핑 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/signup"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-lg hover:bg-white/20 transition-all min-w-[200px] flex items-center justify-center"
            >
              회원가입
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="font-bold text-3xl md:text-4xl text-white">10K+</p>
              <p className="text-sm text-gray-300 mt-1">상품</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-3xl md:text-4xl text-white">50K+</p>
              <p className="text-sm text-gray-300 mt-1">회원</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-3xl md:text-4xl text-white">100%</p>
              <p className="text-sm text-gray-300 mt-1">정품 보장</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

