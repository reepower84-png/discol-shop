'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  type: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  detail_images?: string;
}

const CheckIcon = ({ color }: { color: string }) => (
  <svg style={{ width: '20px', height: '20px', color, flexShrink: 0, marginRight: '10px' }} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PlaceholderIcon = ({ color }: { color: string }) => (
  <svg style={{ width: '80px', height: '80px', color, margin: '0 auto 12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('상품 로드 실패:', err));
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const navHeight = window.innerWidth >= 768 ? 72 : 64;
      window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' });
    }
  };

  const fmt = (price: number) => new Intl.NumberFormat('ko-KR').format(price);
  const getProduct = (type: string) => products.find((p) => p.type === type);

  const adult = getProduct('adult');
  const child = getProduct('child');
  const baby = getProduct('baby');
  const pet = getProduct('pet');

  const renderImage = (product: Product | undefined, alt: string, placeholderColor: string) => {
    if (product?.image_url) {
      return <img src={product.image_url} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    return (
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <PlaceholderIcon color={placeholderColor} />
        <span style={{ color: placeholderColor, fontSize: '14px', fontWeight: 500 }}>{alt}</span>
      </div>
    );
  };

  const renderDetailImage = (product: Product | undefined, alt: string, placeholderColor: string) => {
    const detailSrc = product?.detail_images ? JSON.parse(product.detail_images)[0] : null;
    const src = detailSrc || product?.image_url;
    if (src) return <img src={src} alt={`${alt} 상세`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <PlaceholderIcon color={placeholderColor} />
        <span style={{ color: placeholderColor, fontSize: '14px', fontWeight: 500 }}>{alt}</span>
      </div>
    );
  };

  const sectionTitle = (badge: string, title: string, desc: string) => (
    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
      <span style={{ display: 'inline-block', padding: '6px 16px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>
        {badge}
      </span>
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, letterSpacing: '-0.025em', marginBottom: '12px' }}>
        {title}
      </h2>
      <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#6b7280', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
        {desc}
      </p>
    </div>
  );

  return (
    <>
      {/* 제품 라인업 */}
      <section id="products" style={{ padding: '64px 0', background: '#fff' }}>
        <div className="container-base">
          {sectionTitle('PRODUCT LINE UP', '디스콜 제품 라인업', '각 연령대에 맞춤화된 포뮬러로 온 가족이 안심하고 사용할 수 있습니다')}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }} className="sm:!grid-cols-2 lg:!grid-cols-4">
            {/* 성인용 카드 */}
            <div className="product-card" style={{ background: 'linear-gradient(135deg, #eff6ff, #fff)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(219,234,254,0.8)' }}>
              <div style={{ aspectRatio: '1', background: '#eff6ff', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {renderImage(adult, '성인용', '#93c5fd')}
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', marginBottom: '10px' }}>거품타입</span>
              <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.4 }}>
                {adult?.name || '디스콜 거품치약 (성인용)'}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {adult?.description || '성인을 위한 프리미엄 거품치약. 풍부한 거품으로 구석구석 깨끗하게 세정합니다.'}
              </p>
              <span style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: '#2563eb' }}>
                {fmt(adult?.price || 15000)}원
              </span>
            </div>

            {/* 어린이용 카드 */}
            <div className="product-card" style={{ background: 'linear-gradient(135deg, #ecfeff, #fff)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(207,250,254,0.8)' }}>
              <div style={{ aspectRatio: '1', background: '#ecfeff', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {renderImage(child, '어린이용', '#67e8f9')}
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#0891b2', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', marginBottom: '10px' }}>거품타입</span>
              <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.4 }}>
                {child?.name || '디스콜 거품치약 (어린이용)'}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {child?.description || '어린이를 위한 순한 거품치약. 자극 없이 부드럽게 세정합니다.'}
              </p>
              <span style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: '#0891b2' }}>
                {fmt(child?.price || 12000)}원
              </span>
            </div>

            {/* 영유아용 카드 */}
            <div className="product-card" style={{ background: 'linear-gradient(135deg, #faf5ff, #fff)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(243,232,255,0.8)' }}>
              <div style={{ aspectRatio: '1', background: '#faf5ff', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {renderImage(baby, '영유아용', '#c084fc')}
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#7c3aed', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', marginBottom: '10px' }}>저자극</span>
              <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.4 }}>
                {baby?.name || '디스콜 치약 (영유아용)'}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {baby?.description || '영유아를 위한 저자극 치약. 삼켜도 안전한 성분으로 제조되었습니다.'}
              </p>
              <span style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: '#7c3aed' }}>
                {fmt(baby?.price || 20000)}원
              </span>
            </div>

            {/* 반려동물용 카드 */}
            <div className="product-card" style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,237,213,0.8)' }}>
              <div style={{ aspectRatio: '1', background: '#fff7ed', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {renderImage(pet, '반려동물용', '#fb923c')}
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: '#ea580c', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '9999px', marginBottom: '10px' }}>반려동물</span>
              <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.4 }}>
                {pet?.name || '디스콜 치약 (반려동물용)'}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {pet?.description || '반려동물을 위한 안전한 치약. 반려동물 구강 건강을 지켜줍니다.'}
              </p>
              <span style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: '#ea580c' }}>
                {fmt(pet?.price || 22000)}원
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              onClick={scrollToContact}
              className="cta-btn"
              style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              구매 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* ===== 성인용 상세 ===== */}
      <section id="adult" style={{ padding: '64px 0', background: 'linear-gradient(135deg, rgba(239,246,255,0.5), #fff)' }}>
        <div className="container-base">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'center' }} className="md:!grid-cols-2 md:!gap-12 lg:!gap-24">
            <div className="order-2 md:!order-1">
              <span style={{ display: 'inline-block', padding: '4px 14px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>ADULT</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '20px' }}>성인용 거품치약</h2>
              <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>
                {adult?.description || '성인을 위한 프리미엄 거품치약입니다. 풍부한 거품이 치아 구석구석을 세정하여 상쾌한 구강 환경을 만들어줍니다. 불소 함유로 충치 예방에도 효과적입니다.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                {['풍부한 거품으로 깊은 세정', '불소 함유로 충치 예방', '상쾌한 민트향'].map((t) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#374151', marginBottom: '10px' }}>
                    <CheckIcon color="#2563eb" />{t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#2563eb' }}>{fmt(adult?.price || 15000)}원</span>
                <button onClick={scrollToContact} className="cta-btn" style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>구매 문의</button>
              </div>
            </div>
            <div className="order-1 md:!order-2" style={{ background: 'rgba(219,234,254,0.4)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {renderDetailImage(adult, '성인용 거품치약', '#93c5fd')}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 어린이용 상세 ===== */}
      <section id="child" style={{ padding: '64px 0', background: '#fff' }}>
        <div className="container-base">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'center' }} className="md:!grid-cols-2 md:!gap-12 lg:!gap-24">
            <div style={{ background: 'rgba(207,250,254,0.4)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {renderDetailImage(child, '어린이용 거품치약', '#67e8f9')}
            </div>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: '#cffafe', color: '#0e7490', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>KIDS</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '20px' }}>어린이용 거품치약</h2>
              <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>
                {child?.description || '어린이를 위해 특별히 개발된 순한 거품치약입니다. 자극 없이 부드럽게 세정하며, 아이들이 좋아하는 달콤한 향으로 양치 습관을 즐겁게 만들어줍니다.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                {['순한 성분으로 저자극', '아이들이 좋아하는 달콤한 향', '풍부한 거품으로 재미있는 양치'].map((t) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#374151', marginBottom: '10px' }}>
                    <CheckIcon color="#0891b2" />{t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#0891b2' }}>{fmt(child?.price || 12000)}원</span>
                <button onClick={scrollToContact} className="cta-btn" style={{ padding: '12px 24px', background: '#0891b2', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>구매 문의</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 영유아용 상세 ===== */}
      <section id="baby" style={{ padding: '64px 0', background: 'linear-gradient(135deg, rgba(250,245,255,0.5), #fff)' }}>
        <div className="container-base">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'center' }} className="md:!grid-cols-2 md:!gap-12 lg:!gap-24">
            <div className="order-2 md:!order-1">
              <span style={{ display: 'inline-block', padding: '4px 14px', background: '#ede9fe', color: '#6d28d9', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>BABY</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '20px' }}>영유아용 치약</h2>
              <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>
                {baby?.description || '영유아를 위한 안전한 치약입니다. 삼켜도 안전한 성분으로 제조되어 아기의 첫 양치를 안심하고 시작할 수 있습니다. 무불소 처방으로 영유아에게 적합합니다.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                {['삼켜도 안전한 성분', '무불소 처방', '부드러운 젤 타입'].map((t) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#374151', marginBottom: '10px' }}>
                    <CheckIcon color="#7c3aed" />{t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#7c3aed' }}>{fmt(baby?.price || 10000)}원</span>
                <button onClick={scrollToContact} className="cta-btn" style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>구매 문의</button>
              </div>
            </div>
            <div className="order-1 md:!order-2" style={{ background: 'rgba(237,233,254,0.4)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {renderDetailImage(baby, '영유아용 치약', '#c084fc')}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 반려동물용 상세 ===== */}
      <section id="pet" style={{ padding: '64px 0', background: '#fff' }}>
        <div className="container-base">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'center' }} className="md:!grid-cols-2 md:!gap-12 lg:!gap-24">
            <div style={{ background: 'rgba(255,237,213,0.4)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {renderDetailImage(pet, '반려동물용 치약', '#fb923c')}
            </div>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: '#ffedd5', color: '#c2410c', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>PET</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '20px' }}>반려동물용 치약</h2>
              <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>
                {pet?.description || '반려동물을 위한 안전한 치약입니다. 반려동물의 구강 건강을 지켜주며, 안전한 성분으로 제조되어 안심하고 사용할 수 있습니다.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                {['반려동물 전용 안전 성분', '구강 건강 관리', '사용이 간편한 타입'].map((t) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#374151', marginBottom: '10px' }}>
                    <CheckIcon color="#ea580c" />{t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#ea580c' }}>{fmt(pet?.price || 22000)}원</span>
                <button onClick={scrollToContact} className="cta-btn" style={{ padding: '12px 24px', background: '#ea580c', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>구매 문의</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
