export type SearchCategory = 'Books' | 'Observations' | 'Journal' | 'Photos' | 'Desktop' | 'Settings';

export interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  icon?: string;
  action: () => void; // The function called when the user selects this result
}

export interface SearchProvider {
  name: string;
  search: (query: string) => Promise<SearchResult[]>;
}

class SearchRegistryImpl {
  private providers: SearchProvider[] = [];

  registerProvider(provider: SearchProvider) {
    this.providers.push(provider);
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const results = await Promise.all(
      this.providers.map(p => p.search(query))
    );
    
    return results.flat();
  }
}

export const SearchRegistry = new SearchRegistryImpl();
