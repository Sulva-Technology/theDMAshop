import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';

export function BrandStory() {
  const { setCurrentPage } = useStore();
  return (
    <section className="py-32 bg-primary text-primary-foreground overflow-hidden relative">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold opacity-60 block truncate">Our Philosophy</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight break-words">
            Luxury is a <span className="italic font-serif opacity-80">feeling</span>, <br className="hidden sm:block" />
            not just a label.
          </h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl opacity-70 leading-relaxed font-light"
        >
          At theDMAshop, we redefine day-to-day luxury. Our mission is to provide meticulously crafted essentials that empower the modern individual. We believe in quality over quantity, and style that transcends trends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8"
        >
          <div 
            className="inline-block border-b border-white/30 pb-2 text-sm uppercase tracking-widest font-bold hover:border-white transition-colors cursor-pointer"
            onClick={() => setCurrentPage('about')}
          >
            Read Our Full Story
          </div>
        </motion.div>
      </div>
    </section>
  );
}
