'use client';

export default function KakaoFloat() {
  return (
    <a
      href="http://pf.kakao.com/_vxdAxcxl/chat"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        right: '16px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        zIndex: 9999,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      }}
    >
      <img
        src="/카톡_원형_로고.png"
        alt="카카오톡 상담"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </a>
  );
}
