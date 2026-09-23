import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        <Link to="/#top" className="font-display text-xl md:text-2xl tracking-tight font-light italic leading-none">
          Yingsiu Lau
        </Link>
        <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/60 mt-1">
          Fine Art × Creative Code
        </span>
      </div>
      <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-mono">
        <Link to="/#curator" className="hover:text-[#4D4DFF] transition-colors duration-300">01. Canvas</Link>
        <Link to="/#void" className="hover:text-[#4D4DFF] transition-colors duration-300">02. Silicon</Link>
        <Link to="/#archive" className="hover:text-[#4D4DFF] transition-colors duration-300">03. Archive</Link>
        <Link to="/#studio" className="hover:text-[#4D4DFF] transition-colors duration-300">04. Studio</Link>
        <Link to="/3d" className="hover:text-[#4D4DFF] transition-colors duration-300">05. 3D</Link>
      </nav>
      <div>
        <Link
          to="/#studio"
          className="text-[11px] uppercase tracking-[0.2em] font-mono border-b border-white pb-1 hover:text-[#4D4DFF] hover:border-[#4D4DFF] transition-all duration-300"
        >
          Inquire
        </Link>
      </div>
    </header>
  );
}