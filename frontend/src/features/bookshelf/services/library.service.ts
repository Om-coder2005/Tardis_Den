import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

export interface LibraryRecord {
  contentId: string;
  isFavorite: boolean;
  progress: number;
  bookmarked: boolean;
  notes?: string;
  lastReadAt: string;
}

export const useLibraryRecords = () => {
  return useQuery({
    queryKey: ['libraryRecords'],
    queryFn: async () => {
      const { data } = await api.get<LibraryRecord[]>('/api/library/records');
      const map: Record<string, LibraryRecord> = {};
      data.forEach(r => { map[r.contentId] = r; });
      return map;
    },
  });
};

export const useUpdateLibraryRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentId, data }: { contentId: string; data: Partial<LibraryRecord> }) => {
      const res = await api.put(`/api/library/records/${encodeURIComponent(contentId)}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryRecords'] });
    },
  });
};
