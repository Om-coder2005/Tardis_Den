import { create } from 'zustand';
import type { UnifiedBookItem } from '../services/bookServices';

interface BookshelfState {
  currentCategory: string;
  searchQuery: string;
  selectedContentId: string | null;
  selectedBook: UnifiedBookItem | null;
  showFavoritesOnly: boolean;
  activeSource: 'all' | 'google' | 'gutendex';
  readingBookId: number | null;
  
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedContentId: (id: string | null) => void;
  setSelectedBook: (book: UnifiedBookItem | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setActiveSource: (source: 'all' | 'google' | 'gutendex') => void;
  setReadingBookId: (id: number | null) => void;
}

export const useBookshelfStore = create<BookshelfState>((set) => ({
  currentCategory: 'Astronomy',
  searchQuery: '',
  selectedContentId: null,
  selectedBook: null,
  showFavoritesOnly: false,
  activeSource: 'all',
  readingBookId: null,

  setCurrentCategory: (category) => set({ currentCategory: category, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedContentId: (id) => set({ selectedContentId: id }),
  setSelectedBook: (book) => set({ selectedBook: book, selectedContentId: book ? book.id : null }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
  setActiveSource: (source) => set({ activeSource: source }),
  setReadingBookId: (id) => set({ readingBookId: id }),
}));
