export interface AIMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export interface AIContextData {
  module: 'Bookshelf' | 'Telescope' | 'Journal' | 'Desktop' | 'Gallery' | 'Dream Space' | 'Room' | string;
  title?: string;
  selectedObject?: any;
  metadata?: Record<string, any>;
  currentState?: Record<string, any>;
  userAction?: string;
  data?: any;
}

export interface AIChatRequest {
  prompt: string;
  context?: AIContextData | null;
  history?: { role: 'user' | 'model'; content: string }[];
  styleLevel?: 'concise' | 'standard' | 'detailed';
  explanationLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AISSEEvent {
  text?: string;
  error?: string;
  done?: boolean;
}
