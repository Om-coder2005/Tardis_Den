import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry } from '../services/journal.service';
import { Star, Calendar, ArrowRight, PenTool, Trash2, StickyNote, X } from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { searchQuery, selectedFolderId, showFavoritesOnly, setSelectedEntryId } = useJournalStore();
  const { data: entries = [] } = useJournalEntries({ folderId: selectedFolderId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined, type: 'journal' });
  const { data: pinnedNotes = [] } = useJournalEntries({ search: searchQuery, type: 'pinned' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: updateEntry } = useUpdateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();

  const [showQuickNoteModal, setShowQuickNoteModal] = useState(false);
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');
  const [quickNoteColor, setQuickNoteColor] = useState('#FBE4D8');

  const handleCreateEntry = () => {
    createEntry({ folderId: selectedFolderId, type: 'journal' }, {
      onSuccess: (data) => setSelectedEntryId(data.id)
    });
  };

  const handleCreateQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNoteTitle.trim() || quickNoteContent.trim()) {
      createEntry({
        title: quickNoteTitle.trim() || 'Quick Sticky Note',
        content: quickNoteContent.trim() || '',
        type: 'pinned',
        color: quickNoteColor
      }, {
        onSuccess: () => {
          setQuickNoteTitle('');
          setQuickNoteContent('');
          setShowQuickNoteModal(false);
        }
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#190019] to-[#2B124C] text-[#FBE4D8] font-[var(--font-journal-body)] p-10 md:p-16 relative">
      
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-[var(--font-journal-display)] font-bold text-[#DFB6B2] mb-4">
              {searchQuery ? `Search: "${searchQuery}"` : showFavoritesOnly ? 'Favorite Memories' : 'Observatory Log'}
            </h1>
            <p className="text-[#FBE4D8]/60 text-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowQuickNoteModal(true)}
              className="flex items-center gap-2 bg-[#854F6C]/40 hover:bg-[#854F6C]/70 text-[#DFB6B2] border border-[#854F6C] px-5 py-3.5 rounded-full font-bold transition-all shadow-md hover:-translate-y-0.5 text-sm"
              title="Pin a Quick Sticky Note to room desk"
            >
              <StickyNote className="w-4 h-4" />
              <span>+ Quick Sticky Note</span>
            </button>

            <button 
              onClick={handleCreateEntry}
              className="flex items-center gap-3 bg-[#DFB6B2] hover:bg-[#FBE4D8] text-[#190019] px-6 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm"
            >
              <PenTool className="w-4 h-4" />
              <span>New Observation</span>
            </button>
          </div>
        </div>

        {/* Pinned Notes Strip */}
        {pinnedNotes.length > 0 && !showFavoritesOnly && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#854F6C] rounded-full" />
                <h2 className="text-2xl font-[var(--font-journal-display)] font-bold text-[#FBE4D8]">Pinned Desk Notes</h2>
              </div>
              <span className="text-xs text-[#DFB6B2]/50 font-[var(--font-journal-mono)]">Double click note to open in journal editor</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {pinnedNotes.map(note => (
                <div 
                  key={note.id}
                  onDoubleClick={() => {
                    updateEntry({ id: note.id, data: { type: 'journal' } }, {
                      onSuccess: () => setSelectedEntryId(note.id)
                    });
                  }}
                  style={{ backgroundColor: note.color || '#FBE4D8' }}
                  className="snap-start shrink-0 w-64 text-[#190019] rounded-xl p-5 cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative border border-black/10 group"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply rounded-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#854F6C] uppercase tracking-widest font-[var(--font-journal-mono)]">
                        {note.linkedModule ? `Ref: ${note.linkedModule}` : 'Pinned Sticky'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this pinned note?')) deleteEntry(note.id);
                        }}
                        className="text-black/40 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-[var(--font-journal-heading)] font-bold text-lg mb-1 leading-tight line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="font-[var(--font-journal-handwriting)] text-[#522B5B] text-base leading-snug line-clamp-4 opacity-90">
                      {note.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <button onClick={handleCreateEntry} className="mt-4 text-[#DFB6B2] hover:underline underline-offset-4">
              Create your first entry
            </button>
          </div>
        )}
      </div>

      {/* Quick Sticky Note Modal */}
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
              style={{ backgroundColor: quickNoteColor }}
              className="rounded-2xl w-full max-w-md p-6 text-[#190019] shadow-2xl relative border border-black/10"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-[#854F6C]" />
                  <h3 className="font-bold font-[var(--font-journal-display)] text-lg text-[#190019]">Quick Sticky Note</h3>
                </div>
                <button onClick={() => setShowQuickNoteModal(false)} className="text-black/50 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuickNote} className="space-y-4">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={quickNoteTitle}
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  className="w-full bg-white/70 border border-black/10 rounded-xl p-3 text-sm text-[#190019] font-bold outline-none shadow-inner"
                />

                <textarea
                  rows={4}
                  placeholder="Write quick note to pin on desk..."
                  value={quickNoteContent}
                  onChange={(e) => setQuickNoteContent(e.target.value)}
                  className="w-full bg-white/70 border border-black/10 rounded-xl p-3 text-xs text-[#190019] font-[var(--font-journal-handwriting)] text-base outline-none shadow-inner resize-none"
                />

                {/* Sticky Paper Color Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-black/60 tracking-wider mb-2 block font-[var(--font-journal-mono)]">Sticky Note Color</label>
                  <div className="flex gap-2">
                    {[
                      { name: 'Warm Cream', color: '#FBE4D8' },
                      { name: 'Mint Green', color: '#C5E1A5' },
                      { name: 'Pastel Yellow', color: '#FADFA1' },
                      { name: 'Sky Cyan', color: '#E2F1E7' },
                    ].map(c => (
                      <button
                        type="button"
                        key={c.color}
                        onClick={() => setQuickNoteColor(c.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${quickNoteColor === c.color ? 'border-black scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        style={{ backgroundColor: c.color }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickNoteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black/60 hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#190019] text-[#DFB6B2] hover:bg-[#522B5B] shadow transition-all"
                  >
                    Pin Sticky Note
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
