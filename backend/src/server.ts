import './config/env';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.routes';
import libraryRoutes from './routes/library.routes';
import externalRoutes from './routes/external.routes';
import journalRoutes from './routes/journal.routes';
import photoRoutes from './routes/photo.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/ai', aiRoutes);

const uploadsDir = path.join(process.cwd(), 'uploads');

const getUploadContentType = (filePath: string) => {
  const buffer = fs.readFileSync(filePath);

  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('hex') === '89504e47') {
    return 'image/png';
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }

  if (buffer.length >= 6 && buffer.subarray(0, 6).toString('ascii').startsWith('GIF8')) {
    return 'image/gif';
  }

  return 'application/octet-stream';
};

app.get('/uploads/:filename', (req: Request, res: Response, next) => {
  try {
    const safeFilename = path.basename(String(req.params.filename));
    const filePath = path.join(uploadsDir, safeFilename);

    if (!filePath.startsWith(uploadsDir) || !fs.existsSync(filePath)) {
      return next();
    }

    res.type(getUploadContentType(filePath));
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
});

// Serve uploads statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((error: unknown, req: Request, res: Response, next: express.NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (error && typeof error === 'object' && 'type' in error && (error as { type?: string }).type === 'entity.too.large') {
    return res.status(413).json({ error: 'Image is too large. Please capture a smaller photo.' });
  }

  return next(error as never);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
