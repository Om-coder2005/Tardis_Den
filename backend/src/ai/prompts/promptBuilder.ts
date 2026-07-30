import { AIContextPayload } from '../types/ai.types';
import { ContextManager } from '../context/contextManager';

export const PromptBuilder = {
  buildSystemInstruction(context?: AIContextPayload | null): string {
    let systemInstruction = "You are a quiet, knowledgeable observatory assistant named Tardis. You assist the user with astronomy, journaling, reading, and general knowledge. Be concise, accurate, educational, and respectful.";

    const formattedContext = ContextManager.formatContext(context);
    if (formattedContext) {
      systemInstruction += `\n\n--- Current Context ---\n${formattedContext}`;
    }

    return systemInstruction;
  }
};
