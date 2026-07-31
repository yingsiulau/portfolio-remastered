import { motion } from 'framer-motion';

const COLLAGE_ITEMS = [
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/whatsapp-image-2024-11-10-at-18.37.48.jpeg?w=768',
    alt: 'Mixed media collage containing paper clippings, charcoal strokes, and digital overlays',
    label: 'Fragment 01',
    meta: 'Scan / 300dpi',
    position: 'md:top-0 md:left-0 md:w-[40%]',
    aspect: 'aspect-[3/4]',
    z: 'z-10',
    delay: 0,
  },
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/ao5i7626-1.png?w=1024',
    alt: 'High-contrast print showing distorted typography and photographic texture',
    label: 'Photoshoot Study',
    meta: 'Photography',
    position: 'md:top-48 md:right-12 md:w-[45%]',
    aspect: 'aspect-[16/11]',
    z: 'z-20',
    delay: 0.1,
  },
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/whatsapp-image-2024-06-17-at-23.28.17.jpeg?w=768',
    alt: 'Macro view of heavily textured paint layers overlaying digital coordinates',
    label: 'Texture Crop',
    meta: 'Detail',
    position: 'md:bottom-12 md:left-[33%] md:w-[25%]',
    aspect: 'aspect-square',
    z: 'z-30',
    delay: 0.2,
  },
  {
    src: 'https://yingsiulauart.wordpress.com/wp-content/uploads/2024/12/ao5i7841-1.png?w=834',
    alt: 'Vector drawing showing geometric line systems and canvas layout coordinates',
    label: 'System Blueprint',
    meta: 'Digital Generation',
    position: 'md:bottom-0 md:right-0 md:w-[30%]',
    aspect: 'aspect-[3/4]',
    z: 'z-10',
    delay: 0.15,
  },
];

export default function Collage() {
  return (
    <section className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-[#EAE3D2] border-t border-b border-[#1A1A1A]/10">
      <div className="w-full mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-baseline gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60 block mb-2">
            [ COLLAGE SERIES ]
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-light tracking-tight">
            Tactile Fragmentations
          </h2>
        </div>
        <p className="text-sm md:text-base text-[#1A1A1A]/70 max-w-[36ch] font-light leading-relaxed">
          Physical scrapbooks, sketchbooks, and digital fragments layered together to document the
          evolution of a single visual concept.
        </p>
      </div>

      {/* Collage grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative md:min-h-[1000px]">
        {COLLAGE_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
            className={`md:col-span-6 md:absolute ${item.position} group ${item.z}`}
          >
            <div className="bg-[#F9F6F0] p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className={`${item.aspect} w-full overflow-clip bg-[#1A1A1A]/5 relative`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="mt-3 md:mt-4 flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A]/60">
                  {item.label}
                </span>
                <span className="text-xs font-mono text-[#1A1A1A]/40">{item.meta}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}