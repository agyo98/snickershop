'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreeTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. 회원가입
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        setError(signUpError.message || '회원가입에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('회원가입에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 2. profiles 테이블에 nickname 업데이트 또는 생성
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ nickname: formData.name })
        .eq('id', authData.user.id);

      if (updateError) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: authData.user.id, nickname: formData.name, status: 'valid' });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }

      router.push('/login');
      router.refresh();
    } catch (err) {
      setError('알 수 없는 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: '약함', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, text: '보통', color: 'bg-yellow-500' };
    return { strength: 3, text: '강함', color: 'bg-blue-600' };
  };

  const { strength, text, color } = passwordStrength();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[96px]" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <h2 className="font-bold text-6xl text-white text-center mb-4">
            JOIN THE
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">COMMUNITY</span>
          </h2>
          <p className="text-gray-300 text-center max-w-md mb-8">
            50,000명 이상의 스니커헤드들과 함께하세요.
            독점 정보와 특별 혜택을 받아보세요.
          </p>
          
          <div className="flex flex-col gap-4 text-left w-full max-w-sm">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>100% 정품 보장</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>안전한 거래 시스템</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>신규 회원 10% 할인</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-xl text-white">S</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">SNEAKR</span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="font-bold text-4xl text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                로그인
              </Link>
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                휴대폰 번호
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 pr-12 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${color}`}
                      style={{ width: `${(strength / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{text}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 pr-12 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  <span className="text-gray-900">[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeMarketing}
                  onChange={(e) => setAgreeMarketing(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  <span className="text-gray-900">[선택]</span> 마케팅 정보 수신에 동의합니다.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide uppercase px-6 py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
