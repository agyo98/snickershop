-- ============================================
-- 장바구니에서 session_id 제거 마이그레이션
-- ============================================
-- 이 마이그레이션은 cart_sneaker 테이블에서 session_id와 expires_at 컬럼을 제거하고
-- user_id만 사용하도록 변경합니다.
-- ============================================

-- 1. 기존 UNIQUE 제약조건 제거 (session_id 포함)
ALTER TABLE public.cart_sneaker 
DROP CONSTRAINT IF EXISTS cart_sneaker_user_id_product_id_size_session_id_key;

-- 2. session_id 관련 인덱스 제거
DROP INDEX IF EXISTS public.idx_cart_sneaker_session_id;
DROP INDEX IF EXISTS public.idx_cart_sneaker_user_session;

-- 3. session_id와 expires_at 컬럼 제거
ALTER TABLE public.cart_sneaker 
DROP COLUMN IF EXISTS session_id,
DROP COLUMN IF EXISTS expires_at;

-- 4. 새로운 UNIQUE 제약조건 추가 (user_id, product_id, size만)
ALTER TABLE public.cart_sneaker 
ADD CONSTRAINT cart_sneaker_user_id_product_id_size_key 
UNIQUE(user_id, product_id, size);

-- 5. 만료된 세션 데이터 삭제 함수 제거 (더 이상 필요 없음)
DROP FUNCTION IF EXISTS public.cleanup_expired_cart_sessions();

