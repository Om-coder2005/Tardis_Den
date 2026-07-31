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
router.get('/google-books', ExternalController.searchGoogleBooks);
router.get('/gutendex', ExternalController.getGutendexBooks);
router.get('/gutendex/:id/text', ExternalController.getGutendexTextContent);

export default router;
