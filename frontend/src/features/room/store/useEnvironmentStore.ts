import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';
export type Weather = 'clear' | 'cloudy' | 'rain' | 'stars';

interface EnvironmentState {
  timeOfDay: TimeOfDay;
  weather: Weather;
  autoMode: boolean;
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeather: (weather: Weather) => void;
  setAutoMode: (auto: boolean) => void;
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      timeOfDay: 'afternoon',
      weather: 'clear',
      autoMode: true,
      setTimeOfDay: (timeOfDay) => set({ timeOfDay, autoMode: false }), // manually setting disables auto
      setWeather: (weather) => set({ weather }),
      setAutoMode: (autoMode) => set({ autoMode }),
    }),
    {
      name: 'tardis-environment-storage',
    }
  )
);
