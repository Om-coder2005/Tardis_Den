import { AIMessagePayload } from '../types/ai.types';

export class TokenBudgetManager {
  // Rough estimation: 1 token ≈ 4 characters
  public static estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public static trimHistoryToBudget(history: AIMessagePayload[], maxTokens: number = 2000): AIMessagePayload[] {
    let currentTokens = 0;
    const trimmedHistory: AIMessagePayload[] = [];

    // Process from newest to oldest
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const tokens = this.estimateTokens(msg.content);
      if (currentTokens + tokens > maxTokens) {
        break;
      }
      currentTokens += tokens;
      trimmedHistory.unshift(msg);
    }

    return trimmedHistory;
  }
}
