export interface AIMessagePayload {
  role: 'user' | 'model';
  content: string;
}

export interface AIContextPayload {
  module: string;
  title?: string;
  selectedObject?: any;
  metadata?: Record<string, any>;
  currentState?: Record<string, any>;
  userAction?: string;
  data?: any;
}

export interface AIChatPayload {
  prompt: string;
  context?: AIContextPayload | null;
  history?: AIMessagePayload[];
  styleLevel?: 'concise' | 'standard' | 'detailed';
  explanationLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AIStreamChunk {
  text?: string;
  error?: string;
  done?: boolean;
}

export interface IAIProvider {
  name: string;
  streamChat(payload: { prompt: string; systemInstruction: string; history: AIMessagePayload[] }): AsyncGenerator<string>;
}
