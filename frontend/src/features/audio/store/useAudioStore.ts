import { create } from 'zustand';

interface AudioState {
  isMuted: boolean;
  baseAmbientTrack: string;
  weatherTrack: string | null;
  
  toggleMute: () => void;
  playInteraction: (soundUrl: string) => void;
  // A small queue/trigger for interaction sounds so the engine component can react
  interactionQueue: { id: string; url: string }[];
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: false,
  baseAmbientTrack: '/audio/ambient.mp3',
  weatherTrack: null,
  interactionQueue: [],
  
  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
  
  playInteraction: (soundUrl: string) => {
    if (get().isMuted) return;
    
    // We append to the queue so the engine can spawn a new Audio node or play it.
    const id = `sfx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    set(state => ({
      interactionQueue: [...state.interactionQueue, { id, url: soundUrl }]
    }));
    
    // Auto-remove from queue after a short delay to keep it clean
    setTimeout(() => {
      set(state => ({
        interactionQueue: state.interactionQueue.filter(item => item.id !== id)
      }));
    }, 5000);
  }
}));
