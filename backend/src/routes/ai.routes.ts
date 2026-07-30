import { Router } from 'express';
import { AIController } from '../ai/controller/ai.controller';
import { AIHealthController } from '../ai/controller/aiHealth.controller';
import { aiRateLimiter } from '../ai/middleware/aiRateLimiter';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Health check endpoint (public)
router.get('/health', AIHealthController.check);

// Authenticated AI endpoints with rate limiting
router.use(requireAuth);
router.post('/chat', aiRateLimiter, AIController.chat);

export default router;
