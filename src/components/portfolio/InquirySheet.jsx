const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function InquirySheet({ open, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !details) return;
    setSending(true);
    try {
      const { base44 } = await import('@/api/base44Client');
      await db.integrations.Core.SendEmail({
        to: 'yingsiulauart.wordpress.com',
        subject: `New Inquiry from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\nProject Details:\n${details}`,
      });
      toast({ title: 'Connection initiated', description: "I'll be in touch soon." });
      setName('');
      setEmail('');
      setDetails('');
      onClose();
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md h-full bg-[#F9F6F0] text-[#1A1A1A] p-8 md:p-12 overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#1A1A1A]/60 hover:text-[#4D4DFF] transition-colors"
        >
          <X size={20} />
        </button>

        <span className="text-xs font-mono uppercase tracking-widest text-[#4D4DFF] block mb-4">
          // INITIATE CONNECTION
        </span>
        <h3 className="font-display text-3xl font-light italic mb-2">Studio Inquiry</h3>
        <p className="text-sm text-[#1A1A1A]/60 font-light mb-8">
          Tell me about your project, exhibition, or collaboration idea.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/50">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-base font-light focus:outline-none focus:border-[#4D4DFF] transition-colors"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/50">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-base font-light focus:outline-none focus:border-[#4D4DFF] transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/50">
              Project Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={5}
              className="bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-base font-light focus:outline-none focus:border-[#4D4DFF] transition-colors resize-none"
              placeholder="Exhibition, commission, collaboration..."
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-4 flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-8 py-4 rounded-full hover:bg-[#4D4DFF] transition-all duration-300 disabled:opacity-50"
          >
            <span className="text-xs font-mono uppercase tracking-widest">
              {sending ? 'Sending...' : 'Send Inquiry'}
            </span>
            <span className="text-lg">→</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}