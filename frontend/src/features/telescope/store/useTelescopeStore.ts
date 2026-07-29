import { create } from 'zustand';

interface TelescopeState {
  currentCategory: string;
  searchQuery: string;
  selectedObservationId: string | null;
  showFavoritesOnly: boolean;
  
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedObservationId: (id: string | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
}

export const useTelescopeStore = create<TelescopeState>((set) => ({
  currentCategory: 'Galaxies',
  searchQuery: '',
  selectedObservationId: null,
  showFavoritesOnly: false,

  setCurrentCategory: (category) => set({ currentCategory: category, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedObservationId: (id) => set({ selectedObservationId: id }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
}));
