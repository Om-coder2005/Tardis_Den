import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export const AIController = {
  async chat(req: Request, res: Response) {
    const { prompt, context, history = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = AIService.streamChat(prompt, context, history);
      for await (const chunk of stream) {
        if (chunk) {
          // Send as SSE
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('AI Error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'An error occurred' })}\n\n`);
      res.end();
    }
  }
};
