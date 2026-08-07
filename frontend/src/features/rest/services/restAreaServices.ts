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
  sourceType?: 'preset' | 'local' | 'online' | 'custom_url';
  isLocal?: boolean;
}

export interface MindfulnessQuote {
  quote: string;
  author: string;
}

export const FALLBACK_ONLINE_TRACKS: DynamicMusicTrack[] = [
  {
    id: 'online_fallback_lofi_1',
    name: 'Chill Lofi Radio Stream',
    artist: 'Online Chill Radio',
    audio: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    sourceType: 'online',
  },
  {
    id: 'online_fallback_ambient_2',
    name: 'Deep Space Ambient',
    artist: 'Cosmic Soundscapes',
    audio: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=space-ambient-112195.mp3',
    sourceType: 'online',
  },
  {
    id: 'online_fallback_synth_3',
    name: 'Synthwave Night Ride',
    artist: 'Retro Wave Online',
    audio: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=synthwave-80s-110045.mp3',
    sourceType: 'online',
  },
  {
    id: 'online_fallback_rain_4',
    name: 'Soft Rain & Piano',
    artist: 'Calm Sanctuary',
    audio: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884488820c.mp3?filename=relaxing-mountains-rivers-streams-11019.mp3',
    sourceType: 'online',
  }
];

// 1. Fetch Dynamic Music Tracks from Free Music API with Fallbacks
export const useDynamicMusicQuery = (genreTag: string = 'chillout') => {
  return useQuery({
    queryKey: ['dynamic_music', genreTag],
    queryFn: async () => {
      try {
        const res = await api.get(`${API_BASE}/music?tag=${encodeURIComponent(genreTag)}`);
        const tracks = (res.data || []) as DynamicMusicTrack[];
        if (Array.isArray(tracks) && tracks.length > 0) {
          return tracks.map(t => ({ ...t, sourceType: 'online' as const }));
        }
        return FALLBACK_ONLINE_TRACKS;
      } catch (err) {
        console.warn('Music API query error, using online fallbacks:', err);
        return FALLBACK_ONLINE_TRACKS;
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
