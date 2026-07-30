import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from '../services/journal.service';
import { Star, Calendar, ArrowRight, PenTool, Trash2, StickyNote, X } from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { searchQuery, selectedFolderId, showFavoritesOnly, setSelectedEntryId } = useJournalStore();
  const { data: entries = [] } = useJournalEntries({ folderId: selectedFolderId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined, type: 'journal' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();

  const [showQuickNoteModal, setShowQuickNoteModal] = useState(false);
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');

  const handleCreateEntry = () => {
    createEntry({ folderId: selectedFolderId, type: 'journal' }, {
      onSuccess: (data) => setSelectedEntryId(data.id)
    });
  };

  const handleCreateQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNoteTitle.trim() || quickNoteContent.trim()) {
      createEntry({
        title: quickNoteTitle.trim() ? `Quick Note: ${quickNoteTitle.trim()}` : 'Quick Note',
        content: quickNoteContent.trim() || '',
        type: 'journal',
        folderId: selectedFolderId
      }, {
        onSuccess: (data) => {
          setQuickNoteTitle('');
          setQuickNoteContent('');
          setShowQuickNoteModal(false);
          setSelectedEntryId(data.id);
        }
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#190019] to-[#2B124C] text-[#FBE4D8] font-[var(--font-journal-body)] p-10 md:p-16 relative">
      
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-[var(--font-journal-display)] font-bold text-[#DFB6B2] mb-3">
              {searchQuery ? `Search: "${searchQuery}"` : showFavoritesOnly ? 'Favorite Memories' : 'Observatory Log'}
            </h1>
            <p className="text-[#FBE4D8]/60 text-sm font-[var(--font-journal-mono)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowQuickNoteModal(true)}
              className="flex items-center gap-2 bg-[#DFB6B2] hover:bg-[#FBE4D8] text-[#190019] px-5 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
              title="Add a fast Quick Note"
            >
              <StickyNote className="w-4 h-4" />
              <span>Quick Note</span>
            </button>
            
            <button 
              onClick={handleCreateEntry}
              className="flex items-center gap-2 bg-[#522B5B] hover:bg-[#854F6C] text-[#FBE4D8] px-5 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm border border-[#854F6C]/40"
            >
              <PenTool className="w-4 h-4" />
              <span>New Observation</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-[#DFB6B2] rounded-full" />
          <h2 className="text-2xl font-[var(--font-journal-display)] font-bold text-[#FBE4D8]">Observations</h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(entry => (
            <div 
              key={entry.id}
              onClick={() => setSelectedEntryId(entry.id)}
              className="group bg-[#522B5B]/30 hover:bg-[#522B5B]/60 border border-[#854F6C]/20 hover:border-[#854F6C]/60 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(25,0,25,0.5)] flex flex-col h-64 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Card Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2 text-[#DFB6B2]/70 font-[var(--font-journal-mono)] text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {entry.isFavorite && <Star className="w-4 h-4 text-[#DFB6B2] fill-current" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this observation log entry?')) {
                        deleteEntry(entry.id);
                      }
                    }}
                    className="p-1 text-[#DFB6B2]/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                    title="Delete Observation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-[var(--font-journal-heading)] font-bold text-[#FBE4D8] mb-3 line-clamp-2 leading-tight relative z-10 group-hover:text-[#DFB6B2] transition-colors">
                {entry.title || 'Untitled Observation'}
              </h3>

              <div className="prose prose-sm prose-invert opacity-50 line-clamp-3 font-light relative z-10 flex-1">
                {entry.content?.replace(/[#*`_~[\]]/g, '') || 'No additional notes recorded...'}
              </div>

              <div className="mt-4 pt-4 border-t border-[#854F6C]/20 flex justify-between items-center relative z-10">
                <span className="text-xs font-[var(--font-journal-mono)] text-[#DFB6B2]/50">
                  {entry.content?.split(/\s+/).filter(w => w.length > 0).length || 0} words
                </span>
                <ArrowRight className="w-4 h-4 text-[#DFB6B2] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-[#FBE4D8]/30">
            <PenTool className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-xl font-[var(--font-journal-display)]">No observations found.</p>
            <button onClick={handleCreateEntry} className="mt-4 text-[#DFB6B2] hover:underline underline-offset-4 font-bold">
              Create your first entry
            </button>
          </div>
        )}
      </div>

      {/* Quick Note Fast Modal */}
      <AnimatePresence>
        {showQuickNoteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#190019] border-2 border-[#854F6C] rounded-2xl w-full max-w-md p-6 text-[#FBE4D8] shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-[#DFB6B2]" />
                  <h3 className="font-bold font-[var(--font-journal-display)] text-lg text-[#DFB6B2]">Add Quick Note</h3>
                </div>
                <button onClick={() => setShowQuickNoteModal(false)} className="text-[#DFB6B2]/50 hover:text-[#DFB6B2]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuickNote} className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Quick Note Title (e.g. Star Coordinate)..."
                  value={quickNoteTitle}
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  className="w-full bg-[#2B124C] border border-[#854F6C]/40 rounded-xl p-3 text-sm text-[#FBE4D8] outline-none shadow-inner"
                />

                <textarea
                  rows={4}
                  placeholder="Write your fast note content..."
                  value={quickNoteContent}
                  onChange={(e) => setQuickNoteContent(e.target.value)}
                  className="w-full bg-[#2B124C] border border-[#854F6C]/40 rounded-xl p-3 text-xs text-[#FBE4D8] font-[var(--font-journal-body)] outline-none shadow-inner resize-none"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickNoteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#DFB6B2]/60 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] shadow transition-all"
                  >
                    Save Quick Note
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
