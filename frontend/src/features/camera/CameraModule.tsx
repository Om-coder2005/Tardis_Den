import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useGalleryStore } from './store/useGalleryStore';
import { Photobooth } from './components/Photobooth';
import { GallerySidebar } from './components/GallerySidebar';
import { GalleryGrid } from './components/GalleryGrid';
import { X } from 'lucide-react';
import { AIToggleButton } from '../ai/AIToggleButton';

export const CameraModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { viewMode } = useGalleryStore();
  
  const isOpen = focusedObjectId === 'camera';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-2 md:inset-4 lg:inset-8 z-50 bg-slate-950 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col"
        >
          <AIToggleButton context={{ module: 'Gallery', data: null }} />

          {/* Module Header */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={clearFocus}
              className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/70 hover:text-white transition-colors p-2 rounded-full border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Module Body */}
          <div className="flex-1 overflow-hidden relative flex">
            {viewMode === 'photobooth' ? (
              <Photobooth />
            ) : (
              <>
                <GallerySidebar />
                <GalleryGrid />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
