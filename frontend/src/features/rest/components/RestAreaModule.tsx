import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../../store';
import { useDreamStore } from '../store/useDreamStore';
import { TopBar } from './TopBar';
import { MediaWidget } from './MediaWidget';
import { NasaWindow } from './NasaWindow';
import { DesktopIcons } from './DesktopIcons';
import { TimerWidget } from './TimerWidget';
import { AstrosWindow } from './AstrosWindow';
import { CampfireWindow } from './CampfireWindow';

export const RestAreaModule: React.FC = () => {
  const { focusedObjectId } = useRoomStore();
  const { fetchDailyContent, tickTimer, isTimerRunning } = useDreamStore();
  
  const isOpen = focusedObjectId === 'bed';

  useEffect(() => {
    if (isOpen) {
      fetchDailyContent();
    }
  }, [isOpen, fetchDailyContent]);

  // Global Timer Tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(tickTimer, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[#09030d]/60 p-4 md:p-8 font-['Space_Mono',monospace] text-[#FBE4D8]"
        >
          <div className="relative flex h-full max-h-[760px] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-[#854F6C] bg-[#190019] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 70% 10%, rgba(133,79,108,0.35), transparent 35%), linear-gradient(135deg, rgba(43,18,76,0.7), transparent 55%)' }} />
            <div className="relative z-10 pointer-events-auto shrink-0">
              <TopBar />
            </div>

            <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[220px_minmax(0,1fr)_112px] md:overflow-hidden">
              <aside className="border-b border-[#854F6C]/50 bg-[#2B124C]/55 p-4 md:border-b-0 md:border-r">
                <div className="mb-5 flex items-center gap-3 border-b border-[#854F6C]/50 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFB6B2] text-[#190019] shadow-[3px_3px_0_#190019]">☾</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#DFB6B2]/70">TARDIS</p>
                    <h2 className="text-sm font-bold text-[#FBE4D8]">Resting Quarters</h2>
                  </div>
                </div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#DFB6B2]/60">Now playing</p>
                <MediaWidget />
              </aside>

              <main className="min-h-0 overflow-y-auto bg-[#190019]/70 p-4 md:p-6 custom-scrollbar">
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#854F6C]/50 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#DFB6B2]/65">Quiet mode / personal observatory</p>
                    <h1 className="mt-1 font-['Playfair_Display',serif] text-2xl font-bold text-[#FBE4D8] md:text-3xl">A little room to breathe</h1>
                  </div>
                  <span className="hidden rounded-full border border-[#854F6C] px-3 py-1 text-[10px] uppercase tracking-widest text-[#DFB6B2] sm:inline-flex">offline friendly</span>
                </div>
                <div className="flex min-h-full flex-col items-center gap-4">
                  <CampfireWindow />
                  <NasaWindow />
                  <AstrosWindow />
                  <TimerWidget />
                </div>
              </main>

              <aside className="border-t border-[#854F6C]/50 bg-[#2B124C]/40 p-3 md:border-l md:border-t-0">
                <p className="mb-4 text-center text-[10px] uppercase tracking-[0.25em] text-[#DFB6B2]/60">Utilities</p>
                <DesktopIcons />
              </aside>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
