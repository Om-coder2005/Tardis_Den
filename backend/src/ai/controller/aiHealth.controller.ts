import { Request, Response } from 'express';
import { ProviderFactory } from '../providers/provider.factory';

export const AIHealthController = {
  check(req: Request, res: Response) {
    const provider = ProviderFactory.getProvider();
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

    return res.json({
      status: 'ok',
      service: 'Tardis AI Subsystem',
      timestamp: new Date().toISOString(),
      provider: provider.name,
      configured: hasApiKey,
      mode: hasApiKey ? 'production' : 'mock',
      subsystems: {
        contextEngine: 'operational',
        promptOrchestrator: 'operational',
        rateLimiter: 'active',
      }
    });
  }
};
