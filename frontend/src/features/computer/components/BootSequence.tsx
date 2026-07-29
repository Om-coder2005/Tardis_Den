import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import { RadioTower, Telescope } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const BootSequence: React.FC = () => {
  const { setHasBooted } = useDesktopStore();
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const [stage, setStage] = useState(0);
  const hasSkippedRef = useRef(false);

  useEffect(() => {
    const finishBoot = () => {
      if (hasSkippedRef.current) return;
      hasSkippedRef.current = true;
      setHasBooted(true);
    };

    if (reducedMotion) {
      finishBoot();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => finishBoot(), 2100);

    const handleSkip = () => finishBoot();
    window.addEventListener('keydown', handleSkip);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [reducedMotion, setHasBooted]);

  return (
    <button
      type="button"
      onClick={() => setHasBooted(true)}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#06070b] text-[#f3d26a] font-mono text-left"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,191,58,0.18),transparent_30%),linear-gradient(180deg,rgba(255,214,94,0.08),transparent_28%),linear-gradient(135deg,#08090d,#11131b_45%,#090a0f)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,215,96,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,96,0.14)_1px,transparent_1px)] [background-size:26px_26px]" />
      <AnimatePresence>
        {stage >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex w-[min(88vw,760px)] flex-col gap-8 rounded-[28px] border border-[#f3d26a]/40 bg-black/55 p-10 shadow-[0_0_60px_rgba(236,191,58,0.18)] backdrop-blur-sm"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.32em] text-[#f3d26a]/70">
              <span>Observatory Computer</span>
              <span>Boot Sequence</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f3d26a]/60 bg-[#f3d26a]/10">
                <Telescope className="h-8 w-8 opacity-90" />
              </div>
              <div>
                <h1 className="text-3xl tracking-[0.28em] uppercase">TardisOS</h1>
                <p className="mt-2 text-sm text-[#f6e8b2]/70">
                  Initializing handcrafted observatory workspace
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl border border-[#f3d26a]/25 bg-[#f3d26a]/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#f3d26a]/65">
                  <RadioTower className="h-3.5 w-3.5" />
                  Signal Array
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f3d26a]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stage >= 1 ? '78%' : '24%' }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-full bg-[#f3d26a]"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-[#f3d26a]/25 bg-[#f3d26a]/5 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-[#f3d26a]/65">
                  Workspace Integrity
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f3d26a]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stage >= 2 ? '96%' : '46%' }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-full bg-[#f3d26a]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mt-8 space-y-2 text-sm opacity-80">
        <AnimatePresence>
          {stage >= 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Loading core modules...
            </motion.p>
          )}
          {stage >= 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Initializing workspace...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-8 z-10 text-xs uppercase tracking-[0.24em] opacity-55">
        v1.0.4 — press any key or click to skip
      </div>
    </button>
  );
};
