export interface PromptTelemetryData {
  module: string;
  promptLength: number;
  contextLength: number;
  historyCount: number;
  estimatedPromptTokens: number;
  executionTimeMs: number;
  provider: string;
}

export class PromptAnalytics {
  public static log(data: PromptTelemetryData): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[AI Telemetry] Module: ${data.module} | Tokens: ~${data.estimatedPromptTokens} | History: ${data.historyCount} msgs | Duration: ${data.executionTimeMs}ms | Provider: ${data.provider}`
      );
    }
  }
}
