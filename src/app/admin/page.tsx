'use client';

import { useState, useEffect } from 'react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  product_type?: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  type: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  detail_images?: string;
}

type Tab = 'inquiries' | 'products' | 'detail-images';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('inquiries');

  // 문의 관련 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // 상품 관련 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 이미지 업로드 관련 상태
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedProductForImage, setSelectedProductForImage] = useState<string>('');

  useEffect(() => {
    // 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        credentials: 'include',
      });
      if (response.ok) {
        setIsLoggedIn(true);
        loadInquiries();
        loadProducts();
      }
    } catch {
      // 로그인 필요
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setPassword('');
        loadInquiries();
        loadProducts();
      } else {
        const data = await response.json();
        setLoginError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setLoginError('서버 연결에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', {
      method: 'DELETE',
      credentials: 'include',
    });
    setIsLoggedIn(false);
    setInquiries([]);
    setProducts([]);
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const response = await fetch('/api/admin/inquiries', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('문의 로드 실패:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('상품 로드 실패:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
        setEditingProduct(null);
        alert('상품이 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('상품 업데이트 실패:', error);
      alert('상품 업데이트에 실패했습니다.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'detail') => {
    const file = e.target.files?.[0];
    if (!file || !selectedProductForImage) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const product = products.find((p) => p.id === selectedProductForImage);

        if (product) {
          if (type === 'thumbnail') {
            await updateProduct({ ...product, image_url: data.url });
          } else {
            const currentImages = product.detail_images
              ? JSON.parse(product.detail_images)
              : [];
            currentImages.push(data.url);
            await updateProduct({
              ...product,
              detail_images: JSON.stringify(currentImages),
            });
          }
          loadProducts();
        }
      } else {
        const data = await response.json();
        alert(data.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeDetailImage = async (productId: string, imageIndex: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.detail_images) return;

    const images = JSON.parse(product.detail_images);
    images.splice(imageIndex, 1);

    await updateProduct({
      ...product,
      detail_images: JSON.stringify(images),
    });
    loadProducts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case '대기중':
        return 'bg-yellow-100 text-yellow-800';
      case '연락완료':
        return 'bg-blue-100 text-blue-800';
      case '상담완료':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductTypeName = (type: string) => {
    switch (type) {
      case 'adult':
        return '성인용';
      case 'child':
        return '어린이용';
      case 'baby':
        return '영유아용';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg
            className="spinner w-12 h-12 text-blue-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 페이지
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
            <p className="text-gray-600 mt-2">디스콜 공식판매몰 관리자 페이지</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-600 hover:underline">
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">디스콜</span>
              <span className="text-xl font-bold text-gray-800 ml-1">관리자</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-gray-600 hover:text-blue-600">
                홈으로
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow mb-4 sm:mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              문의 관리
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              금액 설정
            </button>
            <button
              onClick={() => setActiveTab('detail-images')}
              className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'detail-images'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              상세페이지
            </button>
          </div>
        </div>

        {/* 문의 관리 탭 */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                문의 목록 ({inquiries.length}건)
              </h2>
              <button
                onClick={loadInquiries}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                새로고침
              </button>
            </div>

            {inquiriesLoading ? (
              <div className="p-8 text-center">
                <svg
                  className="spinner w-8 h-8 text-blue-600 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                등록된 문의가 없습니다.
              </div>
            ) : (
              <>
                {/* 모바일 카드 뷰 */}
                <div className="block lg:hidden divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{inquiry.name}</span>
                          <p className="text-sm text-gray-500 mt-0.5">{inquiry.phone}</p>
                        </div>
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            updateInquiryStatus(inquiry.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            inquiry.status
                          )}`}
                        >
                          <option value="대기중">대기중</option>
                          <option value="연락완료">연락완료</option>
                          <option value="상담완료">상담완료</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {inquiry.product_type ? getProductTypeName(inquiry.product_type) : '제품 미선택'}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {inquiry.payment_method || '결제방법 미선택'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{formatDate(inquiry.created_at)}</span>
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크톱 테이블 뷰 */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          접수일시
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          전화번호
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제품
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          결제방법
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(inquiry.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {inquiry.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.product_type
                              ? getProductTypeName(inquiry.product_type)
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.payment_method || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={inquiry.status}
                              onChange={(e) =>
                                updateInquiryStatus(inquiry.id, e.target.value)
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                inquiry.status
                              )}`}
                            >
                              <option value="대기중">대기중</option>
                              <option value="연락완료">연락완료</option>
                              <option value="상담완료">상담완료</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* 금액 설정 탭 */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">상품 금액 설정</h2>
            </div>

            {productsLoading ? (
              <div className="p-8 text-center">
                <svg
                  className="spinner w-8 h-8 text-blue-600 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 sm:p-4 border border-gray-200 rounded-xl"
                  >
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            상품명
                          </label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            가격 (원)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            설명
                          </label>
                          <textarea
                            value={editingProduct.description || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg resize-none text-sm sm:text-base"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateProduct(editingProduct)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                              product.type === 'adult'
                                ? 'bg-blue-100 text-blue-700'
                                : product.type === 'child'
                                ? 'bg-cyan-100 text-cyan-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {getProductTypeName(product.type)}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {product.name}
                          </h3>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                            {formatPrice(product.price)}원
                          </p>
                          {product.description && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 상세페이지 관리 탭 */}
        {activeTab === 'detail-images' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                상세페이지 이미지 관리
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {/* 상품 선택 */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품 선택
                </label>
                <select
                  value={selectedProductForImage}
                  onChange={(e) => setSelectedProductForImage(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base"
                >
                  <option value="">상품을 선택하세요</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {getProductTypeName(product.type)} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductForImage && (
                <div className="space-y-4 sm:space-y-6">
                  {/* 대표 이미지 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      대표 이미지 (썸네일)
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {products.find((p) => p.id === selectedProductForImage)
                          ?.image_url ? (
                          <img
                            src={
                              products.find(
                                (p) => p.id === selectedProductForImage
                              )?.image_url
                            }
                            alt="대표 이미지"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">없음</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'thumbnail')}
                          className="hidden"
                          id="thumbnail-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                            uploadingImage
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {uploadingImage ? '업로드 중...' : '이미지 업로드'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          권장: 정사각형 이미지 (500x500px)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 상세 이미지 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      상세페이지 이미지
                    </h3>
                    <div className="space-y-4">
                      {/* 기존 이미지 목록 */}
                      {(() => {
                        const product = products.find(
                          (p) => p.id === selectedProductForImage
                        );
                        const detailImages = product?.detail_images
                          ? JSON.parse(product.detail_images)
                          : [];

                        return detailImages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {detailImages.map(
                              (imageUrl: string, index: number) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={imageUrl}
                                    alt={`상세 이미지 ${index + 1}`}
                                    className="w-full aspect-square object-cover rounded-xl"
                                  />
                                  <button
                                    onClick={() =>
                                      removeDetailImage(
                                        selectedProductForImage,
                                        index
                                      )
                                    }
                                    className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm sm:text-base"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            등록된 상세 이미지가 없습니다.
                          </p>
                        );
                      })()}

                      {/* 이미지 추가 */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'detail')}
                          className="hidden"
                          id="detail-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="detail-upload"
                          className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                            uploadingImage
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {uploadingImage ? '업로드 중...' : '+ 이미지 추가'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          최대 5MB, JPEG/PNG/GIF/WEBP 지원
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
