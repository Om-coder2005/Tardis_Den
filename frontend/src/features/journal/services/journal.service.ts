import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

export interface JournalFolder {
  id: string;
  name: string;
  _count?: { entries: number };
}

export interface JournalEntry {
  id: string;
  title: string;
  content?: string;
  isDraft: boolean;
  isFavorite: boolean;
  folderId: string | null;
  tags: string[];
  type?: string;
  linkedModule?: string | null;
  linkedEntityId?: string | null;
  x?: number | null;
  y?: number | null;
  color?: string | null;
  updatedAt: string;
  createdAt: string;
  versions?: JournalVersion[];
}

export interface JournalVersion {
  id: string;
  content: string;
  createdAt: string;
}

// --- Folders ---
export const useJournalFolders = () => {
  return useQuery({
    queryKey: ['journalFolders'],
    queryFn: async () => {
      const { data } = await api.get<JournalFolder[]>('/api/journal/folders');
      return data;
    },
  });
};

export const useCreateJournalFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<JournalFolder>('/api/journal/folders', { name });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journalFolders'] }),
  });
};

// --- Entries ---
export const useJournalEntries = (filters: { folderId?: string | null, search?: string, isFavorite?: boolean, type?: string }) => {
  return useQuery({
    queryKey: ['journalEntries', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.folderId) params.append('folderId', filters.folderId);
      if (filters.search) params.append('search', filters.search);
      if (filters.isFavorite) params.append('isFavorite', 'true');
      if (filters.type) params.append('type', filters.type);
      
      const { data } = await api.get<JournalEntry[]>(`/api/journal/entries?${params.toString()}`);
      return data;
    },
  });
};

export const useJournalEntry = (id: string | null) => {
  return useQuery({
    queryKey: ['journalEntry', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get<JournalEntry>(`/api/journal/entries/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Partial<JournalEntry>) => {
      const { data } = await api.post<JournalEntry>('/api/journal/entries', entry);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalFolders'] });
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JournalEntry> }) => {
      const { data: result } = await api.put<JournalEntry>(`/api/journal/entries/${id}`, data);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalEntry', variables.id] });
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/journal/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalFolders'] });
    },
  });
};

export const uploadMedia = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ url: string }>('/api/journal/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.url;
};
