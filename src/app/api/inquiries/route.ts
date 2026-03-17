import { NextRequest, NextResponse } from 'next/server';
import { createInquiry, getAllInquiries } from '@/lib/db';

// Discord로 알림 보내기
async function sendDiscordNotification(inquiry: {
  name: string;
  phone: string;
  message: string;
  product_type?: string;
  payment_method?: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Discord webhook URL이 설정되지 않았습니다.');
    return;
  }

  const productTypeMap: { [key: string]: string } = {
    'adult': '성인용 거품치약',
    'child': '어린이용 거품치약',
    'baby': '영유아용 치약',
  };

  const embed = {
    title: '🛒 새로운 구매 문의가 접수되었습니다!',
    color: 0x5865F2,
    fields: [
      {
        name: '👤 이름',
        value: inquiry.name,
        inline: true,
      },
      {
        name: '📞 전화번호',
        value: inquiry.phone,
        inline: true,
      },
      {
        name: '🦷 문의 제품',
        value: inquiry.product_type ? productTypeMap[inquiry.product_type] || inquiry.product_type : '미선택',
        inline: true,
      },
      {
        name: '💳 결제 방법',
        value: inquiry.payment_method || '미선택',
        inline: true,
      },
      {
        name: '💬 문의 내용',
        value: inquiry.message || '없음',
        inline: false,
      },
    ],
    footer: {
      text: '디스콜 공식판매몰',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error('Discord 알림 전송 실패:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message, product_type, payment_method } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 전화번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const inquiry = createInquiry({
      name,
      phone,
      message: message || '',
      product_type,
      payment_method,
    });

    // Discord로 알림 전송
    await sendDiscordNotification({
      name,
      phone,
      message: message || '',
      product_type,
      payment_method,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('문의 생성 오류:', error);
    return NextResponse.json(
      { error: '문의 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('문의 조회 오류:', error);
    return NextResponse.json(
      { error: '문의 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
