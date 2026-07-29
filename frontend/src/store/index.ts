import { create } from 'zustand';
import api from '../lib/api';

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (passcode: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/api/auth/session');
      set({ isAuthenticated: !!data.authenticated });
    } catch {
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (passcode: string) => {
    try {
      await api.post('/api/auth/login', { passcode });
      set({ isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      set({ isAuthenticated: false });
    }
  },
}));

interface ThemeState {
  mode: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  toggle: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
}));

interface RoomState {
  focusedObjectId: string | null;
  hoveredObjectId: string | null;
  setFocusedObjectId: (id: string | null) => void;
  setHoveredObjectId: (id: string | null) => void;
  clearFocus: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  focusedObjectId: null,
  hoveredObjectId: null,
  setFocusedObjectId: (id) => set({ focusedObjectId: id }),
  setHoveredObjectId: (id) => set({ hoveredObjectId: id }),
  clearFocus: () => set({ focusedObjectId: null }),
}));

interface SettingsState {
  audioEnabled: boolean;
  toggleAudio: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  audioEnabled: true,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}));
