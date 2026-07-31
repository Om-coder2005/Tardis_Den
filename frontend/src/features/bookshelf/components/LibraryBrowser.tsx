import React from 'react';
import { useBookshelfStore } from '../store/useBookshelfStore';
import { useGoogleBooksQuery, useGutendexQuery } from '../services/bookServices';
import type { UnifiedBookItem } from '../services/bookServices';
import { useLibraryRecords } from '../services/library.service';
import { BookOpen, BookCheck, Globe, Library } from 'lucide-react';

export const LibraryBrowser: React.FC = () => {
  const { 
    currentCategory, 
    searchQuery, 
    setSelectedBook, 
    activeSource, 
    setActiveSource,
    showFavoritesOnly 
  } = useBookshelfStore();

  const { data: googleBooks = [], isLoading: loadingGoogle } = useGoogleBooksQuery(searchQuery || currentCategory);
  const { data: gutendexBooks = [], isLoading: loadingGutendex } = useGutendexQuery(currentCategory);
  const { data: records = {} } = useLibraryRecords();

  // Combine feeds
  let combinedBooks: UnifiedBookItem[] = [];
  if (activeSource === 'google') combinedBooks = googleBooks;
  else if (activeSource === 'gutendex') combinedBooks = gutendexBooks;
  else combinedBooks = [...gutendexBooks, ...googleBooks];

  if (showFavoritesOnly) {
    combinedBooks = combinedBooks.filter((b) => records[b.id]?.isFavorite);
  }

  const isLoading = loadingGoogle && loadingGutendex;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] text-[#F8FAFC] overflow-y-auto custom-scrollbar">
      
      {/* Top Header */}
      <div className="shrink-0 px-8 md:px-12 py-6 border-b border-[#1E293B] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-1.5 font-mono">
              {searchQuery ? 'Archive Index Search' : 'Observatory Knowledge Collection'}
            </p>
            <h1 className="text-3xl md:text-4xl font-[var(--font-library-serif)] font-bold text-[#F8FAFC]">
              {searchQuery ? `"${searchQuery}"` : `${currentCategory} Archives`}
            </h1>
          </div>
          
          {/* Source Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => setActiveSource('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSource === 'all' ? 'bg-[#C5A059] text-[#0B0F19]' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              All Archives
            </button>
            <button
              onClick={() => setActiveSource('gutendex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSource === 'gutendex' ? 'bg-[#4CC9F0] text-[#0B0F19]' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <BookCheck className="w-3.5 h-3.5" />
              Free eBooks (Full Text)
            </button>
            <button
              onClick={() => setActiveSource('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSource === 'google' ? 'bg-[#334155] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Google Books
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 md:p-12">
        
        {/* Grid Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-[var(--font-library-serif)] font-bold text-[#F8FAFC]">
            {showFavoritesOnly ? 'Bookmarked Classics' : 'Volumes'}
          </h3>
          <span className="text-xs text-[#94A3B8] font-mono">
            {isLoading ? 'Scanning archives...' : `${combinedBooks.length} records available`}
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {combinedBooks.map((item: UnifiedBookItem) => {
              const record = records[item.id];
              const isFavorite = record?.isFavorite || false;

              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedBook(item)}
                  className="group cursor-pointer flex flex-col transition-all duration-300 relative"
                >
                  {/* Book Cover */}
                  <div className="w-full aspect-[2/3] bg-[#1E293B] rounded-lg shadow-lg overflow-hidden mb-4 relative transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 border border-[#334155] group-hover:border-[#C5A059]/50">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0F172A] text-white font-[var(--font-library-serif)] border-l-4 border-[#C5A059] shadow-inner">
                        <span className="text-xs font-bold text-[#C5A059] uppercase font-mono">{item.source}</span>
                        <span className="text-sm font-bold line-clamp-3">{item.title}</span>
                        <span className="text-[10px] text-[#94A3B8]">{item.authors[0]}</span>
                      </div>
                    )}

                    {/* Full-Text Badge */}
                    {item.fullTextAvailable && (
                      <div className="absolute top-2 left-2 bg-[#4CC9F0] text-[#0B0F19] text-[9px] font-bold px-2 py-0.5 rounded shadow">
                        READABLE
                      </div>
                    )}

                    {/* Bookmarks */}
                    {isFavorite && (
                      <div className="absolute top-0 right-3">
                        <svg className="w-6 h-8 text-[#C5A059] fill-current drop-shadow-md" viewBox="0 0 24 32">
                          <path d="M0 0h24v32l-12-8-12 8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Typography */}
                  <h4 className="font-[var(--font-library-serif)] font-bold text-base text-[#F8FAFC] line-clamp-2 leading-snug mb-1 group-hover:text-[#C5A059] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] font-[var(--font-library-sans)] line-clamp-1 uppercase tracking-wider">
                    {item.authors.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        
        {!isLoading && combinedBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-[#94A3B8]">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-[var(--font-library-sans)] text-sm">The archives hold no records matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
