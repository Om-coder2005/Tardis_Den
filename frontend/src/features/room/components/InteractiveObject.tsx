import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RoomObject } from '../ObjectRegistry';
import { useRoomStore } from '../../../store';
import { Sparkles } from 'lucide-react';

interface InteractiveObjectProps {
  objectData: RoomObject;
  isDisabled?: boolean;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({ objectData, isDisabled = false }) => {
  const { setFocusedObjectId, setHoveredObjectId, hoveredObjectId } = useRoomStore();

  const isHovered = hoveredObjectId === objectData.id;
  
  // Dynamically import the SVG based on the svgFileName
  const svgUrl = useMemo(() => {
    return new URL(`../../../assets/room-svgs/${objectData.svgFileName}`, import.meta.url).href;
  }, [objectData.svgFileName]);

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: `${objectData.x}%`,
        top: `${objectData.y}%`,
        width: `${objectData.width}%`,
        height: `${objectData.height}%`,
        zIndex: objectData.zIndex + (isHovered ? 50 : 0),
      }}
    >
      {/* 
        The SVG Object Layer 
        Renders the raw SVG asset over the exact same spot in the background.
        When hovered, it pops out.
      */}
      <motion.div
        className="absolute inset-0 origin-center flex items-center justify-center"
        animate={isHovered && !isDisabled ? {
          scale: 1.05,
          y: -5,
        } : {
          scale: 1,
          y: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <img 
          src={svgUrl} 
          alt={objectData.name}
          className={`w-full h-full object-fill transition-opacity duration-300 ${!isDisabled ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none opacity-50'}`}
          onMouseEnter={() => !isDisabled && setHoveredObjectId(objectData.id)}
          onMouseLeave={() => !isDisabled && setHoveredObjectId(null)}
          onClick={() => {
            if (!isDisabled) {
              setFocusedObjectId(objectData.id);
              setHoveredObjectId(null);
            }
          }}
        />
      </motion.div>

      {/* Floating Pill Label */}
      <AnimatePresence>
        {isHovered && !isDisabled && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute z-50 pointer-events-none flex flex-col items-center"
            style={{
              left: `${objectData.x + objectData.width / 2}%`,
              top: `${objectData.y - 5}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="bg-slate-900/90 backdrop-blur-md text-slate-100 px-4 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium tracking-wide whitespace-nowrap">{objectData.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
