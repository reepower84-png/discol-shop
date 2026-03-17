'use client';

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#9ca3af' }}>
      <div className="container-base" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="sm:!grid-cols-2">
          {/* 브랜드 */}
          <div style={{ textAlign: 'center' }} className="sm:!text-left">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '12px' }} className="sm:!justify-start">
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.02em' }}>디스콜</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>공식판매몰</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6b7280' }}>
              온 가족이 안심하고 사용할 수 있는
              <br />
              프리미엄 거품치약 브랜드
            </p>
          </div>

          {/* 회사 정보 */}
          <div style={{ textAlign: 'center' }} className="sm:!text-left">
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>회사 정보</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#6b7280', lineHeight: 2 }}>
              <li><span style={{ color: '#4b5563' }}>상호:</span> 제이코리아</li>
              <li><span style={{ color: '#4b5563' }}>대표:</span> 이주영</li>
              <li><span style={{ color: '#4b5563' }}>사업자등록번호:</span> 278-30-01540</li>
              <li><span style={{ color: '#4b5563' }}>주소:</span> 인천광역시 계양구 오조산로57번길 15, 7층 7106호</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', marginTop: '32px', paddingTop: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }} className="sm:!flex-row sm:!justify-between">
            <p style={{ fontSize: '12px', color: '#4b5563' }}>
              &copy; 2024 디스콜쇼핑몰. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
