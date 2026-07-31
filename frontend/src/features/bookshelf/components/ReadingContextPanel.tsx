import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookshelfStore } from '../store/useBookshelfStore';
import { useLibraryRecords, useUpdateLibraryRecord } from '../services/library.service';
import { X, Star, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export const ReadingContextPanel: React.FC = () => {
  const { selectedBook, setSelectedBook, setReadingBookId } = useBookshelfStore();
  const { data: records = {} } = useLibraryRecords();
  const { mutate: updateRecord } = useUpdateLibraryRecord();

  const record = selectedBook ? records[selectedBook.id] : null;
  const isFavorite = record?.isFavorite || false;

  useEffect(() => {
    if (selectedBook) {
      updateRecord({ contentId: selectedBook.id, data: { lastReadAt: new Date().toISOString() } });
    }
  }, [selectedBook, updateRecord]);

  if (!selectedBook) return null;

  return (
    <AnimatePresence>
      {selectedBook && (
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-[380px] shrink-0 h-full bg-[#0F172A] border-l border-[#1E293B] shadow-2xl flex flex-col z-40 overflow-hidden font-[var(--font-library-sans)] text-[#F8FAFC]"
        >
          {/* Header Action Bar */}
          <div className="flex justify-between items-center p-5 border-b border-[#1E293B] shrink-0 bg-[#0F172A]">
            <span className="text-xs font-bold tracking-widest text-[#94A3B8] uppercase font-mono">Volume Inspector</span>
            <button 
              onClick={() => setSelectedBook(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Elegant Cover Display */}
            <div className="p-6 bg-[#0B0F19] flex flex-col items-center border-b border-[#1E293B]">
              {selectedBook.coverUrl ? (
                <div className="relative group">
                  <img 
                    src={selectedBook.coverUrl} 
                    alt={selectedBook.title} 
                    className="w-44 rounded-lg shadow-2xl object-contain border border-[#334155]"
                  />
                </div>
              ) : (
                <div className="w-44 aspect-[2/3] bg-[#1E293B] rounded-lg shadow-2xl flex items-center justify-center text-center p-5 border-l-4 border-[#C5A059]">
                  <span className="text-white font-[var(--font-library-serif)] text-lg leading-snug">{selectedBook.title}</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6">
              <h2 className="text-xl font-[var(--font-library-serif)] font-bold text-[#F8FAFC] mb-1.5 leading-tight">
                {selectedBook.title}
              </h2>
              
              <p className="text-[#94A3B8] text-xs mb-6 font-medium">
                {selectedBook.authors?.join(', ') || 'Unknown Author'}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                {selectedBook.fullTextAvailable && selectedBook.gutendexId ? (
                  <button 
                    onClick={() => setReadingBookId(selectedBook.gutendexId || null)}
                    className="flex-1 bg-[#4CC9F0] hover:bg-[#38b6dc] text-[#0B0F19] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md text-xs uppercase tracking-wider"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read eBook (In-App)
                  </button>
                ) : (
                  <a 
                    href={selectedBook.readUrl || `https://www.google.com/search?q=${encodeURIComponent(selectedBook.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#C5A059] hover:bg-[#B48F48] text-[#0B0F19] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md text-xs uppercase tracking-wider"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview Volume
                  </a>
                )}
                
                <button 
                  onClick={() => updateRecord({ contentId: selectedBook.id, data: { isFavorite: !isFavorite } })}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                    isFavorite 
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]' 
                      : 'bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:bg-[#334155] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Metadata Table */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-[#1E293B] pb-2 font-mono">Archive Telemetry</h3>
                
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#1E293B]/60 text-xs">
                  <span className="text-[#94A3B8]">Published</span>
                  <span className="col-span-2 font-mono text-[#F8FAFC]">
                    {selectedBook.publishYear || 'Classic'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#1E293B]/60 text-xs">
                  <span className="text-[#94A3B8]">Catalog Source</span>
                  <span className="col-span-2 font-mono text-[#4CC9F0] uppercase">
                    {selectedBook.source}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedBook.description && (
                <div className="mt-6 bg-[#1E293B] rounded-xl p-4 border border-[#334155]">
                  <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Abstract & Summary</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed font-[var(--font-library-serif)]">
                    {selectedBook.description}
                  </p>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
