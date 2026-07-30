import type { AIContextData } from '../../types/ai.types';

export const galleryExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Gallery' };

  return {
    module: 'Gallery',
    title: data.title || 'Astronomical Photo',
    metadata: {
      caption: data.caption,
      observationNotes: data.notes,
      cameraSettings: data.cameraSettings,
    },
    userAction: data.userAction || 'Viewing Gallery',
  };
};
