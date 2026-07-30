import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'day' | 'night' | 'system';
export type AccentColor = 'brass' | 'blue' | 'green' | 'burgundy';
export type WallpaperType = 'astronomy' | 'observatory' | 'minimal';

export interface CustomWallpaper {
  id: string;
  name: string;
  url: string;
}

interface SettingsState {
  // Appearance
  theme: ThemeMode;
  accentColor: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  
  // Wallpaper
  currentWallpaper: string;
  wallpaperCategory: WallpaperType;
  customWallpapers: CustomWallpaper[];
  setWallpaper: (wallpaperPath: string) => void;
  setWallpaperCategory: (category: WallpaperType) => void;
  addCustomWallpaper: (wallpaper: CustomWallpaper) => void;
  removeCustomWallpaper: (id: string) => void;
  
  // Audio
  masterVolume: number;
  ambientVolume: number;
  uiVolume: number;
  isMuted: boolean;
  setMasterVolume: (v: number) => void;
  setAmbientVolume: (v: number) => void;
  setUiVolume: (v: number) => void;
  toggleMute: () => void;
  
  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  largeFonts: boolean;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleLargeFonts: () => void;
  
  // Performance
  performanceMode: 'high' | 'balanced' | 'performance';
  setPerformanceMode: (mode: 'high' | 'balanced' | 'performance') => void;
  
  resetToDefaults: () => void;
}

const defaultState = {
  theme: 'system' as ThemeMode,
  accentColor: 'brass' as AccentColor,
  currentWallpaper: '/wallpapers/javier-miranda-AlJ9TQqeCV0-unsplash.jpg',
  wallpaperCategory: 'astronomy' as WallpaperType,
  customWallpapers: [] as CustomWallpaper[],
  masterVolume: 1.0,
  ambientVolume: 0.5,
  uiVolume: 0.8,
  isMuted: false,
  reducedMotion: false,
  highContrast: false,
  largeFonts: false,
  performanceMode: 'balanced' as const,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      
      setWallpaper: (currentWallpaper) => set({ currentWallpaper }),
      setWallpaperCategory: (wallpaperCategory) => set({ wallpaperCategory }),
      addCustomWallpaper: (wallpaper) => set((state) => ({
        customWallpapers: [wallpaper, ...state.customWallpapers],
        currentWallpaper: wallpaper.url
      })),
      removeCustomWallpaper: (id) => set((state) => ({
        customWallpapers: state.customWallpapers.filter(w => w.id !== id),
        currentWallpaper: state.currentWallpaper === state.customWallpapers.find(w => w.id === id)?.url 
          ? defaultState.currentWallpaper 
          : state.currentWallpaper
      })),
      
      setMasterVolume: (masterVolume) => set({ masterVolume, isMuted: false }),
      setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
      setUiVolume: (uiVolume) => set({ uiVolume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleLargeFonts: () => set((state) => ({ largeFonts: !state.largeFonts })),
      
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
      
      resetToDefaults: () => set(defaultState),
    }),
    {
      name: 'tardis-settings-storage',
    }
  )
);
