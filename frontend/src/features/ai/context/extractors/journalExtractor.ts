import type { AIContextData } from '../../types/ai.types';

export const journalExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Journal' };

  return {
    module: 'Journal',
    title: data.title || 'Journal Entry',
    metadata: {
      tags: data.tags,
      date: data.createdAt || data.date,
      mood: data.mood,
    },
    userAction: data.userAction || 'Writing',
    data: data.content ? { entryExcerpt: data.content.slice(0, 600) } : undefined,
  };
};
