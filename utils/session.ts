/**
 * 세션 관리 유틸리티
 * 브라우저 세션 스토리지를 사용하여 세션 ID를 관리합니다.
 * 세션이 종료되면 (탭이 닫히면) 자동으로 삭제됩니다.
 */

const SESSION_ID_KEY = 'cart_session_id';
const SESSION_EXPIRES_KEY = 'cart_session_expires';
const SESSION_DURATION_HOURS = 24; // 세션 만료 시간 (24시간)

/**
 * 세션 ID를 가져오거나 생성합니다.
 * @returns 세션 ID
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 임시 ID 반환
    return 'temp-' + Date.now();
  }

  const existingSessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const expiresAt = sessionStorage.getItem(SESSION_EXPIRES_KEY);

  // 세션이 있고 아직 만료되지 않았으면 기존 세션 ID 반환
  if (existingSessionId && expiresAt) {
    const expires = new Date(expiresAt);
    if (expires > new Date()) {
      return existingSessionId;
    }
  }

  // 새 세션 ID 생성
  const newSessionId = crypto.randomUUID();
  const expires = new Date();
  expires.setHours(expires.getHours() + SESSION_DURATION_HOURS);

  sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
  sessionStorage.setItem(SESSION_EXPIRES_KEY, expires.toISOString());

  return newSessionId;
}

/**
 * 현재 세션 ID를 가져옵니다.
 * @returns 세션 ID 또는 null
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const expiresAt = sessionStorage.getItem(SESSION_EXPIRES_KEY);

  if (!sessionId || !expiresAt) {
    return null;
  }

  // 만료 확인
  const expires = new Date(expiresAt);
  if (expires <= new Date()) {
    // 만료된 세션 삭제
    clearSession();
    return null;
  }

  return sessionId;
}

/**
 * 세션 만료 시간을 가져옵니다.
 * @returns 만료 시간 또는 null
 */
export function getSessionExpiresAt(): Date | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const expiresAt = sessionStorage.getItem(SESSION_EXPIRES_KEY);
  if (!expiresAt) {
    return null;
  }

  return new Date(expiresAt);
}

/**
 * 세션을 초기화합니다.
 */
export function clearSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(SESSION_ID_KEY);
  sessionStorage.removeItem(SESSION_EXPIRES_KEY);
}

/**
 * 세션 종료 시 장바구니 데이터를 삭제합니다.
 * beforeunload 이벤트에서 호출됩니다.
 */
export async function cleanupSessionCart(supabase: any): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) {
    return;
  }

  try {
    // 현재 세션의 장바구니 데이터 삭제
    await supabase
      .from('cart_sneaker')
      .delete()
      .eq('session_id', sessionId);
  } catch (error) {
    console.error('Error cleaning up session cart:', error);
  }
}

