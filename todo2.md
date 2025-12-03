# 👟 운동화 쇼핑몰 개발 Todo List (Final)

## Phase 1: 환경 설정 및 백엔드 준비 (Setup & Backend)

- [ ] **[Supabase]** 새 프로젝트 생성하기 (Organization 및 Region 설정)
- [ ] **[Supabase]** Database Table 설계 및 생성 (SQL Editor 사용)
    - `products` 테이블: id, name, brand, price, image_url, category, description
    - `cart` 테이블: id, user_id, product_id, quantity
    - `profiles` 테이블: id(PK), nickname, status, created_at, deleted_at
    - **(NEW)** `orders` 테이블 생성:
        - `id`: uuid (PK)
        - `user_id`: uuid (FK referencing profiles.id)
        - `order_no`: text (주문번호, unique)
        - `amount`: integer (결제 금액)
        - `status`: text (READY, IN_PROGRESS, DONE, CANCELED)
        - `payment_key`: text (토스 결제 키, nullable)
        - `created_at`: timestamp
- [ ] **[Supabase]** `profiles` 테이블 자동 생성 트리거(Trigger) 설정
- [ ] **[Supabase]** RLS(Row Level Security) 정책 설정 (profiles, orders)
- [ ] **[Supabase]** Storage 버킷 생성 및 샘플 데이터 추가

## Phase 2: UI 디자인 및 코드 확보 (Design with Lovable)

- [ ] **[Lovable]** 메인 페이지 및 헤더(로그인/회원가입/상품등록/로그아웃 버튼) 디자인
- [ ] **[Lovable]** 로그인/회원가입 페이지 디자인
- [ ] **[Lovable]** 상품 상세 페이지 디자인
- [ ] **[Lovable]** **(NEW)** 주문/결제 페이지(Checkout) 디자인 생성
    - 프롬프트: "배송지 입력 폼, 주문 상품 요약, 그리고 하단에 결제 위젯이 들어갈 빈 컨테이너가 있는 결제 페이지."
    - **(NEW)** 결제 성공/실패 페이지 디자인 (심플하게)
- [ ] **[Lovable]** UI 컴포넌트 코드 Export

## Phase 3: 프론트엔드 이식 및 기본 구조 (Integration)

- [ ] **[Cursor]** Next.js 프로젝트 생성 및 환경 변수 설정
- [ ] **[Cursor]** Lovable 코드 이식 및 컴포넌트 분리
- [ ] **[Cursor]** 전역 상태 관리를 위한 `AuthContext` 구현
- [ ] **[Cursor]** `app/layout.tsx`에 `AuthProvider` 적용

## Phase 4: 핵심 기능 구현 (Core Logic)

- [ ] **[Cursor]** 로그인(`app/login`) 및 회원가입 로직 구현 (Supabase Auth)
- [ ] **[Cursor]** 동적 헤더(Header) 기능 구현 (로그인 상태에 따른 버튼 변경)
- [ ] **[Cursor]** 메인 및 상세 페이지 데이터 Fetching
- [ ] **[Cursor]** 장바구니 담기 및 조회 기능 구현

## Phase 5: 결제 시스템 연동 (Toss Payments)

- [ ] **[Cursor]** **(NEW)** 토스 페이먼츠 SDK 설치
    - `npm install @tosspayments/payment-widget-sdk`
- [ ] **[Cursor]** **(NEW)** 환경 변수 추가 (`.env.local`)
    - `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`
- [ ] **[Cursor]** **(NEW)** 결제 페이지(`app/checkout/page.tsx`) 구현
    - 토스 결제 위젯 렌더링
    - '결제하기' 버튼 클릭 시 `requestPayment` 호출 (주문번호 생성 로직 포함)
- [ ] **[Cursor]** **(NEW)** 결제 승인 API Route 구현 (`app/api/confirm/route.ts`)
    - 클라이언트가 아닌 **서버 사이드**에서 토스 API로 결제 승인 요청 보내기 (보안 필수)
    - 승인 성공 시 Supabase `orders` 테이블 상태를 'DONE'으로 업데이트
- [ ] **[Cursor]** **(NEW)** 결제 성공(`app/payment/success`) 및 실패(`fail`) 페이지 로직
    - 성공 페이지 로드 시 위에서 만든 API Route 호출하여 최종 승인 처리
    - 처리 완료 후 장바구니(`cart`) 비우기 로직 실행