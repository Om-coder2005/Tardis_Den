import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../../store';
import { OBJECT_REGISTRY } from '../ObjectRegistry';
import { X, Lock } from 'lucide-react';

export const InteractionPanel: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const activeObject = OBJECT_REGISTRY.find(obj => obj.id === focusedObjectId);

  // Allow ESC to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearFocus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearFocus]);

  return (
    <AnimatePresence>
      {activeObject && activeObject.id !== 'bookshelf' && activeObject.id !== 'telescope' && activeObject.id !== 'journal' && activeObject.id !== 'camera' && activeObject.id !== 'desk' && activeObject.id !== 'bed' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-[400px] max-w-[90vw] bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden z-50 text-slate-100"
        >
          <div className="p-6 relative">
            <button 
              onClick={clearFocus}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand/20 rounded-lg text-brand">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-medium tracking-wide">{activeObject.name}</h3>
            </div>
            
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              {activeObject.description}
            </p>
            
            <div className="w-full py-3 px-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-300 tracking-widest uppercase">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
