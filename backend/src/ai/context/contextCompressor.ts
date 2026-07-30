import { AIContextPayload } from '../types/ai.types';

export class ContextCompressor {
  public static compressContext(context?: AIContextPayload | null): AIContextPayload | null {
    if (!context) return null;

    const compressed: AIContextPayload = {
      module: context.module,
      title: context.title,
      userAction: context.userAction,
      selectedObject: context.selectedObject,
    };

    if (context.metadata) {
      // Prioritize and keep only essential metadata keys
      const { tags, author, mood, constellation, mission, objectType, distance } = context.metadata;
      compressed.metadata = { tags, author, mood, constellation, mission, objectType, distance };
    }

    if (context.data) {
      // Truncate large data fields to 400 characters max
      const jsonStr = JSON.stringify(context.data);
      if (jsonStr.length > 400) {
        compressed.data = { summary: jsonStr.slice(0, 400) + '...' };
      } else {
        compressed.data = context.data;
      }
    }

    return compressed;
  }
}
