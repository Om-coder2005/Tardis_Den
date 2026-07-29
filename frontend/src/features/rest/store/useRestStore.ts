import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../lib/api';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
}

interface AstrosData {
  number: number;
  people: Array<{ name: string; craft: string }>;
}

export type RestActivity = 'quote' | 'fact' | 'reflection';

interface RestState {
  currentActivity: RestActivity;
  setActivity: (activity: RestActivity) => void;
  
  // Ambient Audio
  audioVolume: number;
  isPlaying: boolean;
  setVolume: (volume: number) => void;
  toggleAudio: () => void;
  
  // Daily Content
  dailyQuote: ApodData | null;
  dailyFact: AstrosData | null;
  isLoadingContent: boolean;
  fetchDailyContent: () => Promise<void>;
  
  // Focus Timer
  timerDuration: number;
  timerRemaining: number;
  isTimerRunning: boolean;
  setTimerDuration: (minutes: number) => void;
  setTimerRemaining: (seconds: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  
  // Reflection
  dailyReflection: string;
  setDailyReflection: (text: string) => void;
}

export const useRestStore = create<RestState>()(
  persist(
    (set, get) => ({
      currentActivity: 'quote',
      setActivity: (activity) => set({ currentActivity: activity }),
      
      // Ambient Audio
      audioVolume: 0.5,
      isPlaying: false,
      setVolume: (volume) => set({ audioVolume: volume }),
      toggleAudio: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      // Daily Content
      dailyQuote: null,
      dailyFact: null,
      isLoadingContent: false,
      fetchDailyContent: async () => {
        const state = get();
        if (state.dailyQuote && state.dailyFact) return; // Already cached
        
        set({ isLoadingContent: true });
        try {
          const [apodRes, astrosRes] = await Promise.allSettled([
            api.get('/api/external/apod'),
            api.get('/api/external/astros')
          ]);
          
          if (apodRes.status === 'fulfilled') {
            set({ dailyQuote: apodRes.value.data });
          }
          if (astrosRes.status === 'fulfilled') {
            set({ dailyFact: astrosRes.value.data });
          }
        } catch (error) {
          console.error("Failed to fetch daily content:", error);
        } finally {
          set({ isLoadingContent: false });
        }
      },
      
      // Focus Timer
      timerDuration: 25, // minutes
      timerRemaining: 25 * 60, // seconds
      isTimerRunning: false,
      setTimerDuration: (minutes) => set({ timerDuration: minutes, timerRemaining: minutes * 60, isTimerRunning: false }),
      setTimerRemaining: (seconds) => set({ timerRemaining: seconds }),
      toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),
      resetTimer: () => set((state) => ({ timerRemaining: state.timerDuration * 60, isTimerRunning: false })),
      
      // Reflection
      dailyReflection: '',
      setDailyReflection: (text) => set({ dailyReflection: text }),
    }),
    {
      name: 'tardis-rest-storage',
      partialize: (state) => ({
        audioVolume: state.audioVolume,
        dailyReflection: state.dailyReflection,
        timerDuration: state.timerDuration,
        currentActivity: state.currentActivity,
      }),
    }
  )
);
