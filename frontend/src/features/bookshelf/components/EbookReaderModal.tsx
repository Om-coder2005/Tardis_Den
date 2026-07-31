import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookshelfStore } from '../store/useBookshelfStore';
import { useGutendexFullTextQuery } from '../services/bookServices';
import { X, BookOpen, ArrowLeft } from 'lucide-react';

export const EbookReaderModal: React.FC = () => {
  const { readingBookId, setReadingBookId, selectedBook } = useBookshelfStore();
  const { data: fullText, isLoading } = useGutendexFullTextQuery(readingBookId, !!readingBookId);

  if (!readingBookId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="fixed inset-4 md:inset-10 z-50 bg-[#0F172A] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-[#334155] flex flex-col overflow-hidden font-[var(--font-library-sans)] text-[#F8FAFC]"
      >
        {/* Reader Top Action Bar */}
        <div className="px-8 py-5 border-b border-[#1E293B] bg-[#0B0F19] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setReadingBookId(null)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors bg-[#1E293B] px-3.5 py-2 rounded-lg border border-[#334155]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Library
            </button>
            <div className="h-6 w-[1px] bg-[#1E293B]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block">
                FULL TEXT EBOOK READER // GUTENBERG CLASSICS
              </span>
              <h3 className="text-base font-bold font-[var(--font-library-serif)] text-white truncate max-w-xl">
                {selectedBook?.title || `Volume #${readingBookId}`}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setReadingBookId(null)}
            className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reader Content Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-[#0F172A] custom-scrollbar">
          <div className="max-w-3xl mx-auto bg-[#0B0F19] p-8 md:p-14 rounded-2xl border border-[#1E293B] shadow-2xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <BookOpen className="w-10 h-10 text-[#C5A059] animate-bounce" />
                <span className="text-xs font-mono text-[#94A3B8] tracking-widest uppercase">FETCHING FULL TEXT EBOOK ARCHIVES...</span>
              </div>
            ) : (
              <article className="prose prose-invert max-w-none font-serif text-[#CBD5E1] text-base leading-relaxed whitespace-pre-wrap selection:bg-[#C5A059]/30">
                <div className="mb-10 text-center pb-8 border-b border-[#1E293B]">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{selectedBook?.title}</h1>
                  <p className="text-sm font-mono text-[#C5A059]">{selectedBook?.authors?.join(', ')}</p>
                </div>
                {fullText}
              </article>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
