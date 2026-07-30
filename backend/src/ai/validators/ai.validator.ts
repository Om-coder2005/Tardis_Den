import { AIChatPayload } from '../types/ai.types';
import { AIValidationError } from '../errors/ai.errors';

export const AIValidator = {
  validateChatPayload(body: any): AIChatPayload {
    if (!body || typeof body !== 'object') {
      throw new AIValidationError('Invalid request body.');
    }

    const { prompt, context, history, styleLevel, explanationLevel } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new AIValidationError('Prompt is required and must be a non-empty string.');
    }

    if (prompt.length > 2000) {
      throw new AIValidationError('Prompt exceeds maximum allowed length of 2000 characters.');
    }

    // Basic sanitization: strip script tags
    const sanitizedPrompt = prompt.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();

    if (history !== undefined && !Array.isArray(history)) {
      throw new AIValidationError('History must be an array.');
    }

    if (history) {
      if (history.length > 50) {
        throw new AIValidationError('History exceeds maximum allowed limit of 50 items.');
      }
      for (const msg of history) {
        if (!msg || typeof msg !== 'object' || !msg.role || !msg.content) {
          throw new AIValidationError('Each history item must have a role and content.');
        }
      }
    }

    return {
      prompt: sanitizedPrompt,
      context: context || null,
      history: history || [],
      styleLevel,
      explanationLevel,
    };
  }
};
