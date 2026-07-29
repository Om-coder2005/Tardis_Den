import { create } from 'zustand';

interface BookshelfState {
  currentCategory: string;
  searchQuery: string;
  selectedContentId: string | null;
  showFavoritesOnly: boolean;
  
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedContentId: (id: string | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
}

export const useBookshelfStore = create<BookshelfState>((set) => ({
  currentCategory: 'Astronomy',
  searchQuery: '',
  selectedContentId: null,
  showFavoritesOnly: false,

  setCurrentCategory: (category) => set({ currentCategory: category, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedContentId: (id) => set({ selectedContentId: id }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
}));
