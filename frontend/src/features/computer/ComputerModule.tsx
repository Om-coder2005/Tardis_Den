import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useDesktopStore } from './store/useDesktopStore';
import { BootSequence } from './components/BootSequence';
import { DesktopEnvironment } from './components/DesktopEnvironment';

export const ComputerModule: React.FC = () => {
  const { focusedObjectId, setFocusedObjectId } = useRoomStore();
  const { hasBooted } = useDesktopStore();
  
  const isFocused = focusedObjectId === 'desk';

  if (!isFocused) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-4 md:inset-8 z-40 bg-[#190019] rounded-[24px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.65)] border-2 border-[#854f6c] flex flex-col font-['Space_Mono',monospace]"
    >
      {/* Power Button (Exit) - Retro styled, no glassmorphism */}
      <button
        onClick={() => setFocusedObjectId(null)}
        className="absolute top-4 right-4 z-[60] h-10 px-3 bg-[#DFB6B2] hover:bg-[#FBE4D8] active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#190019] shadow-[3px_3px_0px_#190019] rounded-xl flex items-center gap-2 transition-colors text-[#190019] font-bold text-xs"
        title="Power Off / Exit Computer"
        aria-label="Power Off / Exit Computer"
      >
        <div className="w-3 h-3 rounded-full bg-red-600 border border-[#190019] animate-pulse" />
        <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Power Off</span>
      </button>

      <AnimatePresence mode="wait">
        {!hasBooted ? (
          <motion.div key="boot" exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            <BootSequence />
          </motion.div>
        ) : (
          <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col">
            <DesktopEnvironment />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
