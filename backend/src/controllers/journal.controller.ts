import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { CloudinaryService } from '../services/cloudinary.service';

const prisma = new PrismaClient();

export const JournalController = {
  // --- Folders ---
  async getFolders(req: Request, res: Response) {
    try {
      const folders = await prisma.journalFolder.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          _count: { select: { entries: true } }
        }
      });
      res.json(folders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  },

  async createFolder(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const folder = await prisma.journalFolder.create({
        data: { name }
      });
      res.json(folder);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create folder' });
    }
  },

  // --- Entries ---
  async getEntries(req: Request, res: Response) {
    try {
      const { folderId, search, tag, isFavorite, type } = req.query;
      
      const where: any = {};
      if (folderId) where.folderId = String(folderId);
      if (isFavorite === 'true') where.isFavorite = true;
      if (tag) where.tags = { has: String(tag) };
      
      // Filter by type (journal or pinned)
      if (type) {
        where.type = String(type);
      } else {
        // If not specified, default to only standard journal entries
        where.type = 'journal';
      }
      
      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' } },
          { content: { contains: String(search), mode: 'insensitive' } }
        ];
      }

      const entries = await prisma.journalEntry.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          isDraft: true,
          isFavorite: true,
          tags: true,
          type: true,
          linkedModule: true,
          linkedEntityId: true,
          x: true,
          y: true,
          color: true,
          folderId: true,
          updatedAt: true,
          createdAt: true,
          content: true, // We need content for Pinned Notes specifically. Keep it included since it's small.
        }
      });
      res.json(entries);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch entries' });
    }
  },

  async getEntry(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const entry = await prisma.journalEntry.findUnique({
        where: { id },
        include: { folder: true, versions: { orderBy: { createdAt: 'desc' } } }
      });
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch entry' });
    }
  },

  async createEntry(req: Request, res: Response) {
    try {
      const { title, content, folderId, isDraft, tags, type, linkedModule, linkedEntityId, x, y, color } = req.body;
      const entry = await prisma.journalEntry.create({
        data: {
          title: title || 'Untitled Entry',
          content: content || '',
          folderId,
          isDraft: isDraft !== undefined ? isDraft : true,
          tags: tags || [],
          type: type || 'journal',
          linkedModule,
          linkedEntityId,
          x,
          y,
          color
        }
      });
      res.json(entry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create entry' });
    }
  },

  async updateEntry(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, content, folderId, isDraft, isFavorite, tags, type, linkedModule, linkedEntityId, x, y, color } = req.body;

      // Create a version snapshot if content changed significantly
      const oldEntry = await prisma.journalEntry.findUnique({ where: { id } });
      if (oldEntry && content && oldEntry.content !== content) {
        await prisma.journalVersion.create({
          data: { entryId: id, content: oldEntry.content }
        });
      }

      const entry = await prisma.journalEntry.update({
        where: { id },
        data: {
          title,
          content,
          folderId,
          isDraft,
          isFavorite,
          tags,
          type,
          linkedModule,
          linkedEntityId,
          x,
          y,
          color
        }
      });
      res.json(entry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update entry' });
    }
  },

  async deleteEntry(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await prisma.journalEntry.delete({ where: { id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  },

  // --- Uploads ---
  async uploadMedia(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      
      let url = '';

      if (req.file.buffer) {
        const cloudinaryResult = await CloudinaryService.uploadBuffer(req.file.buffer, 'journal');
        if (cloudinaryResult) {
          url = cloudinaryResult.url;
        }
      }

      if (!url) {
        const ext = path.extname(req.file.originalname) || '.png';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        const filepath = path.join(process.cwd(), 'uploads', filename);
        fs.writeFileSync(filepath, req.file.buffer);

        const baseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
        url = `${baseUrl}/uploads/${filename}`;
      }

      res.json({ url });
    } catch (err) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
};
