import { create } from 'zustand';

export interface AIMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export interface AIContext {
  module: 'Bookshelf' | 'Telescope' | 'Journal' | 'Desktop';
  data: any;
}

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
}

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,
  context: null,

  openPanel: (context) => set((state) => ({ 
    isOpen: true, 
    context: context || state.context 
  })),
  
  closePanel: () => set({ isOpen: false }),
  
  setContext: (context) => set({ context }),

  addMessage: (msg) => {
    const id = Date.now().toString();
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

  clearHistory: () => set({ messages: [] })
}));
