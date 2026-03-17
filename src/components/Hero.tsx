'use client';

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = window.innerWidth >= 768 ? 72 : 64;
      window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center"
      style={{
        minHeight: '100dvh',
        paddingTop: 'var(--nav-h)',
        backgroundImage: 'url(/pexels-kampus-7414402.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 블러 + 어두운 오버레이 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.5) 100%)',
        zIndex: 1,
      }} />

      <div className="container-base" style={{ paddingTop: '48px', paddingBottom: '48px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
          {/* 뱃지 */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '9999px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span style={{ width: '8px', height: '8px', background: '#60a5fa', borderRadius: '50%' }} className="animate-pulse" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              공식 판매몰 OPEN
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em', color: '#fff', marginBottom: '20px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            풍부한 거품으로
            <br />
            <span style={{ color: '#93c5fd' }}>구석구석 깨끗하게</span>
          </h1>

          {/* 서브 타이틀 */}
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: '36px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            온 가족이 함께 사용할 수 있는 디스콜 거품치약
            <br />
            성인용, 어린이용, 영유아용까지 다양한 라인업
          </p>

          {/* CTA 버튼 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => scrollTo('contact')}
              className="cta-btn"
              style={{ width: '100%', maxWidth: '280px', padding: '14px 28px', background: '#2563eb', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              지금 구매문의하기
            </button>
            <button
              onClick={() => scrollTo('products')}
              style={{ width: '100%', maxWidth: '280px', padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', fontWeight: 600, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(4px)' }}
            >
              제품 둘러보기
            </button>
          </div>

          {/* 특징 아이콘 */}
          <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="md:!grid-cols-4 md:!gap-16">
            {[
              { label: '안전한 성분', bg: 'rgba(219,234,254,0.2)', color: '#93c5fd', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { label: '풍부한 거품', bg: 'rgba(207,250,254,0.2)', color: '#67e8f9', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
              { label: '온 가족용', bg: 'rgba(237,233,254,0.2)', color: '#c4b5fd', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
              { label: '프리미엄 품질', bg: 'rgba(220,252,231,0.2)', color: '#86efac', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> },
            ].map((feat) => (
              <div key={feat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ width: '48px', height: '48px', background: feat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <svg style={{ width: '24px', height: '24px', color: feat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{feat.icon}</svg>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
                  {feat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
