import { create } from 'zustand';

interface JournalState {
  searchQuery: string;
  selectedFolderId: string | null;
  selectedEntryId: string | null;
  showFavoritesOnly: boolean;
  
  setSearchQuery: (query: string) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedEntryId: (id: string | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  searchQuery: '',
  selectedFolderId: null,
  selectedEntryId: null,
  showFavoritesOnly: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id, selectedEntryId: null }),
  setSelectedEntryId: (id) => set({ selectedEntryId: id }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
}));
