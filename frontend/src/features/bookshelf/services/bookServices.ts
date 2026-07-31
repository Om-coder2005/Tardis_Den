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

// 1. Fetch OpenLibrary Books (Direct Client Request - Guaranteed Fallback)
export const useOpenLibraryQuery = (category: string, query: string) => {
  return useQuery({
    queryKey: ['openlibrary_unified', category, query],
    queryFn: async () => {
      try {
        if (query) {
          const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=24`);
          const docs = res.data?.docs || [];
          return docs.map((work: any) => {
            const coverId = work.cover_i || work.cover_id;
            const coverRaw = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '';
            return {
              id: work.key || `ol_${Math.random()}`,
              title: work.title || 'Untitled',
              authors: work.author_name || ['Unknown Author'],
              coverUrl: coverRaw ? getOptimizedImageUrl(coverRaw, { width: 300 }) : '',
              publishYear: work.first_publish_year || 'N/A',
              description: 'OpenLibrary Record',
              source: 'openlibrary',
              readUrl: `https://openlibrary.org${work.key}`,
              fullTextAvailable: false,
            } as UnifiedBookItem;
          });
        }

        const subjectKey = category.toLowerCase().replace(/\s+/g, '_');
        const res = await axios.get(`https://openlibrary.org/subjects/${subjectKey}.json?limit=24`);
        const works = res.data?.works || [];
        return works.map((work: any) => {
          const coverId = work.cover_id || work.cover_i;
          const coverRaw = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '';
          const authorNames = work.authors ? work.authors.map((a: any) => a.name) : ['Unknown Author'];
          return {
            id: work.key || `ol_${Math.random()}`,
            title: work.title || 'Untitled',
            authors: authorNames,
            coverUrl: coverRaw ? getOptimizedImageUrl(coverRaw, { width: 300 }) : '',
            publishYear: work.first_publish_year || 'N/A',
            description: 'OpenLibrary Record',
            source: 'openlibrary',
            readUrl: `https://openlibrary.org${work.key}`,
            fullTextAvailable: false,
          } as UnifiedBookItem;
        });
      } catch (err) {
        console.error('OpenLibrary query error:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
  });
};

// 2. Fetch Google Books API
export const useGoogleBooksQuery = (query: string) => {
  return useQuery({
    queryKey: ['google_books', query],
    queryFn: async () => {
      if (!query) return [];
      try {
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
            coverUrl: secureCover ? getOptimizedImageUrl(secureCover, { width: 300 }) : '',
            publishYear: info.publishedDate ? info.publishedDate.substring(0, 4) : 'N/A',
            description: info.description || 'No detailed abstract recorded in archives.',
            source: 'google',
            readUrl: info.previewLink || info.infoLink,
            fullTextAvailable: false,
            categories: info.categories || [],
          } as UnifiedBookItem;
        });
      } catch (err) {
        console.warn('Google Books API query error:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
  });
};

// 3. Fetch Gutendex Free Public Domain eBooks
export const useGutendexQuery = (topic: string, query: string) => {
  return useQuery({
    queryKey: ['gutendex_books', topic, query],
    queryFn: async () => {
      try {
        const searchTerm = query || topic || 'science';
        let res = await axios.get(`${API_BASE}/gutendex?topic=${encodeURIComponent(searchTerm)}`);
        let results = res.data?.results || [];

        if (results.length === 0) {
          res = await axios.get(`${API_BASE}/gutendex?q=${encodeURIComponent(searchTerm)}`);
          results = res.data?.results || [];
        }

        return results.map((book: any) => {
          const rawCover = book.formats?.['image/jpeg'] || '';
          const authorNames = book.authors ? book.authors.map((a: any) => a.name) : ['Classic Author'];

          return {
            id: `gutendex_${book.id}`,
            gutendexId: book.id,
            title: book.title,
            authors: authorNames,
            coverUrl: rawCover ? getOptimizedImageUrl(rawCover, { width: 300 }) : '',
            publishYear: 'Classic',
            description: `Full-text public domain classic eBook (${book.download_count?.toLocaleString() || 0} downloads).`,
            source: 'gutendex',
            fullTextAvailable: true,
            categories: book.subjects?.slice(0, 3) || [],
          } as UnifiedBookItem;
        });
      } catch (err) {
        console.warn('Gutendex query error:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
  });
};

// 4. Fetch Full Text Content for In-App eBook Reader
export const useGutendexFullTextQuery = (bookId: number | null, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['gutendex_text', bookId],
    queryFn: async () => {
      if (!bookId) return '';
      try {
        const res = await axios.get(`${API_BASE}/gutendex/${bookId}/text`);
        return res.data?.text || 'Text content unavailable.';
      } catch (err) {
        return 'Text content unavailable for this volume.';
      }
    },
    enabled: !!bookId && enabled,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
