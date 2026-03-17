'use client';

const refillItems = [
  {
    image: '/디스콜 1.0 1.jpg',
    name: '디스콜 성인용 거품치약 1.0L 리필 (전용빈용기 4개 제공)',
    price: '159,000원',
  },
  {
    image: '/디스콜C 1.0 1.jpg',
    name: '디스콜 어린이용 거품치약 1.0L 리필 (전용빈용기 4개 제공)',
    price: '159,000원',
  },
  {
    image: '/K300 1.jpg',
    name: '디스콜 성인용 거품치약 300g 리필 (전용빈용기 1개 제공)',
    price: '49,000원',
  },
  {
    image: '/C300 1.jpg',
    name: '디스콜 어린이용 거품치약 300g 리필 (전용빈용기 1개 제공)',
    price: '49,000원',
  },
];

export default function Refill() {
  return (
    <section id="refill" style={{ padding: '64px 0', background: 'linear-gradient(135deg, rgba(240,253,244,0.5), #fff)' }}>
      <div className="container-base">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>
            REFILL
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, letterSpacing: '-0.025em', marginBottom: '12px' }}>
            리필용 제품
          </h2>
          <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#6b7280', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            경제적이고 친환경적인 리필 제품으로 스마트하게 사용하세요
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }} className="sm:!grid-cols-2 lg:!grid-cols-4">
          {refillItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(220,252,231,0.8)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ aspectRatio: '1', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: 1.5, marginBottom: '8px', minHeight: '42px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                  {item.name}
                </p>
                <span style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700, color: '#16a34a' }}>
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
