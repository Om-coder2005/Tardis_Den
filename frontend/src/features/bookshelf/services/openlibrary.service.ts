import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface OpenLibraryBook {
  key: string;
  title: string;
  authors: string[];
  cover_id: number | null;
  first_publish_year: number | null;
  edition_count: number | null;
  subject: string[];
}

const mapBookData = (work: any): OpenLibraryBook => {
  const authorNames = work.authors 
    ? work.authors.map((a: any) => a.name) 
    : work.author_name || [];
  const subjects = Array.isArray(work.subject)
    ? work.subject
    : Array.isArray(work.subjects)
      ? work.subjects
      : [];

  return {
    key: work.key, // e.g. "/works/OL12345W"
    title: work.title,
    authors: authorNames,
    cover_id: work.cover_id || work.cover_i || null,
    first_publish_year: work.first_publish_year || null,
    edition_count: work.edition_count || null,
    subject: subjects,
  };
};

export const useOpenLibrary = (category: string) => {
  return useQuery({
    queryKey: ['openlibrary', category],
    queryFn: async () => {
      const subjectKey = category.toLowerCase().replace(/\s+/g, '_');
      const res = await axios.get(`https://openlibrary.org/subjects/${subjectKey}.json?limit=24`);
      return (res.data.works || []).map(mapBookData) as OpenLibraryBook[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};

export const useOpenLibrarySearch = (query: string) => {
  return useQuery({
    queryKey: ['openlibrary_search', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=24`);
      return (res.data.docs || []).map(mapBookData) as OpenLibraryBook[];
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 60,
  });
};
