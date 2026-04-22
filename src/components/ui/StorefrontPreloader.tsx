import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

type StorefrontPreloaderProps = {
  className?: string;
  fullscreen?: boolean;
  label?: string;
  title?: string;
  message?: string;
};

const silhouetteHeights = ['h-24 sm:h-28', 'h-32 sm:h-36', 'h-28 sm:h-32'] as const;

export function StorefrontPreloader({
  className,
  fullscreen = false,
  label = 'theDMAshop',
  title = 'Curating your storefront',
  message = 'Loading the latest pieces, content, and account context.',
}: StorefrontPreloaderProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'relative isolate overflow-hidden border border-white/10 bg-[#08101d] text-white',
        fullscreen ? 'min-h-screen border-0 rounded-none' : 'min-h-[26rem] rounded-[2rem]',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.18),_transparent_34%),linear-gradient(180deg,_rgba(8,16,29,0.96)_0%,_rgba(3,8,16,1)_100%)]" />
      <motion.div
        className="absolute left-[12%] top-10 h-28 w-40 rounded-full bg-sky-400/10 blur-3xl"
        animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-8 right-[10%] h-36 w-36 rounded-full bg-indigo-300/10 blur-3xl"
        animate={{ opacity: [0.25, 0.7, 0.25], scale: [1.08, 0.94, 1.08] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className={cn(
          'relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center',
          fullscreen && 'min-h-screen',
        )}
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm"
        >
          {label}
        </motion.span>

        <div className="mt-10 flex items-end gap-4 sm:gap-5">
          {silhouetteHeights.map((heightClass, index) => (
            <motion.div
              key={heightClass}
              className={cn(
                'relative w-16 overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/10 shadow-[0_20px_60px_rgba(2,8,23,0.38)] backdrop-blur-sm sm:w-20',
                heightClass,
                index === 1 && 'translate-y-3',
              )}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.45, delay: index * 0.12 },
                y: { duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.16 },
              }}
            >
              <div className="absolute inset-x-4 top-4 h-1.5 rounded-full bg-white/45" />
              <div className="absolute inset-x-4 top-9 h-px bg-white/20" />
              <div className="absolute inset-x-4 bottom-4 h-8 rounded-2xl border border-white/10 bg-white/5" />
            </motion.div>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
          className="mt-10 text-3xl font-heading font-bold tracking-tight sm:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
          className="mt-4 max-w-xl text-sm leading-7 text-white/64 sm:text-base"
        >
          {message}
        </motion.p>

        <div className="mt-10 flex w-full max-w-sm items-center gap-3">
          <span className="h-px flex-1 bg-white/15" />
          <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-sky-300 via-white to-sky-200"
              animate={{ x: ['-110%', '210%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <span className="sr-only">{message}</span>
      </div>
    </section>
  );
}
