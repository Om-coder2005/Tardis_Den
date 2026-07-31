import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../../utils/imageOptimizer';

const API_BASE = '/api/external';

export interface UnifiedBookItem {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  publishYear?: number | string;
  description?: string;
  source: 'google' | 'gutendex' | 'openlibrary';
  downloadUrl?: string;
  readUrl?: string;
  fullTextAvailable: boolean;
  gutendexId?: number;
  categories?: string[];
}

// 1. Fetch Google Books API
export const useGoogleBooksQuery = (query: string) => {
  return useQuery({
    queryKey: ['google_books', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await axios.get(`${API_BASE}/google-books?q=${encodeURIComponent(query)}`);
      const items = res.data?.items || [];
      
      return items.map((item: any) => {
        const info = item.volumeInfo || {};
        const rawCover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
        const secureCover = rawCover.replace(/^http:/, 'https:');

        return {
          id: item.id,
          title: info.title || 'Untitled Volume',
          authors: info.authors || ['Unknown Author'],
          coverUrl: getOptimizedImageUrl(secureCover, { width: 300 }),
          publishYear: info.publishedDate ? info.publishedDate.substring(0, 4) : 'N/A',
          description: info.description || 'No detailed abstract recorded in archives.',
          source: 'google',
          readUrl: info.previewLink || info.infoLink,
          fullTextAvailable: false,
          categories: info.categories || [],
        } as UnifiedBookItem;
      });
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
};

// 2. Fetch Gutendex Free Public Domain eBooks
export const useGutendexQuery = (topic: string) => {
  return useQuery({
    queryKey: ['gutendex_books', topic],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/gutendex?topic=${encodeURIComponent(topic)}`);
      const results = res.data?.results || [];

      return results.map((book: any) => {
        const rawCover = book.formats?.['image/jpeg'] || '';
        const authorNames = book.authors ? book.authors.map((a: any) => a.name) : ['Classic Author'];

        return {
          id: `gutendex_${book.id}`,
          gutendexId: book.id,
          title: book.title,
          authors: authorNames,
          coverUrl: getOptimizedImageUrl(rawCover, { width: 300 }),
          publishYear: 'Classic',
          description: `Full-text public domain classic eBook (${book.download_count.toLocaleString()} downloads).`,
          source: 'gutendex',
          fullTextAvailable: true,
          categories: book.subjects?.slice(0, 3) || [],
        } as UnifiedBookItem;
      });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// 3. Fetch Full Text Content for In-App eBook Reader
export const useGutendexFullTextQuery = (bookId: number | null, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['gutendex_text', bookId],
    queryFn: async () => {
      if (!bookId) return '';
      const res = await axios.get(`${API_BASE}/gutendex/${bookId}/text`);
      return res.data?.text || 'Text content unavailable.';
    },
    enabled: !!bookId && enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
