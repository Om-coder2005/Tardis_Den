import { Router } from 'express';
import { PhotoController } from '../controllers/photo.controller';
import { requireAuth } from '../middleware/auth';
import express from 'express';

const router = Router();
router.use(requireAuth);

// Important: Need higher body size limit for base64 uploads
router.use(express.json({ limit: '20mb' }));

// Albums
router.get('/albums', PhotoController.getAlbums);
router.post('/albums', PhotoController.createAlbum);

// Photos
router.get('/', PhotoController.getPhotos);
router.put('/:id', PhotoController.updatePhoto);
router.delete('/:id', PhotoController.deletePhoto);

// Capture
router.post('/capture', PhotoController.capturePhoto);

export default router;
