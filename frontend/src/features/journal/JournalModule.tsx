import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useJournalStore } from './store/useJournalStore';
import { JournalSidebar } from './components/JournalSidebar';
import { JournalEditor } from './components/JournalEditor';
import { JournalDashboard } from './components/JournalDashboard';
import { X, Lock, Star, BookOpen, PenTool } from 'lucide-react';
import { AIToggleButton } from '../ai/AIToggleButton';
import { useCreateJournalEntry } from './services/journal.service';

export const JournalModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { selectedEntryId, setSelectedEntryId, setSelectedFolderId, setShowFavoritesOnly, showFavoritesOnly } = useJournalStore();
  const { mutate: createEntry } = useCreateJournalEntry();
  
  const isOpen = focusedObjectId === 'journal';

  const handleNewPage = () => {
    createEntry({ type: 'journal' }, {
      onSuccess: (data) => setSelectedEntryId(data.id)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 190, mass: 0.9 }}
          className="fixed inset-3 md:inset-6 lg:inset-10 z-50 bg-[#1c0f1d] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.85)] border-4 border-[#854F6C]/40 flex flex-col overflow-hidden font-[var(--font-journal-body)] text-[#FBE4D8]"
        >
          {/* Top Leather Binder Bar & Satin Bookmark Ribbons */}
          <div className="h-14 bg-[#140a15] border-b-2 border-[#854F6C]/30 flex items-center justify-between px-8 relative z-30 shrink-0 select-none">
            
            {/* Lock Indicator & Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#2B124C] border border-[#854F6C]/40 rounded-full text-xs font-[var(--font-journal-mono)] text-[#DFB6B2]">
                <Lock className="w-3.5 h-3.5 text-[#DFB6B2]" />
                <span>Private Observatory Diary</span>
              </div>
            </div>

            {/* Satin Ribbon Bookmark Navigation Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewPage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-b-lg bg-[#9b3346] hover:bg-[#b83c53] text-[#FBE4D8] text-xs font-bold transition-all shadow-md active:translate-y-0.5"
                title="Write New Diary Entry"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>New Page</span>
              </button>

              <button
                onClick={() => { setSelectedFolderId(null); setShowFavoritesOnly(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-b-lg text-xs font-bold transition-all shadow-md active:translate-y-0.5 ${
                  showFavoritesOnly ? 'bg-[#c59b27] text-[#190019]' : 'bg-[#7a5e18] text-[#FBE4D8] hover:bg-[#c59b27]'
                }`}
                title="Starred Memories Ribbon"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Starred</span>
              </button>

              <button
                onClick={() => { setSelectedFolderId(null); setShowFavoritesOnly(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-b-lg bg-[#274c77] hover:bg-[#3668a1] text-[#FBE4D8] text-xs font-bold transition-all shadow-md active:translate-y-0.5"
                title="All Logbooks Ribbon"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Logs</span>
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={clearFocus}
              className="w-9 h-9 rounded-full bg-[#2B124C] hover:bg-[#522B5B] border border-[#854F6C]/40 flex items-center justify-center text-[#DFB6B2] hover:text-[#FBE4D8] transition-all shadow-md"
              title="Close Diary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <AIToggleButton 
            context={{ 
              module: 'Journal', 
              data: selectedEntryId ? 'Editing diary page ' + selectedEntryId : 'Browsing Personal Diary Dashboard' 
            }} 
          />

          {/* Open Book Spread Body */}
          <div className="flex-1 relative flex overflow-hidden">
            <JournalSidebar />
            
            <div className="flex-1 relative flex overflow-hidden bg-[#2B124C]">
              <AnimatePresence mode="wait">
                {selectedEntryId ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, scale: 0.98, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -20 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
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
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full flex"
                  >
                    <JournalDashboard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
