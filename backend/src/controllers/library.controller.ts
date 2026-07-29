import { Request, Response } from 'express';
import { LibraryService } from '../services/library.service';

export const LibraryController = {
  async getAllRecords(req: Request, res: Response) {
    try {
      const records = await LibraryService.getAllRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch library records' });
    }
  },

  async upsertRecord(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const data = req.body;
      
      if (data.lastReadAt) {
        data.lastReadAt = new Date(data.lastReadAt);
      }

      const record = await LibraryService.upsertRecord(contentId as string, data);
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update library record' });
    }
  }
};
