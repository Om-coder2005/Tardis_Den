import React, { useState } from 'react';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalFolders, useCreateJournalFolder } from '../services/journal.service';
import { Search, Plus, Star, BookOpen, Compass } from 'lucide-react';

export const JournalSidebar: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedFolderId, setSelectedFolderId, showFavoritesOnly, setShowFavoritesOnly } = useJournalStore();
  
  const { data: folders = [] } = useJournalFolders();
  const { mutate: createFolder } = useCreateJournalFolder();

  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="w-[300px] bg-[#190019] border-r border-[#854F6C]/20 flex flex-col h-full shrink-0 font-[var(--font-journal-body)] text-[#FBE4D8]">
      
      {/* Header & Search */}
      <div className="p-8 pb-6 border-b border-[#854F6C]/20 shrink-0">
        <h2 className="text-3xl font-[var(--font-journal-display)] font-bold text-[#DFB6B2] mb-8 tracking-wide">Journal</h2>
        
        <div className="relative group">
          <Search className="absolute left-4 top-3 text-[#DFB6B2]/50 w-4 h-4 group-focus-within:text-[#DFB6B2] transition-colors" />
          <input 
            type="text" 
            placeholder="Search observations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2B124C]/40 border border-[#854F6C]/30 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#FBE4D8] focus:border-[#DFB6B2] focus:bg-[#2B124C]/80 outline-none transition-all placeholder:text-[#DFB6B2]/30"
          />
        </div>
      </div>

      {/* Library Navigation */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        
        <div className="mb-10">
          <h3 className="px-4 text-[10px] font-bold text-[#DFB6B2]/40 uppercase tracking-[0.2em] mb-4 font-[var(--font-journal-mono)]">Observatory Library</h3>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => { setSelectedFolderId(null); setShowFavoritesOnly(false); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${!selectedFolderId && !showFavoritesOnly ? 'bg-[#522B5B] text-[#DFB6B2] shadow-sm font-medium' : 'text-[#FBE4D8]/70 hover:bg-[#2B124C]/50 hover:text-[#FBE4D8]'}`}
            >
              <Compass className="w-4 h-4" />
              <span>All Entries</span>
            </button>
            
            <button 
              onClick={() => { setSelectedFolderId(null); setShowFavoritesOnly(true); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${showFavoritesOnly ? 'bg-[#522B5B] text-[#DFB6B2] shadow-sm font-medium' : 'text-[#FBE4D8]/70 hover:bg-[#2B124C]/50 hover:text-[#FBE4D8]'}`}
            >
              <Star className="w-4 h-4" />
              <span>Favorite Memories</span>
            </button>
          </div>
        </div>

        {/* Collections */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[10px] font-bold text-[#DFB6B2]/40 uppercase tracking-[0.2em] font-[var(--font-journal-mono)]">Collections</h3>
            <button onClick={() => setIsCreatingFolder(true)} className="text-[#DFB6B2]/50 hover:text-[#DFB6B2] transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="mb-3 px-2">
              <input 
                autoFocus
                type="text" 
                placeholder="New collection name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => setIsCreatingFolder(false)}
                className="w-full bg-[#2B124C] border border-[#854F6C] rounded-lg p-2 text-sm text-[#FBE4D8] outline-none shadow-inner"
              />
            </form>
          )}

          <div className="flex flex-col gap-1.5">
            {folders.map(folder => (
              <button 
                key={folder.id}
                onClick={() => { setSelectedFolderId(folder.id); setShowFavoritesOnly(false); }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-300 group ${selectedFolderId === folder.id ? 'bg-[#522B5B] text-[#DFB6B2] shadow-sm font-medium' : 'text-[#FBE4D8]/70 hover:bg-[#2B124C]/50 hover:text-[#FBE4D8]'}`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 opacity-70" />
                  <span className="truncate max-w-[140px]">{folder.name}</span>
                </div>
                <span className={`text-[10px] font-[var(--font-journal-mono)] ${selectedFolderId === folder.id ? 'text-[#DFB6B2]/80' : 'text-[#DFB6B2]/30 group-hover:text-[#DFB6B2]/50'}`}>
                  {folder._count?.entries || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
