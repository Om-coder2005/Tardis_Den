import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '../store/useSearchStore';

export const SearchOverlay: React.FC = () => {
  const { 
    isOpen, query, setQuery, results, 
    selectedIndex, setSelectedIndex, 
    closeSearch, addRecentSearch, recentSearches
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          const result = results[selectedIndex];
          addRecentSearch(query);
          closeSearch();
          result.action();
        } else if (results.length > 0) {
          const result = results[0];
          addRecentSearch(query);
          closeSearch();
          result.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, query, closeSearch, addRecentSearch, setSelectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <motion.div 
            className="w-full max-w-2xl bg-[var(--color-bg-panel-val)] border-2 border-[var(--color-border-val)] shadow-2xl rounded-lg overflow-hidden flex flex-col"
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-[var(--color-border-val)] bg-[var(--color-bg-panel-val)]">
              <svg className="w-6 h-6 mr-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search TARDIS Den..."
                className="flex-1 bg-transparent text-xl outline-none font-bold placeholder-opacity-40"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="text-xs opacity-50 border border-[var(--color-border-val)] px-2 py-1 rounded">ESC</span>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query.trim() && recentSearches.length > 0 && (
                <div className="p-4 opacity-70">
                  <h4 className="text-xs uppercase font-bold mb-3 tracking-widest">Recent Searches</h4>
                  <ul className="space-y-2">
                    {recentSearches.map((s, i) => (
                      <li 
                        key={i} 
                        className="cursor-pointer hover:text-[var(--color-accent-val)]"
                        onClick={() => setQuery(s)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="p-8 text-center opacity-50">
                  No results found for "{query}"
                </div>
              )}

              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    selectedIndex === index 
                      ? 'bg-[var(--color-accent-val)] text-[var(--color-bg-panel-val)]' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  onClick={() => {
                    addRecentSearch(query);
                    closeSearch();
                    result.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div>
                    <h4 className="font-bold">{result.title}</h4>
                    <p className="text-xs opacity-70">{result.description}</p>
                  </div>
                  <span className="text-xs uppercase opacity-50 font-bold tracking-widest">{result.category}</span>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="bg-[var(--color-bg-titlebar-val)] text-[var(--color-text-title-val)] p-2 text-xs flex justify-between items-center opacity-80">
              <span>Use arrows to navigate</span>
              <span>Enter to select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
