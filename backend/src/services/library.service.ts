import { prisma } from '../prisma';

export const LibraryService = {
  async getAllRecords() {
    return prisma.libraryRecord.findMany();
  },

  async getRecord(contentId: string) {
    return prisma.libraryRecord.findUnique({
      where: { contentId }
    });
  },

  async upsertRecord(contentId: string, data: {
    isFavorite?: boolean;
    progress?: number;
    bookmarked?: boolean;
    notes?: string;
    lastReadAt?: Date;
  }) {
    return prisma.libraryRecord.upsert({
      where: { contentId },
      update: data,
      create: {
        contentId,
        ...data,
      }
    });
  }
};
