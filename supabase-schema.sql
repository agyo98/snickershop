-- ============================================
-- 👟 운동화 쇼핑몰 Supabase 데이터베이스 스키마
-- ============================================
-- 이 파일은 Supabase SQL Editor에서 실행할 수 있는 스키마 정의입니다.
-- 모든 테이블 생성은 IF NOT EXISTS를 사용하여 안전하게 실행됩니다.
-- ============================================

-- ============================================
-- 1. products_sneaker 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.products_sneaker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. cart_sneaker 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_sneaker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products_sneaker(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  session_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, session_id)
);

-- ============================================
-- 3. profiles 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 4. profiles 테이블 자동 생성 함수 및 트리거
-- ============================================
-- auth.users에 신규 유저 생성 시 profiles 테이블에 자동으로 행 추가

-- 함수 생성 (이미 존재하면 교체)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    'valid'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (기존 트리거가 있으면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. RLS (Row Level Security) 정책 설정
-- ============================================

-- profiles 테이블 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- profiles 테이블: 모든 사용자 읽기 허용 (Select)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- profiles 테이블: 본인만 수정 허용 (Update)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- profiles 테이블: 본인만 삭제 허용 (Delete)
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- 6. orders 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_no TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'READY' CHECK (status IN ('READY', 'IN_PROGRESS', 'DONE', 'CANCELED')),
  payment_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. orders 테이블 RLS 정책 설정
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- orders 테이블: 본인 주문만 조회 가능
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- orders 테이블: 본인 주문만 생성 가능
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- orders 테이블: 본인 주문만 수정 가능
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. 인덱스 생성 (성능 최적화)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cart_sneaker_user_id ON public.cart_sneaker(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_sneaker_product_id ON public.cart_sneaker(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_sneaker_session_id ON public.cart_sneaker(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sneaker_user_session ON public.cart_sneaker(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_products_sneaker_category ON public.products_sneaker(category);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON public.orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ============================================
-- 9. 만료된 세션 데이터 자동 삭제 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_cart_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cart_sneaker
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

