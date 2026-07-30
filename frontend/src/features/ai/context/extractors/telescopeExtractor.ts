import type { AIContextData } from '../../types/ai.types';

export const telescopeExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Telescope' };

  return {
    module: 'Telescope',
    title: data.name || data.title || 'Celestial Observation',
    selectedObject: data.objectName ? { name: data.objectName, type: data.objectType, distance: data.distance } : undefined,
    metadata: {
      nasaId: data.nasaId,
      constellation: data.constellation,
      observationDate: data.date,
      mission: data.mission,
    },
    userAction: data.userAction || 'Observing',
    data: data.explanation ? { snippet: data.explanation.slice(0, 500) } : undefined,
  };
};
