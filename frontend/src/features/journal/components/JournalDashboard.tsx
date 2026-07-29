import React from 'react';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry } from '../services/journal.service';
import { Star, Calendar, ArrowRight, PenTool } from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { searchQuery, selectedFolderId, showFavoritesOnly, setSelectedEntryId } = useJournalStore();
  const { data: entries = [] } = useJournalEntries({ folderId: selectedFolderId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined, type: 'journal' });
  const { data: pinnedNotes = [] } = useJournalEntries({ search: searchQuery, type: 'pinned' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: updateEntry } = useUpdateJournalEntry();

  const handleCreateEntry = () => {
    createEntry({ folderId: selectedFolderId, type: 'journal' }, {
      onSuccess: (data) => setSelectedEntryId(data.id)
    });
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
          
          <button 
            onClick={handleCreateEntry}
            className="flex items-center gap-3 bg-[#DFB6B2] hover:bg-[#FBE4D8] text-[#190019] px-6 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <PenTool className="w-5 h-5" />
            <span>New Observation</span>
          </button>
        </div>

        {/* Pinned Notes Strip */}
        {pinnedNotes.length > 0 && !showFavoritesOnly && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-[#854F6C] rounded-full" />
              <h2 className="text-2xl font-[var(--font-journal-display)] font-bold text-[#FBE4D8]">Pinned Notes</h2>
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
                  className="snap-start shrink-0 w-64 bg-[#FBE4D8] hover:bg-white text-[#190019] rounded-lg p-5 cursor-pointer shadow-[0_8px_16px_-6px_rgba(25,0,25,0.4)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative border border-[#DFB6B2] group"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#854F6C] uppercase tracking-widest font-[var(--font-journal-mono)]">
                        {note.linkedModule ? `Ref: ${note.linkedModule}` : 'Quick Note'}
                      </span>
                    </div>
                    <h3 className="font-[var(--font-journal-heading)] font-bold text-lg mb-1 leading-tight line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="font-[var(--font-journal-handwriting)] text-[#522B5B] text-base leading-snug line-clamp-4 opacity-80 group-hover:opacity-100 transition-opacity">
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
                {entry.isFavorite && <Star className="w-4 h-4 text-[#DFB6B2] fill-current" />}
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
    </div>
  );
};
