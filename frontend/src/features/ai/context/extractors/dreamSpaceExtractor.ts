import type { AIContextData } from '../../types/ai.types';

export const dreamSpaceExtractor = (data: any): AIContextData => {
  if (!data) return { module: 'Dream Space' };

  return {
    module: 'Dream Space',
    title: data.ambience || 'Dream Space Session',
    metadata: {
      ambienceSound: data.ambienceSound,
      timerRemaining: data.timerRemaining,
      sessionActivity: data.sessionActivity,
    },
    userAction: data.userAction || 'Relaxing',
  };
};
