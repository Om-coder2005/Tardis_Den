export class CostTracker {
  // Estimated Gemini 2.5 Flash pricing tier per 1M tokens
  private static INPUT_COST_PER_1M = 0.075;
  private static OUTPUT_COST_PER_1M = 0.30;

  public static calculateCost(inputTokens: number, outputTokens: number = 200): number {
    const inputCost = (inputTokens / 1_000_000) * this.INPUT_COST_PER_1M;
    const outputCost = (outputTokens / 1_000_000) * this.OUTPUT_COST_PER_1M;
    return inputCost + outputCost;
  }
}
