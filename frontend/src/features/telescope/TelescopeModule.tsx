import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useTelescopeStore } from './store/useTelescopeStore';
import { AIToggleButton } from '../ai/AIToggleButton';
import { ObservatorySidebar } from './components/ObservatorySidebar';
import { ObservationBrowser } from './components/ObservationBrowser';
import { ObservationViewer } from './components/ObservationViewer';
import { X } from 'lucide-react';

export const TelescopeModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { selectedObservationId } = useTelescopeStore();
  const [activeTab] = useState<'apod' | 'astros'>('apod');
  const [apodData] = useState<any>(null);
  
  const isOpen = focusedObjectId === 'telescope';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-4 md:inset-8 lg:inset-12 z-50 bg-[#0A1128] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[#3A0CA3]/40 flex overflow-hidden font-[var(--font-tele-sans)] text-[#F4F4F9]"
        >
          <AIToggleButton 
            context={{ 
              module: 'Telescope', 
              data: activeTab === 'apod' ? apodData : null 
            }} 
          />

          {/* 3-Pane Layout */}
          <ObservatorySidebar />
          
          <div className="flex-1 relative flex overflow-hidden">
            <ObservationBrowser />
            
            <AnimatePresence>
              {selectedObservationId && <ObservationViewer />}
            </AnimatePresence>
          </div>

          {/* Close Button Overlay */}
          <button 
            onClick={clearFocus}
            className="absolute top-6 right-6 z-[60] w-10 h-10 rounded-full bg-[#0A1128]/90 border border-[#4CC9F0]/30 flex items-center justify-center text-[#4CC9F0] hover:bg-[#3A0CA3] hover:text-white transition-all shadow-lg"
            title="Close Telescope Observatory"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
