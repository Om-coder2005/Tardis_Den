import { Request, Response } from 'express';
import { AIValidator } from '../validators/ai.validator';
import { AIService } from '../services/ai.service';
import { StreamingEngine } from '../streaming/streamingEngine';
import { AIError } from '../errors/ai.errors';

export const AIController = {
  async chat(req: Request, res: Response) {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    res.setHeader('X-Request-ID', requestId);

    try {
      const payload = AIValidator.validateChatPayload(req.body);

      StreamingEngine.setupHeaders(res);

      try {
        const stream = AIService.streamChat(payload);
        for await (const chunk of stream) {
          if (chunk) {
            StreamingEngine.writeEvent(res, { text: chunk });
          }
        }
        StreamingEngine.writeEvent(res, { done: true });
        StreamingEngine.endStream(res);
      } catch (error: any) {
        console.error(`[AI Stream Error] RequestID: ${requestId}`, error);
        StreamingEngine.writeEvent(res, { error: error.message || 'AI streaming error' });
        StreamingEngine.endStream(res);
      }
    } catch (error: any) {
      if (error instanceof AIError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
