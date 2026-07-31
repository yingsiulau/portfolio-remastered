import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ARCHIVE_ROWS = [
  {
    num: '01 / 05',
    title: 'Zürich Automesse',
    category: 'Fine Art / Photography',
    year: '2025',
    img: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2025/04/whatsapp-image-2025-04-10-at-13.47.15-2.jpeg?w=1024',
    alt: 'Zürich Automesse — automotive fine art photography',
    link: 'https://yingsiulauart.wordpress.com/2025/04/10/zurich-automesse/',
  },
  {
    num: '02 / 05',
    title: 'ASCII SET',
    category: 'Creative Code / Generative',
    year: '2025',
    img: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2025/02/ascii-2.png?w=1000',
    alt: 'ASCII generative art set — characters as pixels',
    link: 'https://yingsiulauart.wordpress.com/2025/02/04/ascii-set/',
  },
  {
    num: '03 / 05',
    title: 'Asia Trip 2025',
    category: 'Photography / Travel',
    year: '2025',
    img: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2025/04/whatsapp-image-2025-04-10-at-12.37.53.jpeg?w=1024',
    alt: 'Asia Trip 2025 — travel photography series',
    link: 'https://yingsiulauart.wordpress.com/2025/04/10/asia-trip-2025/',
  },
  {
    num: '04 / 05',
    title: 'Photoshoot 2023',
    category: 'Photography / Direction',
    year: '2023',
    img: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/ao5i7626-1.png?w=1024',
    alt: 'Photoshoot 2023 — directed photography series',
    link: 'https://yingsiulauart.wordpress.com/2024/12/12/photoshoot-2023/',
  },
  {
    num: '05 / 05',
    title: 'Dreamysorrow',
    category: 'Hybrid / Design',
    year: '2024',
    img: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/dreamysorrow-fanclub-2.png?w=1024',
    alt: 'Dreamysorrow — hybrid design and illustration',
    link: 'https://yingsiulauart.wordpress.com/2024/12/10/dreamysorrow/',
  },
];

export default function Archive() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, activeImg: null });
  const sectionRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  };

  return (
    <section
      id="archive"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-24 overflow-visible"
    >
      <div className="w-full flex justify-between items-baseline border-b border-[#1A1A1A]/10 pb-8 mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60 block mb-2">
            [ COMPLETE INDEX ]
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-light">Selected Archives</h2>
        </div>
        <span className="text-xs font-mono text-[#1A1A1A]/40">2023 — Present</span>
      </div>

      <div className="w-full flex flex-col">
        {ARCHIVE_ROWS.map((row, i) => (
          <motion.a
            key={i}
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            onMouseEnter={() => setCursor((p) => ({ ...p, visible: true, activeImg: row.img }))}
            onMouseLeave={() => setCursor((p) => ({ ...p, visible: false, activeImg: null }))}
            className="group relative w-full py-8 border-b border-[#1A1A1A]/10 flex flex-col md:flex-row justify-between items-baseline gap-4 hover:px-4 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-xs font-mono text-[#1A1A1A]/40">{row.num}</span>
              <h3 className="text-2xl md:text-3xl font-display italic text-[#1A1A1A] group-hover:text-[#4D4DFF] transition-colors duration-300">
                {row.title}
              </h3>
            </div>
            <div className="flex items-center gap-8 md:gap-12 text-xs font-mono text-[#1A1A1A]/60">
              <span>{row.category}</span>
              <span>{row.year}</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Cursor-following image preview */}
      {cursor.activeImg && (
        <div
          className="pointer-events-none absolute z-50 w-64 aspect-[4/3] overflow-clip shadow-2xl transition-opacity duration-300 hidden md:block"
          style={{
            left: cursor.x + 30,
            top: cursor.y - 80,
            opacity: cursor.visible ? 1 : 0,
          }}
        >
          <img src={cursor.activeImg} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </section>
  );
}