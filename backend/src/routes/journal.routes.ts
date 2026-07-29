import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { JournalController } from '../controllers/journal.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.use(requireAuth);

// Folders
router.get('/folders', JournalController.getFolders);
router.post('/folders', JournalController.createFolder);

// Entries
router.get('/entries', JournalController.getEntries);
router.post('/entries', JournalController.createEntry);
router.get('/entries/:id', JournalController.getEntry);
router.put('/entries/:id', JournalController.updateEntry);
router.delete('/entries/:id', JournalController.deleteEntry);

// Uploads
router.post('/upload', upload.single('file'), JournalController.uploadMedia);

export default router;
