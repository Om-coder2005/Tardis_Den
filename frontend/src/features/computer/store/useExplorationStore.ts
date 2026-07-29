import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS } from './achievementsList';

export interface TimelineEvent {
  id: string;
  achievementId: string;
  timestamp: number;
}

export interface ExplorationStatistics {
  totalSessions: number;
  timeSpentSeconds: number;
  booksRead: number;
  journalEntries: number;
  telescopeObservations: number;
  photosTaken: number;
}

interface ExplorationState {
  unlockedAchievements: string[];
  timeline: TimelineEvent[];
  statistics: ExplorationStatistics;
  hasRunMigration: boolean;
  
  unlockAchievement: (id: string) => void;
  incrementStat: (stat: keyof ExplorationStatistics, amount?: number) => void;
  runMigration: (deps: any) => void; // Passed dependencies to avoid importing every store directly if possible, or we just import them
}

export const useExplorationStore = create<ExplorationState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      timeline: [],
      statistics: {
        totalSessions: 0,
        timeSpentSeconds: 0,
        booksRead: 0,
        journalEntries: 0,
        telescopeObservations: 0,
        photosTaken: 0,
      },
      hasRunMigration: false,

      unlockAchievement: (id: string) => {
        const { unlockedAchievements, timeline } = get();
        if (!unlockedAchievements.includes(id)) {
          // Check if achievement exists
          if (!ACHIEVEMENTS.find(a => a.id === id)) return;
          
          set({
            unlockedAchievements: [...unlockedAchievements, id],
            timeline: [
              { id: `tl_${Date.now()}_${id}`, achievementId: id, timestamp: Date.now() },
              ...timeline
            ]
          });
        }
      },

      incrementStat: (stat, amount = 1) => {
        set((state) => ({
          statistics: {
            ...state.statistics,
            [stat]: state.statistics[stat] + amount
          }
        }));
      },

      runMigration: (deps: any) => {
        if (get().hasRunMigration) return;
        
        console.log('[Exploration] Running one-time migration...');
        const { unlockAchievement } = get();
        
        // 1. Settings Migration
        if (deps.settings) {
          const { currentWallpaper, theme } = deps.settings;
          if (currentWallpaper !== '/wallpapers/javier-miranda-AlJ9TQqeCV0-unsplash.jpg') {
            unlockAchievement('des_wallpaper');
          }
          if (theme !== 'system') {
            unlockAchievement('des_theme');
          }
        }
        
        // 2. Room Migration
        if (deps.room) {
          if (deps.room.focusedObjectId) {
            unlockAchievement('exp_enter');
          }
        }

        set({ hasRunMigration: true });
      }
    }),
    {
      name: 'tardis-exploration-storage',
    }
  )
);
