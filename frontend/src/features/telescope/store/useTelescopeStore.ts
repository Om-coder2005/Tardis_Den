import { create } from 'zustand';

interface TelescopeState {
  currentCategory: string;
  searchQuery: string;
  selectedObservationId: string | null;
  showFavoritesOnly: boolean;
  activeView: 'catalog' | 'aladin' | 'neows' | 'iss' | 'constellations';
  
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedObservationId: (id: string | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setActiveView: (view: 'catalog' | 'aladin' | 'neows' | 'iss' | 'constellations') => void;
}

export const useTelescopeStore = create<TelescopeState>((set) => ({
  currentCategory: 'Galaxies',
  searchQuery: '',
  selectedObservationId: null,
  showFavoritesOnly: false,
  activeView: 'catalog',

  setCurrentCategory: (category) => set({ currentCategory: category, searchQuery: '', activeView: 'catalog' }),
  setSearchQuery: (query) => set({ searchQuery: query, activeView: 'catalog' }),
  setSelectedObservationId: (id) => set({ selectedObservationId: id }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
  setActiveView: (view) => set({ activeView: view }),
}));
