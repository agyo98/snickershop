# 👟 운동화 쇼핑몰 (Sneaker Shop)

Next.js와 Supabase를 사용한 운동화 온라인 쇼핑몰 프로젝트입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key

# 토스 페이먼츠 환경 변수
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key
```

- **Supabase**: Supabase 대시보드의 Settings > API에서 확인할 수 있습니다.
- **토스 페이먼츠**: 토스 페이먼츠 대시보드(https://dashboard.tosspayments.com)에서 확인할 수 있습니다.
  - Client Key는 클라이언트 사이드에서 사용되며, Secret Key는 서버 사이드에서만 사용됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 데이터베이스 구조

### 데이터베이스 스키마 설정

Supabase 프로젝트에서 데이터베이스 스키마를 설정하려면:

1. Supabase 대시보드 → SQL Editor로 이동
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. 모든 테이블, 트리거, RLS 정책이 자동으로 생성됩니다

**참고**: 모든 SQL 명령문은 `IF NOT EXISTS`를 사용하여 안전하게 실행됩니다.

### 테이블

- **products_sneaker**: 상품 정보
  - id (UUID)
  - name (TEXT)
  - brand (TEXT)
  - price (INTEGER)
  - image_url (TEXT)
  - category (TEXT)
  - description (TEXT, nullable)
  - created_at (TIMESTAMP)

- **cart_sneaker**: 장바구니 정보
  - id (UUID)
  - user_id (UUID)
  - product_id (UUID, FK to products_sneaker)
  - quantity (INTEGER)
  - created_at (TIMESTAMP)

- **profiles**: 사용자 프로필 정보
  - id (UUID, PK, FK to auth.users)
  - nickname (TEXT, NOT NULL)
  - status (TEXT, default 'valid', check: 'valid' or 'deleted')
  - created_at (TIMESTAMP)
  - deleted_at (TIMESTAMP, nullable)

## 🎨 주요 기능

- ✅ 상품 목록 조회
- ✅ 상품 상세 페이지
- ✅ 장바구니 추가/수정/삭제
- ✅ 반응형 디자인 (모바일/데스크탑)

## 📝 TODO

현재 프로젝트 상태는 `todo.md` 파일을 참조하세요.

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage)
- **Deployment**: Vercel (권장)

## 📦 빌드

```bash
npm run build
npm start
```

## 🔒 보안 참고사항

- Supabase Auth를 사용한 실제 사용자 인증이 구현되어 있습니다.
- RLS (Row Level Security) 정책이 적용되어 사용자는 본인의 데이터만 접근할 수 있습니다.
- 프로필 정보는 모든 사용자가 읽을 수 있지만, 수정/삭제는 본인만 가능합니다.

