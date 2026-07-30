import { Response } from 'express';
import { AIStreamChunk } from '../types/ai.types';

export class StreamingEngine {
  public static setupHeaders(res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  }

  public static writeEvent(res: Response, chunk: AIStreamChunk): void {
    if (chunk.done) {
      res.write('data: [DONE]\n\n');
    } else {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
  }

  public static endStream(res: Response): void {
    res.end();
  }
}
