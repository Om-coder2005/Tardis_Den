import { logger } from './logger';

export interface StreamEventData {
  text?: string;
  error?: string;
  done?: boolean;
}

export class StreamParser {
  private buffer = '';

  /**
   * Parses a raw text chunk from SSE stream into an array of parsed data objects.
   * Maintains internal buffer for incomplete chunks across multiple reads.
   */
  public parseChunk(chunk: string): StreamEventData[] {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    const parsedData: StreamEventData[] = [];

    // The last element in `lines` is either an empty string (if buffer ended in '\n')
    // or a partial line. We keep it in the buffer.
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === '') continue;

      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        
        if (dataStr === '[DONE]') {
          parsedData.push({ done: true });
          continue;
        }

        try {
          const data = JSON.parse(dataStr);
          parsedData.push(data);
        } catch (err) {
          logger.error('Failed to parse SSE JSON data:', dataStr, err);
          // If JSON is malformed, we just ignore this chunk instead of crashing
        }
      }
    }

    return parsedData;
  }
}
