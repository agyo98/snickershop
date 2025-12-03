# Lovable 코드 통합 가이드

Lovable에서 디자인한 코드를 Next.js 프로젝트에 통합하는 방법입니다.

## 📋 통합 단계

### 1단계: Lovable에서 코드 Export
- Lovable에서 "Export Code" 또는 "Copy Code" 기능 사용
- React + Tailwind CSS 형식으로 Export
- 코드를 복사하거나 파일로 저장

### 2단계: 코드 분석 및 분리
Lovable에서 가져온 코드를 다음 구조로 분리합니다:

```
components/
  ├── Navbar.tsx          (헤더/네비게이션)
  ├── ProductCard.tsx     (상품 카드)
  ├── HeroSection.tsx     (히어로 배너 - 필요시)
  └── ... (기타 재사용 컴포넌트)

app/
  ├── page.tsx            (메인 페이지)
  ├── product/[id]/page.tsx (상품 상세)
  ├── login/page.tsx      (로그인)
  ├── signup/page.tsx     (회원가입)
  └── checkout/page.tsx   (결제)
```

### 3단계: 주요 수정 사항

#### ✅ Next.js App Router 구조에 맞게 변환
- `'use client'` 지시어 추가 (상태 관리, 이벤트 핸들러 사용 시)
- Server Component vs Client Component 구분
- `async/await` 사용 (Server Component에서 데이터 fetching)

#### ✅ 이미지 최적화
```tsx
// ❌ Lovable (일반 img 태그)
<img src={imageUrl} alt="product" />

// ✅ Next.js (next/image 사용)
import Image from 'next/image';
<Image 
  src={imageUrl} 
  alt="product" 
  fill 
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### ✅ 라우팅 변경
```tsx
// ❌ Lovable (일반 a 태그)
<a href="/product/123">상품 보기</a>

// ✅ Next.js (next/link 사용)
import Link from 'next/link';
<Link href={`/product/${product.id}`}>상품 보기</Link>
```

#### ✅ Supabase 데이터 연동
```tsx
// Server Component에서 데이터 fetching
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products_sneaker')
    .select('*');
  
  return (
    // JSX with products data
  );
}
```

### 4단계: 컴포넌트별 통합 방법

#### 메인 페이지 (`app/page.tsx`)
- Lovable의 메인 레이아웃 코드를 가져옴
- Hero Section과 Product Grid 부분 분리
- Supabase에서 products 데이터 fetching 추가
- ProductCard 컴포넌트에 실제 데이터 props 전달

#### 상품 상세 페이지 (`app/product/[id]/page.tsx`)
- Lovable의 상세 페이지 레이아웃 사용
- `params.id`로 동적 라우팅 처리
- Supabase에서 해당 상품 데이터 fetching
- AddToCartButton 컴포넌트 연결

#### 로그인/회원가입 페이지
- Lovable의 폼 디자인 사용
- Supabase Auth 로직 추가
- `'use client'` 추가 (폼 상태 관리)

#### 네비게이션 바 (`components/Navbar.tsx`)
- Lovable의 헤더 디자인 사용
- AuthContext와 연동하여 로그인 상태 표시
- Next.js Link 컴포넌트로 변경

## 🔧 실제 통합 예시

### 예시 1: Lovable에서 가져온 메인 페이지 코드를 통합

**Lovable 코드 (예시):**
```tsx
<div className="container mx-auto">
  <h1>운동화 쇼핑몰</h1>
  <div className="grid grid-cols-4 gap-4">
    {products.map(product => (
      <div key={product.id}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    ))}
  </div>
</div>
```

**Next.js로 변환:**
```tsx
// app/page.tsx
import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products_sneaker')
    .select('*')
    .limit(12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">운동화 쇼핑몰</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 📝 체크리스트

통합 후 확인할 사항:

- [ ] 모든 `img` 태그를 `next/image`로 변경
- [ ] 모든 `a` 태그를 `next/link`로 변경
- [ ] Client Component에 `'use client'` 추가
- [ ] Server Component에서 Supabase 데이터 fetching 구현
- [ ] 타입 정의 추가 (TypeScript)
- [ ] 반응형 디자인 확인 (모바일/태블릿/데스크탑)
- [ ] Tailwind 클래스가 올바르게 적용되는지 확인
- [ ] 빌드 테스트 (`npm run build`)

## 🚀 다음 단계

1. **코드 통합**: Lovable 코드를 위 가이드에 따라 통합
2. **데이터 연동**: Supabase와 실제 데이터 연결
3. **기능 구현**: 장바구니, 결제 등 기능 추가
4. **최적화**: 성능 및 SEO 최적화

## 💡 팁

- Lovable 코드를 그대로 사용하지 말고, 프로젝트 구조에 맞게 리팩토링
- 컴포넌트를 작은 단위로 분리하여 재사용성 높이기
- 타입 안정성을 위해 TypeScript 인터페이스 정의
- 기존 컴포넌트와 스타일 일관성 유지

