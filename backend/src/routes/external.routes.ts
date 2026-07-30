import { Router } from 'express';
import { ExternalController } from '../controllers/external.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// We can protect these routes too, or leave them open. 
// We will protect them to be safe.
router.use(requireAuth);

router.get('/apod', ExternalController.getApod);
router.get('/astros', ExternalController.getAstros);
router.get('/neows', ExternalController.getNearEarthObjects);
router.get('/iss', ExternalController.getIssLocation);

export default router;
