'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    product_type: '',
    payment_method: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.',
        });
        setFormData({ name: '', phone: '', message: '', product_type: '', payment_method: '' });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || '문의 접수 중 오류가 발생했습니다.',
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    outline: 'none',
    background: '#fff',
  };

  return (
    <section id="contact" style={{ padding: '64px 0', background: '#f9fafb' }}>
      <div className="container-base">
        <div style={{ maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px' }}>
              CONTACT US
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: '12px' }}>
              구매 문의
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#6b7280', lineHeight: 1.7 }}>
              문의를 남겨주시면 빠르게 연락드리겠습니다
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '24px' }}
            className="sm:!p-7 md:!p-8"
          >
            {/* 이름 */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                이름 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-input" style={inputStyle} placeholder="이름을 입력해주세요" />
            </div>

            {/* 전화번호 */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                전화번호 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange} required className="form-input" style={inputStyle} placeholder="010-0000-0000" maxLength={13} />
            </div>

            {/* 제품 선택 */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="product_type" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                관심 제품
              </label>
              <select id="product_type" name="product_type" value={formData.product_type} onChange={handleChange} className="form-input" style={{ ...inputStyle, paddingRight: '40px' }}>
                <option value="">선택해주세요</option>
                <option value="adult">성인용 거품치약</option>
                <option value="child">어린이용 거품치약</option>
                <option value="baby">영유아용 치약</option>
              </select>
            </div>

            {/* 결제 방법 */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="payment_method" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                결제 방법
              </label>
              <select id="payment_method" name="payment_method" value={formData.payment_method} onChange={handleChange} className="form-input" style={{ ...inputStyle, paddingRight: '40px' }}>
                <option value="">선택해주세요</option>
                <option value="계좌이체">계좌이체</option>
                <option value="카드결제">카드결제</option>
                <option value="무통장입금">무통장입금</option>
                <option value="상담 후 결정">상담 후 결정</option>
              </select>
            </div>

            {/* 문의 내용 */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="message" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                문의 내용
              </label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="form-input" style={{ ...inputStyle, resize: 'none' }} placeholder="문의하실 내용을 입력해주세요" />
            </div>

            {/* 개인정보 동의 */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: '#4b5563' }}>개인정보 수집 및 이용 안내</span>
                <br />수집 항목: 이름, 전화번호, 문의 내용
                <br />수집 목적: 구매 상담 및 문의 응대
                <br />보유 기간: 상담 완료 후 1년
              </p>
            </div>

            {/* 결과 메시지 */}
            {submitResult && (
              <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, background: submitResult.success ? '#f0fdf4' : '#fef2f2', color: submitResult.success ? '#15803d' : '#b91c1c' }}>
                {submitResult.message}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cta-btn"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#fff',
                background: isSubmitting ? '#9ca3af' : '#2563eb',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  문의 접수 중...
                </span>
              ) : '문의하기'}
            </button>

            {/* 카카오톡 상담 버튼 */}
            <a
              href="http://pf.kakao.com/_vxdAxcxl/chat"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#3B1E1E',
                background: '#FEE500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '12px',
              }}
            >
              카카오톡으로 상담하기
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
