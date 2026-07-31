import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

const API_BASE = '/api/external';

export interface DynamicMusicTrack {
  id: string;
  name: string;
  artist: string;
  audio: string;
  image?: string;
  duration?: number;
}

export interface MindfulnessQuote {
  quote: string;
  author: string;
}

// 1. Fetch Dynamic Music Tracks from Free Music API
export const useDynamicMusicQuery = (genreTag: string = 'chillout') => {
  return useQuery({
    queryKey: ['dynamic_music', genreTag],
    queryFn: async () => {
      try {
        const res = await api.get(`${API_BASE}/music?tag=${encodeURIComponent(genreTag)}`);
        return (res.data || []) as DynamicMusicTrack[];
      } catch (err) {
        console.warn('Music API query error:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

// 2. Fetch Daily Mindfulness Quote from ZenQuotes API
export const useMindfulnessQuoteQuery = () => {
  return useQuery({
    queryKey: ['daily_mindfulness_quote'],
    queryFn: async () => {
      try {
        const res = await api.get(`${API_BASE}/quote`);
        return res.data as MindfulnessQuote;
      } catch (err) {
        return {
          quote: "Look up at the stars and not down at your feet. Try to make sense of what you see.",
          author: "Stephen Hawking"
        };
      }
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });
};
