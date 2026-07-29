import React from 'react';
import { useBookshelfStore } from '../store/useBookshelfStore';
import { useOpenLibrary, useOpenLibrarySearch } from '../services/openlibrary.service';
import type { OpenLibraryBook } from '../services/openlibrary.service';
import { useApod, useAstros } from '../services/space.service';
import { useLibraryRecords } from '../services/library.service';
import { BookOpen, Sparkles } from 'lucide-react';

export const LibraryBrowser: React.FC = () => {
  const { currentCategory, searchQuery, setSelectedContentId } = useBookshelfStore();
  const { data: categoryBooks = [], isLoading: isLoadingCategory } = useOpenLibrary(currentCategory);
  const { data: searchBooks = [], isLoading: isLoadingSearch } = useOpenLibrarySearch(searchQuery);
  const { data: apod } = useApod();
  const { data: astros } = useAstros();
  const { data: records = {} } = useLibraryRecords();

  const activeBooks = searchQuery ? searchBooks : categoryBooks;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingCategory;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] text-[#F8FAFC] overflow-y-auto custom-scrollbar">
      
      {/* Top Editorial Header */}
      <div className="shrink-0 px-8 md:px-12 py-6 border-b border-[#1E293B] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-1.5 font-mono">
              {searchQuery ? 'Search Results' : 'Observatory Collection'}
            </p>
            <h1 className="text-3xl md:text-4xl font-[var(--font-library-serif)] font-bold text-[#F8FAFC]">
              {searchQuery ? `"${searchQuery}"` : currentCategory}
            </h1>
          </div>
          
          {astros && !searchQuery && (
            <div className="hidden md:flex items-center gap-2 bg-[#1E293B] px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#334155] text-[#CBD5E1]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {astros.number} Humans in Orbit
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 md:p-12">
        
        {/* APOD Hero Banner */}
        {!searchQuery && apod && (
          <div className="relative w-full h-72 rounded-xl overflow-hidden shrink-0 mb-12 shadow-2xl border border-[#1E293B] group">
            <img src={apod.hdurl || apod.url} alt={apod.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-2 font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Featured Reading</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-[var(--font-library-serif)] font-bold text-white mb-3 leading-tight max-w-3xl">{apod.title}</h2>
              <p className="text-xs md:text-sm text-[#CBD5E1] max-w-2xl line-clamp-2 font-[var(--font-library-sans)] leading-relaxed">{apod.explanation}</p>
            </div>
          </div>
        )}

        {/* Grid Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-[var(--font-library-serif)] font-bold text-[#F8FAFC]">
            {searchQuery ? 'Matches' : 'Curated Shelves'}
          </h3>
          <span className="text-xs text-[#94A3B8] font-mono">
            {isLoading ? 'Loading...' : `${activeBooks.length} items`}
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {activeBooks.map((item: OpenLibraryBook) => {
              const record = records[item.key];
              const isFavorite = record?.isFavorite || false;

              return (
                <div 
                  key={item.key}
                  onClick={() => setSelectedContentId(item.key)}
                  className="group cursor-pointer flex flex-col transition-all duration-300 relative"
                >
                  {/* Editorial Book Cover */}
                  <div className="w-full aspect-[2/3] bg-[#1E293B] rounded-lg shadow-lg overflow-hidden mb-4 relative transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 border border-[#334155] group-hover:border-[#C5A059]/50">
                    {item.cover_id ? (
                      <img src={`https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg`} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-[#0F172A] text-white font-[var(--font-library-serif)] border-l-4 border-[#C5A059] text-center text-sm shadow-inner">
                        {item.title}
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
                  <h4 className="font-[var(--font-library-serif)] font-bold text-base text-[#F8FAFC] line-clamp-2 leading-snug mb-1 group-hover:text-[#C5A059] transition-colors">{item.title}</h4>
                  <p className="text-xs text-[#94A3B8] font-[var(--font-library-sans)] line-clamp-1 uppercase tracking-wider">{item.authors?.join(', ') || 'Unknown'}</p>
                </div>
              );
            })}
          </div>
        )}
        
        {!isLoading && activeBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-[#94A3B8]">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-[var(--font-library-sans)] text-sm">The archives hold no records matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
