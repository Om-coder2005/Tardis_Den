import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useJournalStore } from './store/useJournalStore';
import { JournalSidebar } from './components/JournalSidebar';
import { JournalEditor } from './components/JournalEditor';
import { JournalDashboard } from './components/JournalDashboard';
import { X } from 'lucide-react';
import { AIToggleButton } from '../ai/AIToggleButton';

export const JournalModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { selectedEntryId } = useJournalStore();
  
  const isOpen = focusedObjectId === 'journal';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
          className="absolute inset-4 md:inset-8 lg:inset-12 z-50 bg-[#190019] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[#854F6C]/50 flex overflow-hidden font-[var(--font-journal-body)] text-[#FBE4D8]"
        >
          
          <AIToggleButton 
            context={{ 
              module: 'Journal', 
              data: selectedEntryId ? 'Editing journal entry ' + selectedEntryId : 'Browsing Journal Dashboard' 
            }} 
          />

          <JournalSidebar />
          
          <div className="flex-1 relative flex overflow-hidden bg-[#2B124C]">
            <AnimatePresence mode="wait">
              {selectedEntryId ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex"
                >
                  <JournalEditor />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex"
                >
                  <JournalDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={clearFocus}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#190019]/90 backdrop-blur border border-[#854F6C]/40 flex items-center justify-center text-[#DFB6B2] hover:bg-[#522B5B] hover:text-[#FBE4D8] transition-all shadow-lg z-50"
            title="Close Journal"
          >
            <X className="w-5 h-5" />
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
