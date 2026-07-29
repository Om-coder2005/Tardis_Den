import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../lib/api';
import { engine } from './AudioEngine';

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

export type RetroWindow = 'campfire' | 'nasa' | 'timer' | 'astros' | 'welcome';

export interface CampfireCard {
  id: string;
  title: string;
  question: string;
  category: 'tonight' | 'astronomy' | 'quiet' | 'memory';
  categoryLabel: string;
  subtext?: string;
}

export const CAMPFIRE_CARDS: CampfireCard[] = [
  {
    id: 'c1',
    title: "Tonight's Thought",
    question: "What moment today surprised you?",
    category: 'tonight',
    categoryLabel: "Tonight's Thought",
    subtext: "Unexpected turns and subtle shifts in perspective",
  },
  {
    id: 'c2',
    title: "Stargazer Reflection",
    question: "If you could spend one night observing with any astronomer, who would it be?",
    category: 'astronomy',
    categoryLabel: "Cosmic Inquiry",
    subtext: "Across centuries of night sky observers",
  },
  {
    id: 'c3',
    title: "Skyward Observation",
    question: "What made today's sky different?",
    category: 'quiet',
    categoryLabel: "Atmosphere & Light",
    subtext: "Noticing color, cloud shapes, or light shifts",
  },
  {
    id: 'c4',
    title: "Quiet Reflection",
    question: "What was a quiet sound today that felt comforting?",
    category: 'quiet',
    categoryLabel: "Sensory Detail",
    subtext: "Wind, rain, distant footsteps, or mechanical hums",
  },
  {
    id: 'c5',
    title: "Celestial Curiosity",
    question: "Which constellation or celestial object do you find yourself returning to in thought?",
    category: 'astronomy',
    categoryLabel: "Stargazer",
    subtext: "Familiar anchors in the night landscape",
  },
  {
    id: 'c6',
    title: "Memory Craft",
    question: "What is a memory from this past year that still feels vibrant like yesterday?",
    category: 'memory',
    categoryLabel: "Time & Memory",
    subtext: "Snapshots held in sharp clarity",
  },
  {
    id: 'c7',
    title: "Space & Solitude",
    question: "When did you last feel completely unhurried, even for just ten minutes?",
    category: 'tonight',
    categoryLabel: "Pacing & Rest",
    subtext: "Moments of stillness in motion",
  },
  {
    id: 'c8',
    title: "Cosmic Scale",
    question: "If you could view Earth from lunar orbit for one hour, what would you ponder?",
    category: 'astronomy',
    categoryLabel: "Overview Effect",
    subtext: "Looking back from deep space",
  },
  {
    id: 'c9',
    title: "Quiet Habit",
    question: "What ritual or small action helped ground you today?",
    category: 'quiet',
    categoryLabel: "Daily Practice",
    subtext: "Simple anchors in routine",
  },
  {
    id: 'c10',
    title: "Unanswered Question",
    question: "What is a question about the cosmos or yourself that you enjoy leaving unanswered?",
    category: 'astronomy',
    categoryLabel: "Open Mysteries",
    subtext: "Comfort in the unknown",
  },
];

export const AUDIO_TRACKS = [
  { id: 'interstellar', name: 'Interstellar Theme', file: '/audio/Interstellar Main Theme - Hans Zimmer (1).mp3' },
  { id: 'spiderman', name: 'Spider-Man', file: '/audio/01. Spider-Man.mp3' },
  { id: 'ghost', name: 'Way of the Ghost', file: '/audio/01. The Way of the Ghost.mp3' },
  { id: 'rain1', name: 'Rain', file: '/audio/05-Meydan-Rain(chosic.com).mp3' },
  { id: 'crescent', name: 'Crescent Moon', file: '/audio/Crescent-Moon(chosic.com).mp3' },
  { id: 'stars', name: 'Lofi Stars', file: '/audio/dayfox-lofi-stars-116946.mp3' },
  { id: 'meditation', name: 'Rain Meditation', file: '/audio/diepthanhdk-rain-meditation-450575.mp3' },
  { id: 'lalaland', name: 'La La Land', file: '/audio/lala_land_theme.mp3' },
  { id: 'space_cine', name: 'Cinematic Space', file: '/audio/leberch-cinematic-space-510707.mp3' },
  { id: 'space', name: 'Space', file: '/audio/leberch-space-440026.mp3' },
  { id: 'sleepy', name: 'Sleepy Rain', file: '/audio/lorenzobuczek-sleepy-rain-116521.mp3' },
  { id: 'oogway1', name: 'Oogway Ascends (Epic)', file: '/audio/Oogway Ascends - Epic Version.mp3' },
  { id: 'oogway2', name: 'Oogway Ascends (Original)', file: '/audio/Oogway Ascends _ Kung Fu Panda Theme by Hans Zimmer.mp3' },
  { id: 'solar', name: 'Solarflex Ambient', file: '/audio/solarflex-space-ambient-569588.mp3' },
  { id: 'clouds', name: 'Somewhere in the Clouds', file: '/audio/Somewhere-in-the-Clouds-Ambient-Relaxing-Music(chosic.com).mp3' },
  { id: 'transcend', name: 'Transcendence', file: '/audio/Transcendence-chosic.com_.mp3' },
];

interface DreamState {
  // Retro OS State
  activeWindows: RetroWindow[];
  toggleWindow: (win: RetroWindow) => void;
  openWindow: (win: RetroWindow) => void;
  closeWindow: (win: RetroWindow) => void;
  
  // Ambient Audio
  audioVolume: number;
  isPlaying: boolean;
  currentTrackId: string;
  setVolume: (volume: number) => void;
  toggleAudio: () => Promise<void>;
  playNextTrack: () => Promise<void>;
  playPreviousTrack: () => Promise<void>;
  selectTrack: (trackId: string) => Promise<void>;
  
  // Daily Content
  dailyQuote: ApodData | null;
  dailyFact: AstrosData | null;
  isLoadingContent: boolean;
  fetchDailyContent: () => Promise<void>;
  refreshDailyContent: () => Promise<void>;
  refreshAstronauts: () => Promise<void>;
  
  // Focus Timer
  timerDuration: number;
  timerRemaining: number;
  isTimerRunning: boolean;
  setTimerDuration: (minutes: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

export const useDreamStore = create<DreamState>()(
  persist(
    (set, get) => ({
      activeWindows: ['welcome', 'campfire', 'nasa'],
      
      toggleWindow: (win) => set((state) => ({
        activeWindows: state.activeWindows.includes(win) 
          ? state.activeWindows.filter(w => w !== win)
          : [...state.activeWindows, win]
      })),
      openWindow: (win) => set((state) => ({
        activeWindows: state.activeWindows.includes(win) ? state.activeWindows : [...state.activeWindows, win]
      })),
      closeWindow: (win) => set((state) => ({
        activeWindows: state.activeWindows.filter(w => w !== win)
      })),
      
      // Ambient Audio
      audioVolume: 0.5,
      isPlaying: false,
      currentTrackId: AUDIO_TRACKS[0].id,
      
      setVolume: (volume) => {
        const nextVolume = Math.max(0, Math.min(1, volume));
        set({ audioVolume: nextVolume });
        engine.setGlobalVolume(nextVolume);
      },
      
      toggleAudio: async () => {
        const state = get();
        if (state.isPlaying) {
          engine.pauseTrack();
          set({ isPlaying: false });
        } else {
          const track = AUDIO_TRACKS.find(t => t.id === state.currentTrackId) || AUDIO_TRACKS[0];
          engine.setGlobalVolume(state.audioVolume);
          const started = await engine.playTrack(track.file);
          set({ isPlaying: started });
        }
      },

      playNextTrack: async () => {
        const state = get();
        const currentIndex = AUDIO_TRACKS.findIndex(t => t.id === state.currentTrackId);
        const nextIndex = (currentIndex + 1) % AUDIO_TRACKS.length;
        const nextTrack = AUDIO_TRACKS[nextIndex];
        
        set({ currentTrackId: nextTrack.id });
        engine.setGlobalVolume(state.audioVolume);
        const started = await engine.playTrack(nextTrack.file);
        set({ isPlaying: started });
      },

      playPreviousTrack: async () => {
        const state = get();
        const currentIndex = AUDIO_TRACKS.findIndex(t => t.id === state.currentTrackId);
        const prevIndex = (currentIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
        const prevTrack = AUDIO_TRACKS[prevIndex];
        
        set({ currentTrackId: prevTrack.id });
        engine.setGlobalVolume(state.audioVolume);
        const started = await engine.playTrack(prevTrack.file);
        set({ isPlaying: started });
      },

      selectTrack: async (trackId) => {
        const state = get();
        const track = AUDIO_TRACKS.find(item => item.id === trackId);
        if (!track) return;

        set({ currentTrackId: track.id });
        if (state.isPlaying) {
          engine.setGlobalVolume(state.audioVolume);
          const started = await engine.playTrack(track.file);
          set({ isPlaying: started });
        }
      },
      
      // Daily Content
      dailyQuote: null,
      dailyFact: null,
      isLoadingContent: false,
      
      fetchDailyContent: async () => {
        const state = get();
        if (state.dailyQuote && state.dailyFact) return;
        
        set({ isLoadingContent: true });
        try {
          const [quoteRes, factRes] = await Promise.all([
            api.get('/api/external/apod'),
            api.get('/api/external/astros')
          ]);
          set({ 
            dailyQuote: quoteRes.data,
            dailyFact: factRes.data,
            isLoadingContent: false 
          });
        } catch (error) {
          console.error("Failed to fetch daily content", error);
          set({ isLoadingContent: false });
        }
      },

      refreshDailyContent: async () => {
        set({ isLoadingContent: true });
        try {
          const [quoteRes, factRes] = await Promise.all([
            api.get('/api/external/apod'),
            api.get('/api/external/astros')
          ]);
          set({
            dailyQuote: quoteRes.data,
            dailyFact: factRes.data,
            isLoadingContent: false
          });
        } catch (error) {
          console.error('Failed to refresh daily content', error);
          set({ isLoadingContent: false });
        }
      },

      refreshAstronauts: async () => {
        set({ isLoadingContent: true });
        try {
          const response = await api.get('/api/external/astros');
          set({ dailyFact: response.data, isLoadingContent: false });
        } catch (error) {
          console.error('Failed to refresh astronaut data', error);
          set({ isLoadingContent: false });
        }
      },
      
      // Focus Timer
      timerDuration: 25 * 60,
      timerRemaining: 25 * 60,
      isTimerRunning: false,
      
      setTimerDuration: (minutes) => set({ 
        timerDuration: minutes * 60, 
        timerRemaining: minutes * 60,
        isTimerRunning: false 
      }),
      
      toggleTimer: () => set((state) => {
        if (state.timerRemaining <= 0) {
          return { timerRemaining: state.timerDuration, isTimerRunning: true };
        }
        return { isTimerRunning: !state.isTimerRunning };
      }),
      
      resetTimer: () => set((state) => ({ 
        timerRemaining: state.timerDuration, 
        isTimerRunning: false 
      })),
      
      tickTimer: () => set((state) => {
        if (!state.isTimerRunning) return state;
        if (state.timerRemaining <= 1) {
          return { timerRemaining: 0, isTimerRunning: false };
        }
        return { timerRemaining: state.timerRemaining - 1 };
      })
    }),
    {
      name: 'tardis-retro-storage',
      partialize: (state) => ({
        audioVolume: state.audioVolume,
        activeWindows: state.activeWindows,
        timerDuration: state.timerDuration,
        currentTrackId: state.currentTrackId,
      }),
    }
  )
);
