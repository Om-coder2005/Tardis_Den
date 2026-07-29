import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

export interface PhotoAlbum {
  id: string;
  name: string;
  _count?: { photos: number };
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  archiveNote: string | null;
  isFavorite: boolean;
  albumId: string | null;
  album?: PhotoAlbum | null;
  createdAt: string;
  updatedAt: string;
}

const getApiBaseUrl = () => api.defaults.baseURL || window.location.origin;

export const resolvePhotoUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith('data:')) return url;

  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, '');

  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      const apiOrigin = new URL(apiBaseUrl).origin;
      return `${apiOrigin}${parsedUrl.pathname}`;
    }
    return url;
  } catch {
    return `${apiBaseUrl}/${url.replace(/^\/+/, '')}`;
  }
};

// --- Albums ---
export const useAlbums = () => {
  return useQuery({
    queryKey: ['photoAlbums'],
    queryFn: async () => {
      const { data } = await api.get<PhotoAlbum[]>('/api/photos/albums');
      return data;
    },
  });
};

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<PhotoAlbum>('/api/photos/albums', { name });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photoAlbums'] }),
  });
};

// --- Photos ---
export const usePhotos = (filters: { albumId?: string | null, search?: string, isFavorite?: boolean }) => {
  return useQuery({
    queryKey: ['photos', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.albumId) params.append('albumId', filters.albumId);
      if (filters.search) params.append('search', filters.search);
      if (filters.isFavorite) params.append('isFavorite', 'true');
      
      const { data } = await api.get<Photo[]>(`/api/photos?${params.toString()}`);
      return data;
    },
  });
};

export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Photo> }) => {
      const { data: result } = await api.put<Photo>(`/api/photos/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photoAlbums'] });
    },
  });
};

export const useCapturePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { imageBase64: string; albumId?: string | null }) => {
      const { data } = await api.post<Photo>('/api/photos/capture', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photoAlbums'] });
    },
  });
};
