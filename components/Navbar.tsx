'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { ShoppingCart, User, LogOut, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, isLoading, logout, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-xl text-white">S</span>
            </div>
            <span className="font-bold text-2xl md:text-3xl text-gray-900 group-hover:text-blue-600 transition-colors">
              SNEAKR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="text-gray-500 text-sm">로딩 중...</div>
            ) : user ? (
              <>
                <Link
                  href="/product/new"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  상품등록
                </Link>
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-gray-900 p-2 rounded-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 p-2 rounded-md"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={logout}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-900 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {isLoading ? (
                <div className="text-gray-500 text-sm py-2">로딩 중...</div>
              ) : user ? (
                <>
                  <Link
                    href="/product/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    상품등록
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    장바구니
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

