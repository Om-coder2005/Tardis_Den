import React from 'react';
import { useBookshelfStore } from '../store/useBookshelfStore';
import { Search, BookMarked, Compass, BookOpen, Globe, BookCheck } from 'lucide-react';

const CATEGORIES = [
  'Astronomy', 'Astrophysics', 'Black Holes', 'Space Exploration', 'Physics', 'Cosmology'
];

export const ArchiveSidebar: React.FC = () => {
  const { 
    currentCategory, 
    setCurrentCategory, 
    searchQuery, 
    setSearchQuery, 
    showFavoritesOnly, 
    setShowFavoritesOnly,
    activeSource,
    setActiveSource 
  } = useBookshelfStore();

  return (
    <div className="w-64 lg:w-72 shrink-0 h-full border-r border-[#1E293B] bg-[#0F172A] flex flex-col font-[var(--font-library-sans)] text-[#E2E8F0]">
      {/* Search Header */}
      <div className="p-6 pb-4 border-b border-[#1E293B]">
        <h2 className="text-xl font-[var(--font-library-serif)] font-semibold text-[#F8FAFC] mb-6 flex items-center gap-2 tracking-wide">
          <BookOpen className="w-5 h-5 text-[#C5A059]" />
          Knowledge Archive
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#94A3B8] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search volumes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#334155] rounded-lg py-2 pl-9 pr-4 text-sm focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all shadow-sm text-[#F8FAFC] placeholder:text-[#64748B]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 py-4 custom-scrollbar">
        
        {/* Archives Sources */}
        <div className="mb-8">
          <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 font-mono">Catalog Providers</h3>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => { setShowFavoritesOnly(false); setActiveSource('all'); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                !showFavoritesOnly && activeSource === 'all'
                  ? 'bg-[#334155] text-[#F8FAFC] border border-[#475569]/50' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#C5A059]" />
              All Catalogs
            </button>
            <button 
              onClick={() => { setShowFavoritesOnly(false); setActiveSource('gutendex'); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                !showFavoritesOnly && activeSource === 'gutendex'
                  ? 'bg-[#334155] text-[#F8FAFC] border border-[#475569]/50' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <BookCheck className="w-4 h-4 text-[#4CC9F0]" />
              Gutendex Free eBooks
            </button>
            <button 
              onClick={() => { setShowFavoritesOnly(false); setActiveSource('google'); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                !showFavoritesOnly && activeSource === 'google'
                  ? 'bg-[#334155] text-[#F8FAFC] border border-[#475569]/50' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#94A3B8]" />
              Google Books API
            </button>
          </nav>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 font-mono">Observatory Shelves</h3>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setShowFavoritesOnly(false); setSearchQuery(''); setCurrentCategory(cat); }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                  currentCategory === cat && !searchQuery && !showFavoritesOnly
                    ? 'font-semibold text-[#F8FAFC] bg-[#334155] border border-[#475569]/50' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Saved Items */}
        <div>
          <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 font-mono">Personal Vault</h3>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setShowFavoritesOnly(true)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                showFavoritesOnly
                  ? 'font-semibold text-[#F8FAFC] bg-[#334155] border border-[#475569]/50'
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <BookMarked className="w-4 h-4 text-[#C5A059]" />
              Saved Bookmarks
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
