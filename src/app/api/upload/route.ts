import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// 인증 확인
function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return !!token;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF, WEBP)' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 업로드 폴더 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
