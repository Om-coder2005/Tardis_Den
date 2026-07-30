import type { AIContextData } from '../../types/ai.types';

export const bookshelfExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Bookshelf' };

  return {
    module: 'Bookshelf',
    title: data.title || data.bookTitle,
    selectedObject: data.selectedChapter ? { chapter: data.selectedChapter, page: data.page } : undefined,
    metadata: {
      author: data.author,
      progress: data.progress,
      tags: data.tags,
      categories: data.categories,
    },
    userAction: data.userAction || 'Reading',
    data: data.selectedText ? { excerpt: data.selectedText.slice(0, 500) } : undefined,
  };
};
