import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, updateProduct, getProduct } from '@/lib/db';

// 인증 확인
function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return !!token;
}

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('상품 조회 오류:', error);
    return NextResponse.json(
      { error: '상품 조회 중 오류가 발생했습니다.' },
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
    const { id, name, price, description, image_url, detail_images } = body;

    if (!id) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const existingProduct = getProduct(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const success = updateProduct(id, {
      name,
      price,
      description,
      image_url,
      detail_images,
    });

    if (!success) {
      return NextResponse.json(
        { error: '상품 업데이트 실패' },
        { status: 500 }
      );
    }

    const updatedProduct = getProduct(id);
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('상품 업데이트 오류:', error);
    return NextResponse.json(
      { error: '상품 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
