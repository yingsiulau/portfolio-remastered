import { useState } from 'react';
import { motion } from 'framer-motion';
import InquirySheet from './InquirySheet';

export default function StudioInvitation() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <section
        id="studio"
        className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-[#1A1A1A] text-white overflow-clip"
      >
        {/* Background geometry */}
        <div className="absolute right-0 bottom-0 w-96 h-96 border border-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute left-0 top-0 w-64 h-64 border border-white/5 rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#4D4DFF] block mb-6">
              // COLLABORATIONS &amp; INQUIRIES
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-light leading-none tracking-tight mb-8">
              Let&apos;s build
              <br />
              something <span className="italic text-[#4D4DFF]">impossible</span>.
            </h2>
            <p className="text-lg text-white/60 font-light max-w-md leading-relaxed mb-8">
              Available for gallery exhibitions, interactive installation projects, algorithmic art
              commissions, and technical creative direction.
            </p>
            <button
              onClick={() => setInquiryOpen(true)}
              className="group flex items-center gap-4 bg-white text-[#1A1A1A] px-8 py-4 rounded-full hover:bg-[#4D4DFF] hover:text-white transition-all duration-300"
            >
              <span className="text-xs font-mono uppercase tracking-widest">Initiate Connection</span>
              <span className="text-lg group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-md rounded-lg"
          >
            <h3 className="font-display italic text-2xl mb-8">Studio Coordinates</h3>
            <div className="flex flex-col gap-6 font-mono text-xs text-white/60">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Location:</span>
                <span className="text-white">Hong Kong / Zürich / Global</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Primary Tech:</span>
                <span className="text-white">Three.js, GLSL, React, WebGL</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Physical Medium:</span>
                <span className="text-white">Acrylic, Gesso, Screenprint</span>
              </div>
              <div className="flex justify-between pb-3">
                <span>Socials:</span>
                <div className="flex gap-4">
                  <a
                    href="https://yingsiulauart.wordpress.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#4D4DFF] transition-colors"
                  >
                    WP
                  </a>
                  <a
                    href="https://yingsiulau.github.io/portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#4D4DFF] transition-colors"
                  >
                    GH
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer plaque */}
        <div className="w-full mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40">
          <span>© 2025 Ying Siu Lau. All rights reserved.</span>
          <span>Designed for Canvas &amp; Silicon.</span>
        </div>
      </section>

      <InquirySheet open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}