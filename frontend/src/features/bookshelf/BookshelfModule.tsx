import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useBookshelfStore } from './store/useBookshelfStore';
import { ArchiveSidebar } from './components/ArchiveSidebar';
import { LibraryBrowser } from './components/LibraryBrowser';
import { ReadingContextPanel } from './components/ReadingContextPanel';
import { EbookReaderModal } from './components/EbookReaderModal';
import { AIToggleButton } from '../ai/AIToggleButton';
import { X } from 'lucide-react';

export const BookshelfModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { selectedContentId } = useBookshelfStore();
  const isOpen = focusedObjectId === 'bookshelf';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-4 md:inset-8 lg:inset-12 z-50 bg-[#0B0F19] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col border border-[#1E293B] font-[var(--font-library-sans)] text-[#F8FAFC]"
        >
          {/* Global Close Button Overlay */}
          <button 
            onClick={clearFocus}
            className="absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-[#1E293B]/80 hover:bg-[#334155] border border-[#475569]/40 rounded-full shadow-md text-[#CBD5E1] hover:text-white transition-all"
            title="Close Archive"
          >
            <X className="w-5 h-5" />
          </button>

          <AIToggleButton 
            context={{ 
              module: 'Bookshelf', 
              data: selectedContentId ? 'Reading book/document ' + selectedContentId : null 
            }} 
          />

          {/* Full-Text eBook Reader Modal */}
          <EbookReaderModal />

          {/* 3-Pane Layout */}
          <div className="flex-1 flex overflow-hidden relative">
            <ArchiveSidebar />
            <LibraryBrowser />
            <ReadingContextPanel />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
