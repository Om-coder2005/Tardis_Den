import { Router } from 'express';
import { LibraryController } from '../controllers/library.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protect all library routes
router.use(requireAuth);

router.get('/records', LibraryController.getAllRecords);
router.put('/records/:contentId', LibraryController.upsertRecord);

export default router;
