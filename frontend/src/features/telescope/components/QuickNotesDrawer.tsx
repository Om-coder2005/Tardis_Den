import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useLibraryRecords, useUpdateLibraryRecord } from '../../bookshelf/services/library.service';

interface QuickNotesDrawerProps {
  contentId?: string;
  title?: string;
}

export const QuickNotesDrawer: React.FC<QuickNotesDrawerProps> = ({ contentId = 'telescope_general_notes', title = "Observatory Logbook" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: records = {} } = useLibraryRecords();
  const { mutate: updateRecord } = useUpdateLibraryRecord();

  const record = records[contentId];
  const [notes, setNotes] = useState(record?.notes || '');

  React.useEffect(() => {
    if (record?.notes !== undefined) {
      setNotes(record.notes);
    }
  }, [record?.notes]);

  const handleSave = () => {
    updateRecord({ contentId, data: { notes } });
  };

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-auto">
      {/* Toggle Button Tag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0A1128]/90 hover:bg-[#3A0CA3] text-[#4CC9F0] hover:text-white p-3 rounded-l-xl border-l border-y border-[#4CC9F0]/30 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col items-center gap-2 group"
        title="Quick Telescope Notes"
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        <FileText className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
        <span className="[writing-mode:vertical-lr] text-[9px] font-[var(--font-tele-mono)] tracking-widest uppercase font-bold text-[#F4F4F9]/70 py-1">
          LOGBOOK
        </span>
      </button>

      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 h-[480px] bg-gradient-to-b from-[#0A1128]/95 to-[#02040A]/95 backdrop-blur-2xl border-l border-y border-[#4CC9F0]/30 rounded-l-2xl p-6 shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <FileText className="w-4 h-4" />
                <h4 className="font-bold text-sm font-[var(--font-tele-serif)] tracking-wide">{title}</h4>
              </div>
              <button
                onClick={handleSave}
                className="text-[10px] font-[var(--font-tele-mono)] text-[#4CC9F0] hover:text-white bg-[#4CC9F0]/10 hover:bg-[#4CC9F0]/20 px-3 py-1 rounded border border-[#4CC9F0]/30 transition-all flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                SAVE
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record deep space observations, coordinate notes, or anomaly logs..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-[#F4F4F9] placeholder:text-[#F4F4F9]/30 focus:outline-none focus:border-[#4CC9F0]/50 resize-none font-[var(--font-tele-sans)] leading-relaxed"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
