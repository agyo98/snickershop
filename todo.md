# 👟 운동화 쇼핑몰 개발 Todo List

## Phase 1: 환경 설정 및 백엔드 준비 (Setup & Backend)

- [ ] **[Supabase]** 새 프로젝트 생성하기 (Organization 및 Region 설정)
- [ ] **[Supabase]** Database Table 설계 및 생성 (SQL Editor 사용)
    - `products` 테이블: id, name, brand, price, image_url, category, description
    - `cart` 테이블: id, user_id, product_id, quantity
- [ ] **[Supabase]** Storage 버킷 생성하기 (`product-images`) 및 샘플 운동화 이미지 업로드
- [ ] **[Supabase]** `products` 테이블에 샘플 데이터(Mock Data) 5~10개 추가 (이미지 URL 연결)
- [ ] **[Cursor]** Next.js 프로젝트 생성하기 (`npx create-next-app@latest`)
    - 설정: TypeScript, Tailwind CSS, App Router 사용
- [ ] **[Cursor]** 환경 변수 설정하기 (`.env.local`)
    - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` 입력
- [ ] **[Cursor]** Supabase 클라이언트 유틸리티 코드 작성 (`utils/supabase/client.ts`, `server.ts`)

## Phase 2: UI 디자인 및 코드 확보 (Design with Lovable)

- [ ] **[Lovable]** 메인 페이지 디자인 생성
    - 프롬프트: "나이키 스타일의 운동화 쇼핑몰 메인. 상단 헤더, 히어로 배너, 그리드 형태의 베스트 셀러 상품 목록 포함."
- [ ] **[Lovable]** 상품 상세 페이지 디자인 생성
    - 프롬프트: "왼쪽에는 큰 상품 이미지, 오른쪽에는 상품명, 가격, 사이즈 선택 옵션, 장바구니 담기 버튼이 있는 상세 페이지."
- [ ] **[Lovable]** UI 컴포넌트 코드 Export (React + Tailwind)
    - 메인 레이아웃, 네비게이션 바, 상품 카드(Product Card), 상세 정보 섹션 등

## Phase 3: 프론트엔드 이식 및 데이터 연동 (Integration with Cursor)

- [ ] **[Cursor]** Lovable에서 가져온 코드를 Next.js 컴포넌트 구조로 분리 및 이식 (`components/` 폴더)
- [ ] **[Cursor]** `next/image` 컴포넌트 최적화 적용 (Lovable의 `img` 태그 교체)
- [ ] **[Cursor]** 메인 페이지(`app/page.tsx`)에서 Supabase `products` 데이터 Fetching 로직 구현 (Server Component)
- [ ] **[Cursor]** 상품 카드 컴포넌트에 실제 DB 데이터(props) 연결
- [ ] **[Cursor]** 상품 상세 페이지(`app/product/[id]/page.tsx`) 라우팅 및 데이터 Fetching 구현

## Phase 4: 기능 구현 및 마무리 (Logic & Refinement)

- [ ] **[Cursor]** '장바구니 담기' 버튼 클릭 시 `cart` 테이블에 데이터 저장 로직 구현 (Client Component + Server Action)
- [ ] **[Cursor]** (선택) Supabase Auth를 이용한 간단한 로그인/회원가입 모달 구현
- [ ] **[Cursor]** 전체적인 반응형 디자인(모바일/데스크탑) 확인 및 Tailwind 클래스 수정
- [ ] **[Cursor]** 최종 배포 전 빌드 테스트 (`npm run build`)