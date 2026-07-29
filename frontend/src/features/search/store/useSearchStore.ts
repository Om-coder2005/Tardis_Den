import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchRegistry } from '../SearchRegistry';
import type { SearchCategory, SearchResult } from '../SearchRegistry';

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  activeFilter: SearchCategory | 'All';
  selectedIndex: number;
  
  toggleSearch: () => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
  setFilter: (f: SearchCategory | 'All') => void;
  setSelectedIndex: (idx: number) => void;
  addRecentSearch: (q: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      query: '',
      results: [],
      recentSearches: [],
      activeFilter: 'All',
      selectedIndex: -1,
      
      toggleSearch: () => {
        set({ isOpen: !get().isOpen, query: '', results: [], selectedIndex: -1 });
      },
      closeSearch: () => set({ isOpen: false }),
      
      setQuery: async (query: string) => {
        set({ query, selectedIndex: -1 });
        if (!query.trim()) {
          set({ results: [] });
          return;
        }
        
        const results = await SearchRegistry.search(query);
        const filter = get().activeFilter;
        
        const filtered = filter === 'All' ? results : results.filter(r => r.category === filter);
        set({ results: filtered });
      },
      
      setFilter: async (activeFilter) => {
        set({ activeFilter });
        get().setQuery(get().query);
      },
      
      setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
      
      addRecentSearch: (query) => {
        if (!query.trim()) return;
        set(state => {
          const updated = [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 5);
          return { recentSearches: updated };
        });
      },
      
      clearHistory: () => set({ recentSearches: [] })
    }),
    {
      name: 'tardis-search-storage',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
