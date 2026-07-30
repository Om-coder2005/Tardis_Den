import type { AIContextData } from '../../types/ai.types';

export const roomExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Room' };

  return {
    module: 'Room',
    title: data.activeRoom || 'Observatory Room',
    selectedObject: data.focusedObject ? { name: data.focusedObject } : undefined,
    userAction: data.userAction || 'Exploring Room',
  };
};
