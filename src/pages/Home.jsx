import { motion } from 'framer-motion';
import Nav from '@/components/portfolio/Nav';
import HeroCanvas from '@/components/portfolio/HeroCanvas';
import CuratorSplit from '@/components/portfolio/CuratorSplit';
import VoidCanvas from '@/components/portfolio/VoidCanvas';
import Collage from '@/components/portfolio/Collage';
import Archive from '@/components/portfolio/Archive';
import StudioInvitation from '@/components/portfolio/StudioInvitation';

const headlineLetters = 'PAINTING'.split('');
const subLetters = 'WITH CODE'.split('');

export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen w-full bg-[#F9F6F0] text-[#1A1A1A] font-body overflow-x-clip selection:bg-[#4D4DFF] selection:text-white antialiased"
    >
      {/* Background structural lines */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 lg:px-24">
        <div className="w-px h-full bg-[#1A1A1A]/5" />
        <div className="w-px h-full bg-[#1A1A1A]/5 hidden md:block" />
        <div className="w-px h-full bg-[#1A1A1A]/5 hidden md:block" />
        <div className="w-px h-full bg-[#1A1A1A]/5" />
      </div>

      <Nav />

      <main className="relative z-10 w-full">
        {/* ===== CHAPTER 1: THE MONOLITH HERO ===== */}
        <section className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 lg:px-24">
          {/* Interactive Three.js background */}
          <div className="absolute inset-0 z-0 opacity-70 mix-blend-multiply">
            <HeroCanvas />
          </div>

          {/* Top row */}
          <div className="relative z-10 w-full flex justify-between items-start">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/60">
              [ Portfolio Vol. III ]
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/60 text-right max-w-[200px] hidden sm:block">
              Hong Kong / Zürich / Digital Space
            </span>
          </div>

          {/* Monumental headline */}
          <div className="relative z-10 my-auto py-12">
            <h1 className="text-[14vw] md:text-[9vw] font-display font-light leading-[0.85] tracking-tighter text-[#1A1A1A]">
              <span className="block">
                {headlineLetters.map((char, i) => (
                  <motion.span
                    key={`h-${i}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="block italic pl-[8vw] md:pl-[12vw] text-[#4D4DFF]">
                {subLetters.map((char, i) => (
                  <motion.span
                    key={`s-${i}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
            </h1>
          </div>

          {/* Bottom row */}
          <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-[#1A1A1A]/10 pt-8">
            <div className="md:col-span-4">
              <p className="text-sm md:text-base text-[#1A1A1A]/80 max-w-[32ch] font-light leading-relaxed">
                The digital canvas is not a replacement for raw linen—it is its extension. An
                exploration of tactile paint, interactive algorithms, and real-time generative
                space.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-6 flex items-center gap-4">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-16 h-16 flex items-center justify-center"
              >
                <svg className="absolute w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-mono uppercase tracking-[0.1em] fill-[#1A1A1A]/60">
                    <textPath href="#circlePath">
                      scroll to explore · physical &amp; digital ·
                    </textPath>
                  </text>
                </svg>
                <div className="w-1.5 h-1.5 bg-[#4D4DFF] rounded-full" />
              </motion.div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/60">
                Interactive Portfolio
              </span>
            </div>
            <div className="md:col-span-3 md:col-start-10 text-right">
              <span className="text-xs font-mono text-[#1A1A1A]/40">[ 01 / 06 ]</span>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 2: THE CURATOR'S SPLIT ===== */}
        <CuratorSplit />

        {/* ===== CHAPTER 3: INTERACTIVE VOID ===== */}
        <section data-void-section className="relative w-full h-[200vh]">
          <div className="sticky top-0 h-screen w-full overflow-clip bg-[#1A1A1A] text-white flex flex-col justify-between p-6 md:p-12 lg:p-24">
            {/* Three.js canvas */}
            <div className="absolute inset-0 z-0">
              <VoidCanvas />
            </div>

            {/* Foreground overlay */}
            <div className="relative z-10 w-full flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-[#4D4DFF] rounded-full animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/80">
                  Interactive Experiment
                </span>
              </div>
              <span className="text-xs font-mono text-white/40">[ 03 / 06 ]</span>
            </div>

            <div className="relative z-10 my-auto max-w-2xl">
              <span className="text-xs font-mono text-[#4D4DFF] uppercase tracking-widest block mb-4">
                // HOBBIES &amp; EXPERIMENTS
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-light leading-tight tracking-tight mb-6">
                Sculpting with <span className="italic text-white">Mathematical Noise</span>
              </h2>
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md">
                Scroll to manipulate the 3D viewport. This procedural sculpture is generated using
                custom vertex shaders, transforming standard geometry into organic, wind-blown
                topologies.
              </p>
            </div>

            <div className="relative z-10 w-full flex justify-between items-baseline border-t border-white/10 pt-8">
              <span className="text-xs font-mono text-white/40">
                Render Engine: Three.js + WebGL + GLSL
              </span>
              <span className="text-xs font-mono text-white/40 hidden md:block">
                Drag mouse to interact with lights
              </span>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 4: COLLAGE OF COLLISIONS ===== */}
        <Collage />

        {/* ===== CHAPTER 5: DIGITAL ARCHIVE ===== */}
        <Archive />

        {/* ===== CHAPTER 6: STUDIO INVITATION ===== */}
        <StudioInvitation />
      </main>
    </div>
  );
}