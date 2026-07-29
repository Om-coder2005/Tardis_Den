import React from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import type { DesktopWindow } from '../store/useDesktopStore';
import { Minus, X } from 'lucide-react';

interface WindowProps {
  window: DesktopWindow;
  constraintsRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: win, constraintsRef, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, activeWindowId } = useDesktopStore();

  if (win.isMinimized) return null;

  const isActive = activeWindowId === win.id;

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onMouseDown={() => focusWindow(win.id)}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      style={{ zIndex: win.zIndex }}
      className={`absolute left-12 top-12 flex h-[min(72vh,560px)] w-[min(82vw,820px)] min-w-[340px] max-w-[94vw] flex-col overflow-hidden rounded-xl border-2 border-[#190019] bg-[#DFB6B2] text-[#190019] transition-all font-['Space_Mono',monospace] ${
        isActive ? 'shadow-[8px_8px_0px_#190019]' : 'shadow-[4px_4px_0px_#190019] opacity-95'
      }`}
    >
      {/* Title Bar (Solid Drag Handle) */}
      <div 
        className={`flex cursor-grab items-center justify-between border-b-2 border-[#190019] px-3.5 py-2 active:cursor-grabbing ${
          isActive ? 'bg-[#190019] text-[#FBE4D8]' : 'bg-[#2B124C] text-[#DFB6B2]'
        }`}
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} 
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
            title="Close Window"
          >
            <X className="w-3 h-3 text-[#190019]" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} 
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
            title="Minimize Window"
          >
            <Minus className="w-3 h-3 text-[#190019]" />
          </button>
        </div>
        
        <div className="pointer-events-none select-none text-xs font-bold tracking-[0.2em] uppercase truncate px-4">
          C:\System\{win.appId}.exe — {win.title}
        </div>
        
        <div className="w-12 text-right text-[10px] font-bold opacity-60">
          [OS]
        </div>
      </div>

      {/* Content Area - Clean solid container */}
      <div className="relative flex-1 overflow-auto bg-[#FBE4D8] text-[#190019]">
        {!isActive && (
          <div className="absolute inset-0 z-50 bg-black/5" onClick={() => focusWindow(win.id)} />
        )}
        {children}
      </div>
    </motion.div>
  );
};
