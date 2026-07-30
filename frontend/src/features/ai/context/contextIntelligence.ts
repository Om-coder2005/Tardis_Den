import type { AIContextData } from '../types/ai.types';
import { bookshelfExtractor } from './extractors/bookshelfExtractor';
import { telescopeExtractor } from './extractors/telescopeExtractor';
import { journalExtractor } from './extractors/journalExtractor';
import { galleryExtractor } from './extractors/galleryExtractor';
import { desktopExtractor } from './extractors/desktopExtractor';
import { dreamSpaceExtractor } from './extractors/dreamSpaceExtractor';
import { roomExtractor } from './extractors/roomExtractor';

export class ContextIntelligence {
  public static extractModuleContext(module: string, data: any): AIContextData {
    switch (module.toLowerCase()) {
      case 'bookshelf':
        return bookshelfExtractor(data);
      case 'telescope':
        return telescopeExtractor(data);
      case 'journal':
        return journalExtractor(data);
      case 'gallery':
        return galleryExtractor(data);
      case 'desktop':
        return desktopExtractor(data);
      case 'dream space':
      case 'dreamspace':
        return dreamSpaceExtractor(data);
      case 'room':
        return roomExtractor(data);
      default:
        return {
          module,
          data: typeof data === 'object' ? data : { raw: data },
        };
    }
  }
}
