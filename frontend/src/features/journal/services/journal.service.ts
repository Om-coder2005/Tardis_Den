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
  mood?: string | null;
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

// LocalStorage Fallback Helpers & Initial Observatory Logbook Data
const LOCAL_ENTRIES_KEY = 'tardis_journal_entries_fallback';
const LOCAL_FOLDERS_KEY = 'tardis_journal_folders_fallback';

const INITIAL_OBSERVATORY_ENTRIES: JournalEntry[] = [];

const getLocalEntries = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ENTRIES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(INITIAL_OBSERVATORY_ENTRIES));
      return INITIAL_OBSERVATORY_ENTRIES;
    }
    const parsed: JournalEntry[] = JSON.parse(raw);
    const cleaned = parsed.filter(e => e.type !== 'pinned' && !e.id.startsWith('entry_obs_'));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return INITIAL_OBSERVATORY_ENTRIES;
  }
};

const saveLocalEntries = (entries: JournalEntry[]) => {
  localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(entries));
};

const getLocalFolders = (): JournalFolder[] => {
  try {
    const raw = localStorage.getItem(LOCAL_FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalFolders = (folders: JournalFolder[]) => {
  localStorage.setItem(LOCAL_FOLDERS_KEY, JSON.stringify(folders));
};

// --- Folders ---
export const useJournalFolders = () => {
  return useQuery({
    queryKey: ['journalFolders'],
    queryFn: async () => {
      try {
        const { data } = await api.get<JournalFolder[]>('/api/journal/folders');
        saveLocalFolders(data);
        return data;
      } catch (err) {
        console.warn('Backend unavailable, using local folders fallback.');
        return getLocalFolders();
      }
    },
  });
};

export const useCreateJournalFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      try {
        const { data } = await api.post<JournalFolder>('/api/journal/folders', { name });
        return data;
      } catch (err) {
        console.warn('Backend unavailable, creating folder locally.');
        const newFolder: JournalFolder = {
          id: `folder_${Date.now()}`,
          name,
          _count: { entries: 0 }
        };
        const current = getLocalFolders();
        const updated = [...current, newFolder];
        saveLocalFolders(updated);
        return newFolder;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journalFolders'] }),
  });
};

// --- Entries ---
export const useJournalEntries = (filters: { folderId?: string | null, search?: string, isFavorite?: boolean, type?: string }) => {
  return useQuery({
    queryKey: ['journalEntries', filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters.folderId) params.append('folderId', filters.folderId);
        if (filters.search) params.append('search', filters.search);
        if (filters.isFavorite) params.append('isFavorite', 'true');
        if (filters.type) params.append('type', filters.type);
        
        const { data } = await api.get<JournalEntry[]>(`/api/journal/entries?${params.toString()}`);
        if (data && data.length > 0) {
          saveLocalEntries(data);
          return data;
        }
        return getLocalEntries();
      } catch (err) {
        console.warn('Backend unavailable, using local entries fallback.');
        let list = getLocalEntries();

        if (filters.type) {
          list = list.filter(e => e.type === filters.type || (filters.type === 'journal' && (!e.type || e.type === 'journal')));
        }
        if (filters.folderId) {
          list = list.filter(e => e.folderId === filters.folderId);
        }
        if (filters.isFavorite) {
          list = list.filter(e => e.isFavorite);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(e => e.title?.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q));
        }
        return list;
      }
    },
  });
};

export const useJournalEntry = (id: string | null) => {
  return useQuery({
    queryKey: ['journalEntry', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data } = await api.get<JournalEntry>(`/api/journal/entries/${id}`);
        return data;
      } catch (err) {
        console.warn('Backend unavailable, getting local entry.');
        const list = getLocalEntries();
        return list.find(e => e.id === id) || null;
      }
    },
    enabled: !!id,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Partial<JournalEntry>) => {
      try {
        const { data } = await api.post<JournalEntry>('/api/journal/entries', entry);
        return data;
      } catch (err) {
        console.warn('Backend unavailable, creating entry locally.');
        const newEntry: JournalEntry = {
          id: `entry_${Date.now()}`,
          title: entry.title || 'Untitled Observation',
          content: entry.content || '',
          isDraft: false,
          isFavorite: false,
          folderId: entry.folderId || null,
          tags: entry.tags || [],
          mood: entry.mood || '🌌 Curious',
          type: entry.type || 'journal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const current = getLocalEntries();
        saveLocalEntries([newEntry, ...current]);
        return newEntry;
      }
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
      try {
        const { data: result } = await api.put<JournalEntry>(`/api/journal/entries/${id}`, data);
        return result;
      } catch (err) {
        console.warn('Backend unavailable, updating entry locally.');
        const list = getLocalEntries();
        const index = list.findIndex(e => e.id === id);
        if (index !== -1) {
          list[index] = {
            ...list[index],
            ...data,
            updatedAt: new Date().toISOString()
          };
          saveLocalEntries(list);
          return list[index];
        }
        throw new Error('Entry not found');
      }
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
      try {
        await api.delete(`/api/journal/entries/${id}`);
      } catch (err) {
        console.warn('Backend unavailable, deleting entry locally.');
        const list = getLocalEntries().filter(e => e.id !== id);
        saveLocalEntries(list);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalFolders'] });
    },
  });
};

export const uploadMedia = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<{ url: string }>('/api/journal/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  } catch (err) {
    console.warn('Backend unavailable, converting image to local Data URL.');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsDataURL(file);
    });
  }
};
