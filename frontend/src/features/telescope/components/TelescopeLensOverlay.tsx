import React from 'react';
import { motion } from 'framer-motion';

export const TelescopeLensOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Outer Telescope Vignette Shadow */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

      {/* Futuristic Circular Telescope HUD Reticle Grid */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        
        {/* Pulsing Outer HUD Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="w-[500px] h-[500px] rounded-full border border-dashed border-[#4CC9F0]/60 relative flex items-center justify-center"
        >
          {/* Degree Ticks */}
          <div className="absolute top-0 text-[8px] font-[var(--font-tele-mono)] text-[#4CC9F0]">000° N</div>
          <div className="absolute right-0 text-[8px] font-[var(--font-tele-mono)] text-[#4CC9F0]">090° E</div>
          <div className="absolute bottom-0 text-[8px] font-[var(--font-tele-mono)] text-[#4CC9F0]">180° S</div>
          <div className="absolute left-0 text-[8px] font-[var(--font-tele-mono)] text-[#4CC9F0]">270° W</div>
        </motion.div>

        {/* Counter-rotating Inner HUD Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="absolute w-[360px] h-[360px] rounded-full border border-[#4CC9F0]/30 border-t-[#4CC9F0]"
        />

        {/* Crosshair Center */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#4CC9F0] rounded-full shadow-[0_0_10px_#4CC9F0]" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#4CC9F0]/40 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#4CC9F0]/40 to-transparent" />
        </div>
      </div>

      {/* Radar Sweep Line Animation */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -mt-[175px] -ml-[175px] rounded-full bg-gradient-to-tr from-[#4CC9F0]/15 via-transparent to-transparent pointer-events-none origin-center opacity-60"
      />
    </div>
  );
};
