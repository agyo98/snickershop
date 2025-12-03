-- ============================================
-- order_items 테이블 생성
-- ============================================
-- 주문에 포함된 개별 상품을 추적하기 위한 테이블
-- cart_item_id를 통해 장바구니 구매와 바로구매를 구분

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products_sneaker(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  size TEXT,
  price INTEGER NOT NULL,
  cart_item_id UUID,  -- 장바구니 구매: cart_sneaker.id, 바로구매: NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_cart_item_id ON public.order_items(cart_item_id);

-- ============================================
-- RLS (Row Level Security) 정책 설정
-- ============================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- order_items 테이블: 본인 주문의 아이템만 조회 가능
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- order_items 테이블: 본인 주문의 아이템만 생성 가능
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can insert own order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
