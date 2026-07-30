import React from 'react';
import { motion } from 'framer-motion';

export const TelescopeLensOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Outer Telescope Vignette Edge Shadow */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.75)]" />

      {/* Subtle Corner HUD Reticle Elements */}
      <div className="absolute top-4 left-4 text-[9px] font-[var(--font-tele-mono)] text-[#4CC9F0]/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4CC9F0] animate-pulse" />
        <span>OPTICS: ACTIVE</span>
      </div>

      <div className="absolute bottom-4 right-4 text-[9px] font-[var(--font-tele-mono)] text-[#4CC9F0]/40 tracking-widest">
        GRID-AZ 354.21 // ELEV 42.08
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#4CC9F0]/20 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#4CC9F0]/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#4CC9F0]/20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#4CC9F0]/20 pointer-events-none" />

      {/* Slow, Elegant Rotating Center Target Ring (Subtle 10% opacity) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          className="w-[420px] h-[420px] rounded-full border border-dashed border-[#4CC9F0]"
        />
      </div>
    </div>
  );
};
