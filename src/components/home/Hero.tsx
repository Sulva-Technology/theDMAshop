import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setCurrentPage, cmsContent } = useStore();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hover Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center bg-[#0a0f1a] text-white pt-20 pb-10">
      
      {/* Soft Background Atmosphere */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-blue-400 mb-4 block truncate">
                  {cmsContent.hero.slogan}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.05] tracking-tighter break-words">
                  {cmsContent.hero.title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    {cmsContent.hero.title.split(' ').slice(-1)}
                  </span>
                </h1>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed max-w-md"
              >
                {cmsContent.hero.description}
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all" onClick={() => setCurrentPage(cmsContent.hero.buttonLink)}>
                {cmsContent.hero.buttonText}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Product Image */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div 
              className="relative w-full max-w-[500px] aspect-[4/5] rounded-2xl cursor-pointer perspective-1000"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              >
                {/* Image Mask Reveal */}
                <motion.div
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ clipPath: 'inset(0% 0 0 0)' }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="w-full h-full absolute inset-0"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={cmsContent.hero.image}
                      src={cmsContent.hero.image}
                      alt={cmsContent.hero.title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
                </motion.div>

                {/* Light Sweep Effect */}
                {isLoaded && (
                  <motion.div
                    initial={{ x: '-150%', skewX: -20 }}
                    animate={{ x: '150%', skewX: -20 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10 mix-blend-overlay"
                  />
                )}
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Cue */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
