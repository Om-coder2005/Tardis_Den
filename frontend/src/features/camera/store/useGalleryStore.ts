import { create } from 'zustand';

interface GalleryState {
  viewMode: 'photobooth' | 'gallery';
  searchQuery: string;
  selectedAlbumId: string | null;
  selectedPhotoId: string | null;
  showFavoritesOnly: boolean;
  
  setViewMode: (mode: 'photobooth' | 'gallery') => void;
  setSearchQuery: (query: string) => void;
  setSelectedAlbumId: (id: string | null) => void;
  setSelectedPhotoId: (id: string | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  viewMode: 'photobooth',
  searchQuery: '',
  selectedAlbumId: null,
  selectedPhotoId: null,
  showFavoritesOnly: false,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedAlbumId: (id) => set({ selectedAlbumId: id, selectedPhotoId: null }),
  setSelectedPhotoId: (id) => set({ selectedPhotoId: id }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
}));
