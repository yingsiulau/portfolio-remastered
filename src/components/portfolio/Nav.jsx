import { useEffect, useState } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5 flex justify-between items-baseline transition-all duration-500 mix-blend-difference text-white"
    >
      <div className="flex flex-col">
        <a href="#top" className="font-display text-xl md:text-2xl tracking-tight font-light italic leading-none">
          Ying Siu Lau
        </a>
        <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/60 mt-1">
          Fine Art × Creative Code
        </span>
      </div>
      <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-mono">
        <a href="#curator" className="hover:text-[#4D4DFF] transition-colors duration-300">01. Canvas</a>
        <a href="#void" className="hover:text-[#4D4DFF] transition-colors duration-300">02. Silicon</a>
        <a href="#archive" className="hover:text-[#4D4DFF] transition-colors duration-300">03. Archive</a>
        <a href="#studio" className="hover:text-[#4D4DFF] transition-colors duration-300">04. Studio</a>
      </nav>
      <div>
        <a
          href="#studio"
          className="text-[11px] uppercase tracking-[0.2em] font-mono border-b border-white pb-1 hover:text-[#4D4DFF] hover:border-[#4D4DFF] transition-all duration-300"
        >
          Inquire
        </a>
      </div>
    </header>
  );
}