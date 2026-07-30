import type { AIChatRequest, AISSEEvent } from '../types/ai.types';
import { StreamParser } from '../../../utils/streamParser';

export class AIClient {
  public static async streamChat(
    request: AIChatRequest,
    onChunk: (text: string) => void,
    onError: (errorMsg: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not configured.');
    }

    const response = await fetch(`${apiUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized. Please check your credentials.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please slow down.');
      } else if (response.status >= 500) {
        throw new Error('The AI neural matrix is currently unavailable.');
      }
      throw new Error(`Failed to communicate with AI (Status: ${response.status})`);
    }

    if (!response.body) {
      throw new Error('No response body received from the server.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    const parser = new StreamParser();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const events: AISSEEvent[] = parser.parseChunk(chunk);

      for (const event of events) {
        if (event.done) {
          break;
        }
        if (event.text) {
          onChunk(event.text);
        } else if (event.error) {
          onError(event.error);
        }
      }
    }
  }
}
