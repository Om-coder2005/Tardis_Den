import { IAIProvider } from '../types/ai.types';
import { GeminiProvider } from './gemini.provider';

export class ProviderFactory {
  public static getProvider(): IAIProvider {
    const providerName = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

    switch (providerName) {
      case 'gemini':
      default:
        return new GeminiProvider();
    }
  }
}
