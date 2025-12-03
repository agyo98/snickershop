# 🚀 Supabase 데이터베이스 설정 가이드

이 가이드에서는 Supabase에서 데이터베이스 테이블, 트리거, RLS 정책을 설정하는 방법을 설명합니다.

## 📋 사전 준비

1. Supabase 프로젝트가 생성되어 있어야 합니다.
2. Supabase 대시보드에 접속할 수 있어야 합니다.

## 🔧 설정 단계

### Step 1: SQL Editor 열기

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 사이드바에서 **SQL Editor** 클릭
4. **New query** 버튼 클릭

### Step 2: SQL 스크립트 실행

1. 프로젝트 루트의 `supabase-schema.sql` 파일을 열기
2. 파일의 **전체 내용**을 복사 (Ctrl+A → Ctrl+C)
3. Supabase SQL Editor에 붙여넣기 (Ctrl+V)
4. **RUN** 버튼 클릭 (또는 Ctrl+Enter)

### Step 3: 실행 결과 확인

다음과 같은 메시지가 표시되면 성공입니다:
```
Success. No rows returned
```

## ✅ 자동으로 생성되는 것들

실행 후 다음이 자동으로 생성/설정됩니다:

### 1. 테이블 (3개)
- ✅ `products_sneaker` - 상품 정보 테이블
- ✅ `cart_sneaker` - 장바구니 테이블
- ✅ `profiles` - 사용자 프로필 테이블

### 2. 함수 및 트리거
- ✅ `handle_new_user()` 함수 - 신규 유저 생성 시 자동 실행되는 함수
- ✅ `on_auth_user_created` 트리거 - `auth.users`에 새 유저가 생성되면 `profiles` 테이블에 자동으로 행 추가

### 3. RLS 정책 (3개)
- ✅ **읽기 정책**: 모든 사용자가 프로필을 볼 수 있음
- ✅ **수정 정책**: 본인만 자신의 프로필을 수정할 수 있음
- ✅ **삭제 정책**: 본인만 자신의 프로필을 삭제할 수 있음

### 4. 인덱스 (4개)
- ✅ 성능 최적화를 위한 인덱스들이 자동 생성됨

## 🔍 확인 방법

### 테이블 확인
1. SQL Editor에서 다음 쿼리 실행:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products_sneaker', 'cart_sneaker', 'profiles');
```

### 트리거 확인
1. SQL Editor에서 다음 쿼리 실행:
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### RLS 정책 확인
1. Supabase 대시보드 → **Authentication** → **Policies**에서 확인
2. 또는 SQL Editor에서:
```sql
SELECT policyname, tablename
FROM pg_policies
WHERE tablename = 'profiles';
```

## 🧪 테스트 방법

### 트리거 테스트
1. Supabase 대시보드 → **Authentication** → **Users**
2. **Add user** 클릭하여 테스트 유저 생성
3. SQL Editor에서 다음 쿼리로 확인:
```sql
SELECT * FROM profiles WHERE id = '생성된_유저_id';
```
4. 자동으로 프로필이 생성되었는지 확인

### RLS 정책 테스트
1. 로그인 후 다른 유저의 프로필 조회 (읽기 허용 확인)
2. 다른 유저의 프로필 수정 시도 (거부되어야 함)
3. 본인의 프로필 수정 (성공해야 함)

## ❗ 주의사항

- ⚠️ **중요**: SQL 스크립트는 여러 번 실행해도 안전합니다 (`IF NOT EXISTS` 사용)
- ⚠️ 기존 데이터가 있는 경우에도 안전하게 실행됩니다
- ⚠️ 프로덕션 환경에서 실행하기 전에 개발 환경에서 먼저 테스트하는 것을 권장합니다

## 🆘 문제 해결

### 오류가 발생하는 경우

1. **"permission denied" 오류**
   - 프로젝트 소유자인지 확인
   - SQL Editor에서 실행하는지 확인 (Dashboard에서 직접 실행)

2. **"table already exists" 오류**
   - 정상입니다. `IF NOT EXISTS`가 있어도 일부 경고가 표시될 수 있습니다.
   - 무시하고 계속 진행하세요.

3. **"function already exists" 오류**
   - `CREATE OR REPLACE`를 사용하므로 자동으로 교체됩니다.
   - 문제없이 진행됩니다.

## 📝 추가 작업

SQL 스크립트 실행 후 다음 작업을 진행하세요:

1. ✅ Storage 버킷 생성 (`product-images`)
2. ✅ 샘플 상품 데이터 추가
3. ✅ 환경 변수 설정 (`.env.local`)

자세한 내용은 `todo2.md`를 참조하세요.

