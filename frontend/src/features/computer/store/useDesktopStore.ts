import { create } from 'zustand';

export interface DesktopWindow {
  id: string;
  title: string;
  appId: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface DesktopState {
  hasBooted: boolean;
  wallpaper: string;
  windows: Record<string, DesktopWindow>;
  activeWindowId: string | null;
  
  setHasBooted: (booted: boolean) => void;
  setWallpaper: (url: string) => void;
  openApp: (appId: string, title: string) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
}

const DEFAULT_WALLPAPER = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2500&auto=format&fit=crop'; // A nice space/observatory wallpaper

export const useDesktopStore = create<DesktopState>((set) => ({
  hasBooted: false,
  wallpaper: localStorage.getItem('tardis_wallpaper') || DEFAULT_WALLPAPER,
  windows: {},
  activeWindowId: null,

  setHasBooted: (booted) => set({ hasBooted: booted }),
  
  setWallpaper: (url) => {
    localStorage.setItem('tardis_wallpaper', url);
    set({ wallpaper: url });
  },

  openApp: (appId, title) => set((state) => {
    const windowId = `win_${appId}_${Date.now()}`;
    const maxZ = Math.max(0, ...Object.values(state.windows).map(w => w.zIndex));
    
    // If the app is a singleton (like Settings), just focus it if it's already open
    const existingWindow = Object.values(state.windows).find(w => w.appId === appId);
    if (existingWindow) {
      return {
        activeWindowId: existingWindow.id,
        windows: {
          ...state.windows,
          [existingWindow.id]: {
            ...existingWindow,
            isMinimized: false,
            zIndex: maxZ + 1
          }
        }
      };
    }

    return {
      activeWindowId: windowId,
      windows: {
        ...state.windows,
        [windowId]: {
          id: windowId,
          appId,
          title,
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1
        }
      }
    };
  }),

  closeWindow: (windowId) => set((state) => {
    const newWindows = { ...state.windows };
    delete newWindows[windowId];
    return {
      windows: newWindows,
      activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId
    };
  }),

  focusWindow: (windowId) => set((state) => {
    if (state.activeWindowId === windowId) return state;
    const maxZ = Math.max(0, ...Object.values(state.windows).map(w => w.zIndex));
    return {
      activeWindowId: windowId,
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: false,
          zIndex: maxZ + 1
        }
      }
    };
  }),

  minimizeWindow: (windowId) => set((state) => ({
    windows: {
      ...state.windows,
      [windowId]: {
        ...state.windows[windowId],
        isMinimized: true
      }
    },
    activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId
  }))
}));
