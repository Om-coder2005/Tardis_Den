import { SearchRegistry } from './SearchRegistry';
import type { SearchResult } from './SearchRegistry';
import { useRoomStore } from '../../store';
import { useDesktopStore } from '../computer/store/useDesktopStore';

export function registerCoreSearchProviders() {
  
  // 1. Settings / Desktop
  SearchRegistry.registerProvider({
    name: 'DesktopProvider',
    search: async (query: string): Promise<SearchResult[]> => {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];
      
      if ('settings'.includes(q) || 'theme'.includes(q) || 'wallpaper'.includes(q) || 'audio'.includes(q) || 'volume'.includes(q) || 'appearance'.includes(q)) {
        results.push({
          id: 'settings-app',
          title: 'System Settings',
          category: 'Settings',
          description: 'Configure TARDIS Den appearance, audio, and preferences',
          action: () => {
            useRoomStore.getState().setFocusedObjectId('desk');
            setTimeout(() => {
              useDesktopStore.getState().openApp('settings', 'System Settings');
            }, 600);
          }
        });
      }
      
      return results;
    }
  });

  // 2. Bookshelf (Dummy implementation - will tie to actual books later)
  SearchRegistry.registerProvider({
    name: 'BookshelfProvider',
    search: async (query: string): Promise<SearchResult[]> => {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];
      
      if ('library'.includes(q) || 'books'.includes(q)) {
        results.push({
          id: 'module-bookshelf',
          title: 'Library',
          category: 'Books',
          description: 'Access the observatory bookshelf',
          action: () => {
            useRoomStore.getState().setFocusedObjectId('bookshelf');
          }
        });
      }
      
      return results;
    }
  });

  // 3. Telescope
  SearchRegistry.registerProvider({
    name: 'TelescopeProvider',
    search: async (query: string): Promise<SearchResult[]> => {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];
      
      if ('telescope'.includes(q) || 'stars'.includes(q) || 'cosmos'.includes(q)) {
        results.push({
          id: 'module-telescope',
          title: 'Telescope',
          category: 'Observations',
          description: 'Look through the telescope',
          action: () => {
            useRoomStore.getState().setFocusedObjectId('telescope');
          }
        });
      }
      
      return results;
    }
  });

  // 4. Journal
  SearchRegistry.registerProvider({
    name: 'JournalProvider',
    search: async (query: string): Promise<SearchResult[]> => {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];
      
      if ('journal'.includes(q) || 'notes'.includes(q) || 'log'.includes(q)) {
        results.push({
          id: 'module-journal',
          title: 'Captain\'s Journal',
          category: 'Journal',
          description: 'Read and write observatory logs',
          action: () => {
            useRoomStore.getState().setFocusedObjectId('journal');
          }
        });
      }
      
      return results;
    }
  });
}
