import type { AIContextData } from '../../types/ai.types';

export const desktopExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Desktop' };

  return {
    module: 'Desktop',
    title: data.activeApp || 'Desktop Environment',
    metadata: {
      openWindows: data.openWindows,
      currentWorkflow: data.currentWorkflow,
    },
    userAction: data.userAction || 'Navigating Desktop',
  };
};
