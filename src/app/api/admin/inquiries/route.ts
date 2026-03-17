import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/db';

// 인증 확인
function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return !!token;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

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

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID와 상태값이 필요합니다.' },
        { status: 400 }
      );
    }

    const validStatuses = ['대기중', '연락완료', '상담완료'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다.' },
        { status: 400 }
      );
    }

    const success = updateInquiryStatus(id, status);
    if (!success) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('상태 업데이트 오류:', error);
    return NextResponse.json(
      { error: '상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const success = deleteInquiry(id);
    if (!success) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('삭제 오류:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
