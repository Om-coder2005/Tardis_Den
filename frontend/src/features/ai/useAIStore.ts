import { create } from 'zustand';
import type { AIContextData as AIContext, AIMessage } from './types/ai.types';

export type { AIMessage, AIContext };

interface AIState {
  isOpen: boolean;
  messages: AIMessage[];
  isStreaming: boolean;
  context: AIContext | null;
  
  openPanel: (context?: AIContext) => void;
  closePanel: () => void;
  setContext: (context: AIContext) => void;
  addMessage: (msg: Omit<AIMessage, 'id'>) => string;
  updateMessage: (id: string, content: string, isStreaming?: boolean) => void;
  clearHistory: () => void;
  activeRequest: AbortController | null;
  setRequestController: (controller: AbortController | null) => void;
  abortRequest: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,
  context: null,

  activeRequest: null,

  openPanel: (context) => set((state) => ({ 
    isOpen: true, 
    context: context || state.context 
  })),
  
  closePanel: () => {
    set((state) => {
      if (state.activeRequest) {
        state.activeRequest.abort('Panel closed');
      }
      return { isOpen: false, activeRequest: null, isStreaming: false };
    });
  },
  
  setContext: (context) => set({ context }),

  addMessage: (msg) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    set((state) => ({
      messages: [...state.messages, { ...msg, id }]
    }));
    return id;
  },

  updateMessage: (id, content, isStreaming = true) => set((state) => ({
    messages: state.messages.map(m => 
      m.id === id ? { ...m, content, isStreaming } : m
    )
  })),

  clearHistory: () => set({ messages: [] }),

  setRequestController: (controller) => set({ activeRequest: controller }),

  abortRequest: () => set((state) => {
    if (state.activeRequest) {
      state.activeRequest.abort('Request aborted');
    }
    return { activeRequest: null, isStreaming: false };
  })
}));
