'use client';

import { useState, useEffect, useCallback } from 'react';

const navItems = [
  { id: 'home', name: '홈' },
  { id: 'products', name: '제품소개' },
  { id: 'adult', name: '성인용' },
  { id: 'child', name: '어린이용' },
  { id: 'baby', name: '영유아용' },
  { id: 'pet', name: '반려동물용' },
  { id: 'refill', name: '리필용' },
  { id: 'contact', name: '구매문의' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
    const scrollPosition = window.scrollY + 120;
    for (let i = navItems.length - 1; i >= 0; i--) {
      const section = document.getElementById(navItems[i].id);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(navItems[i].id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navHeight = window.innerWidth >= 768 ? 72 : 64;
      window.scrollTo({ top: section.offsetTop - navHeight, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav className="container-base">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* 로고 */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="text-[18px] md:text-[20px] font-extrabold text-blue-600 tracking-tight">
                디스콜
              </span>
              <span className="text-[18px] md:text-[20px] font-extrabold text-gray-900 tracking-tight">
                공식판매몰
              </span>
            </button>

            {/* 데스크톱 메뉴 */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link px-2.5 py-2 rounded-lg transition-colors text-[13px] xl:text-[15px] whitespace-nowrap ${
                    activeSection === item.id
                      ? 'text-blue-600 bg-blue-50/60 active'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* 모바일 햄버거 */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span className={`block w-full h-[2px] bg-gray-700 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-full h-[2px] bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block w-full h-[2px] bg-gray-700 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* 모바일 오버레이 */}
      <div
        className={`mobile-overlay fixed inset-0 bg-black/40 z-40 lg:hidden ${isMenuOpen ? 'active' : 'inactive'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* 모바일 사이드 메뉴 */}
      <div className={`mobile-menu fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <span className="text-[16px] font-bold text-gray-900">메뉴</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors mb-1 ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
