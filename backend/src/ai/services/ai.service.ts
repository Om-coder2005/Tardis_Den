import { AIChatPayload } from '../types/ai.types';
import { PromptOrchestrator } from '../prompts/promptOrchestrator';
import { ContextCompressor } from '../context/contextCompressor';
import { TokenBudgetManager } from '../context/tokenBudgetManager';
import { ProviderFactory } from '../providers/provider.factory';
import { PromptAnalytics } from '../telemetry/promptAnalytics';

export const AIService = {
  async *streamChat(payload: AIChatPayload): AsyncGenerator<string> {
    const startTime = Date.now();
    const provider = ProviderFactory.getProvider();

    // 1. Compress context
    const compressedContext = ContextCompressor.compressContext(payload.context);

    // 2. Build orchestrated prompt & persona system instruction
    const systemInstruction = PromptOrchestrator.orchestrateSystemInstruction(
      compressedContext,
      payload.styleLevel,
      payload.explanationLevel
    );

    // 3. Trim history according to token budget
    const trimmedHistory = TokenBudgetManager.trimHistoryToBudget(payload.history || [], 2000);

    // 4. Calculate token estimates for telemetry
    const estimatedTokens = 
      TokenBudgetManager.estimateTokens(systemInstruction) +
      TokenBudgetManager.estimateTokens(payload.prompt) +
      trimmedHistory.reduce((acc, m) => acc + TokenBudgetManager.estimateTokens(m.content), 0);

    // Log analytics telemetry
    PromptAnalytics.log({
      module: compressedContext?.module || 'General',
      promptLength: payload.prompt.length,
      contextLength: JSON.stringify(compressedContext || {}).length,
      historyCount: trimmedHistory.length,
      estimatedPromptTokens: estimatedTokens,
      executionTimeMs: Date.now() - startTime,
      provider: provider.name,
    });

    const generator = provider.streamChat({
      prompt: payload.prompt,
      systemInstruction,
      history: trimmedHistory,
    });

    for await (const chunk of generator) {
      yield chunk;
    }
  }
};
