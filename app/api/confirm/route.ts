import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentKey, amount } = await request.json();

    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 서버 사이드에서 토스 페이먼츠 API로 결제 승인 요청
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Toss Payments secret key is not configured' },
        { status: 500 }
      );
    }

    // Base64 인코딩된 시크릿 키로 인증
    const encodedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스 페이먼츠 결제 승인 API 호출
    const confirmResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!confirmResponse.ok) {
      const errorData = await confirmResponse.json();
      console.error('Toss Payments confirmation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Payment confirmation failed' },
        { status: confirmResponse.status }
      );
    }

    const paymentData = await confirmResponse.json();

    // Supabase에서 주문 정보 업데이트
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'DONE',
        payment_key: paymentKey,
      })
      .eq('order_no', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentData,
    });
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

