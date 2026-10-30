import React from 'react';

export const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={`app-footer w-full px-3 sm:px-4 py-1.5 sm:py-2 border-t border-slate-800/80 bg-space-950/90 text-center text-[10px] sm:text-xs text-slate-400 shrink-0 select-none z-10 ${className}`} role="contentinfo">
      <p className="copyright-notice leading-relaxed max-w-4xl mx-auto break-keep">
        「80억 분의 1」(
        <a
          href="https://1in8b.life"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition"
        >
          1in8b.life
        </a>
        , 만든 이 진휘어스)의 아이디어와 구조를 바탕으로 만든 비영리 교육용 프로그램입니다. 원작자의 허락을 받아 재구성하였습니다.(재구성 창순기획)
      </p>
    </footer>
  );
};

export default Footer;
