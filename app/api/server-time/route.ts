import { NextResponse } from 'next/server';

// 서버 시작 시간을 저장 (서버 재시작 시마다 갱신됨)
// 이 값은 서버가 시작될 때 한 번만 설정되므로, 서버 재시작을 감지할 수 있습니다.
const SERVER_START_TIME = Date.now().toString();

export async function GET() {
  try {
    console.log('[server-time] API called, returning:', SERVER_START_TIME);
    return NextResponse.json({
      serverStartTime: SERVER_START_TIME,
    });
  } catch (error) {
    console.error('[server-time] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

