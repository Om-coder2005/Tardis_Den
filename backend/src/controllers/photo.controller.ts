import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';
import { CloudinaryService } from '../services/cloudinary.service';

const getUploadsBaseUrl = (req: Request) => {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
};

const getImageExtension = (mimeType: string) => {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/png':
    default:
      return 'png';
  }
};

const parseImageDataUrl = (imageBase64: string) => {
  const match = imageBase64.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    return {
      mimeType: 'image/png',
      base64Data: imageBase64.replace(/^data:.*?;base64,/, ''),
    };
  }

  return {
    mimeType: match[1].toLowerCase(),
    base64Data: match[2],
  };
};

const normalizePhotoUrl = (req: Request, url: string) => {
  const baseUrl = getUploadsBaseUrl(req).replace(/\/$/, '');

  if (!url) return url;
  if (url.startsWith('/uploads/')) return `${baseUrl}${url}`;
  if (url.includes('/uploads/')) {
    const uploadPath = url.slice(url.indexOf('/uploads/'));
    return `${baseUrl}${uploadPath}`;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      return `${baseUrl}${parsedUrl.pathname}`;
    }
  } catch {
    return url;
  }

  return url;
};

export const PhotoController = {
  // --- Albums ---
  async getAlbums(req: Request, res: Response) {
    try {
      const albums = await prisma.photoAlbum.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { photos: true } } }
      });
      res.json(albums);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch albums' });
    }
  },

  async createAlbum(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const trimmedName = typeof name === 'string' ? name.trim() : '';

      if (!trimmedName) {
        return res.status(400).json({ error: 'Album name is required' });
      }

      const album = await prisma.photoAlbum.create({
        data: { name: trimmedName }
      });
      res.json(album);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create album' });
    }
  },

  // --- Photos ---
  async getPhotos(req: Request, res: Response) {
    try {
      const { albumId, isFavorite, search } = req.query;
      
      const where: any = {};
      if (albumId) where.albumId = String(albumId);
      if (isFavorite === 'true') where.isFavorite = true;
      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' } },
          { archiveNote: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const photos = await prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { album: true }
      });
      res.json(photos.map(photo => ({
        ...photo,
        url: normalizePhotoUrl(req, photo.url)
      })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch photos' });
    }
  },

  async updatePhoto(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, archiveNote, caption, isFavorite, albumId } = req.body;
      const nextTitle = typeof title === 'string'
        ? title.trim()
        : typeof caption === 'string'
          ? caption.trim()
          : undefined;

      const photo = await prisma.photo.update({
        where: { id },
        data: {
          ...(nextTitle !== undefined ? { title: nextTitle } : {}),
          ...(typeof archiveNote === 'string' ? { archiveNote } : {}),
          ...(typeof isFavorite === 'boolean' ? { isFavorite } : {}),
          ...(albumId !== undefined ? { albumId: albumId || null } : {}),
        }
      });
      res.json(photo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update photo' });
    }
  },

  async deletePhoto(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const photo = await prisma.photo.findUnique({ where: { id } });
      
      if (photo) {
        // Try to delete the file if it exists locally
        const filename = photo.url.split('/').pop();
        if (filename) {
          const filepath = path.join(process.cwd(), 'uploads', filename);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }
        await prisma.photo.delete({ where: { id } });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete photo' });
    }
  },

  // --- Uploads ---
  async capturePhoto(req: Request, res: Response) {
    try {
      // The image is sent as a base64 string
      const { imageBase64, albumId } = req.body;
      if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

      const { mimeType, base64Data } = parseImageDataUrl(imageBase64);
      const buffer = Buffer.from(base64Data, 'base64');
      
      let url = '';

      // 1. Try Cloudinary Upload
      const cloudinaryResult = await CloudinaryService.uploadBase64(imageBase64, 'photos');
      if (cloudinaryResult) {
        url = cloudinaryResult.url;
      } else {
        // 2. Fallback to Local Storage
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${getImageExtension(mimeType)}`;
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filepath = path.join(uploadsDir, filename);
        
        fs.mkdirSync(uploadsDir, { recursive: true });
        fs.writeFileSync(filepath, buffer);
        url = `${getUploadsBaseUrl(req)}/uploads/${filename}`;
      }
      
      const resolvedAlbumId = typeof albumId === 'string' && albumId.trim()
        ? albumId.trim()
        : null;

      if (resolvedAlbumId) {
        const albumExists = await prisma.photoAlbum.findUnique({ where: { id: resolvedAlbumId } });
        if (!albumExists) {
          return res.status(400).json({ error: 'Album not found' });
        }
      }

      const photo = await prisma.photo.create({
        data: {
          url,
          title: 'New Memory',
          archiveNote: null,
          albumId: resolvedAlbumId
        }
      });

      res.json(photo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Capture failed' });
    }
  }
};
