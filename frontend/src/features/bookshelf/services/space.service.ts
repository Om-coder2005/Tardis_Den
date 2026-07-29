import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

export interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
}

export interface AstrosData {
  number: number;
  people: { name: string; craft: string }[];
  message: string;
}

export const useApod = () => {
  return useQuery({
    queryKey: ['apod'],
    queryFn: async () => {
      const { data } = await api.get<ApodData>('/api/external/apod');
      return data;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours (APOD updates once a day)
  });
};

export const useAstros = () => {
  return useQuery({
    queryKey: ['astros'],
    queryFn: async () => {
      const { data } = await api.get<AstrosData>('/api/external/astros');
      return data;
    },
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
  });
};
