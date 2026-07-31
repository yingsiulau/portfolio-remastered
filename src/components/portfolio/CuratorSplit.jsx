import { motion } from 'framer-motion';

const MEDIA_BLOCKS = [
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/baby.jpeg?w=834',
    alt: 'Macro crop of textured painting, warm earthy tones and expressive brushwork',
    badge: 'Canvas Series',
    title: 'Impasto Study No. 12',
    meta: 'Acrylic & Gesso on Canvas, 120×150cm',
    aspect: 'aspect-[4/5]',
    bg: 'bg-[#EAE3D2]',
    badgeBg: 'bg-[#F9F6F0]',
    offset: '',
    grayscale: 'grayscale contrast-125',
  },
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2025/02/ascii-2.png?w=1000',
    alt: 'Generative ASCII art interpretation — code as canvas, characters forming visual texture',
    badge: 'Creative Code / ASCII',
    title: 'Vector Displacement No. 12',
    meta: 'Real-time Generative / Interactive',
    aspect: 'aspect-[4/5]',
    bg: 'bg-[#1A1A1A]',
    badgeBg: 'bg-[#4D4DFF] text-white',
    offset: 'lg:pl-16',
    grayscale: '',
  },
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/dreamysorrow-fanclub-2.png?w=1024',
    alt: 'Hybrid collage blending physical paint textures with digital vector overlays',
    badge: 'Hybrid Collage',
    title: 'Mixed Medium Assemblage',
    meta: 'Screenprint & Vector Plotter on Canvas',
    aspect: 'aspect-[16/10]',
    bg: 'bg-[#EAE3D2]',
    badgeBg: 'bg-[#1A1A1A] text-white',
    offset: 'pr-0 md:pr-12',
    grayscale: 'grayscale contrast-110',
  },
];

export default function CuratorSplit() {
  return (
    <section
      id="curator"
      className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-24 border-t border-[#1A1A1A]/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left editorial column — sticky on desktop */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-[calc(100vh-16rem)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4D4DFF] block mb-6">
              // THE CREATIVE PARADOX
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light leading-tight tracking-tight mb-8">
              Where physical textures bleed into{' '}
              <span className="italic font-normal">virtual vectors</span>.
            </h2>
            <p className="text-base md:text-lg text-[#1A1A1A]/70 font-light leading-relaxed mb-6 max-w-[40ch]">
              Every brushstroke carries weight, friction, and decay. Every line of code carries
              logic, infinity, and precision. My work lives in the tension between these two
              realities.
            </p>
          </div>
          <div className="border-t border-[#1A1A1A]/10 pt-8 mt-8 lg:mt-0">
            <span className="text-xs font-mono text-[#1A1A1A]/40 block mb-2">Featured Series</span>
            <span className="text-lg font-display italic text-[#1A1A1A]">
              &ldquo;Anatomy of a Digital Stroke&rdquo; (2024)
            </span>
          </div>
        </div>

        {/* Right media stack */}
        <div className="lg:col-span-7 flex flex-col gap-24 md:gap-36">
          {MEDIA_BLOCKS.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative w-full ${block.offset}`}
            >
              <div className={`${block.aspect} w-full ${block.bg} overflow-clip relative mb-6`}>
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  className={`w-full h-full object-cover ${block.grayscale} group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out`}
                />
                <div
                  className={`absolute top-4 right-4 ${block.badgeBg} px-3 py-1 text-[10px] font-mono uppercase tracking-wider`}
                >
                  {block.badge}
                </div>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-display italic text-2xl text-[#1A1A1A]">{block.title}</h3>
                <span className="text-xs font-mono text-[#1A1A1A]/50 text-right">{block.meta}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}