import React from 'react';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from '../services/journal.service';
import { Star, Calendar, ArrowRight, PenTool, Trash2 } from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { searchQuery, selectedFolderId, showFavoritesOnly, setSelectedEntryId } = useJournalStore();
  const { data: entries = [] } = useJournalEntries({ folderId: selectedFolderId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined, type: 'journal' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();

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
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-[var(--font-journal-display)] font-bold text-[#DFB6B2] mb-3">
              {searchQuery ? `Search: "${searchQuery}"` : showFavoritesOnly ? 'Favorite Memories' : 'Observatory Log'}
            </h1>
            <p className="text-[#FBE4D8]/60 text-sm font-[var(--font-journal-mono)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <button 
            onClick={handleCreateEntry}
            className="flex items-center gap-3 bg-[#DFB6B2] hover:bg-[#FBE4D8] text-[#190019] px-6 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm"
          >
            <PenTool className="w-4 h-4" />
            <span>New Observation</span>
          </button>
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
    </div>
  );
};
