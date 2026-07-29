import React, { useEffect } from 'react';
import { useSearchStore } from '../store/useSearchStore';

export const SearchShortcutListener: React.FC = () => {
  const toggleSearch = useSearchStore(state => state.toggleSearch);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return null;
};
