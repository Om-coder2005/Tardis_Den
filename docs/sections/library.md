# Library Section Specification

## 1. Overview & Purpose
The **Library** (Zone A: Knowledge Area) houses the user's knowledge collection, research documents, books, and reference material organized within a physical bookshelf interface.

---

## 2. Included Features & Functionalities

### Bookshelf & Navigation (`BookshelfModule.tsx`, `LibraryBrowser.tsx`)
- **Bookshelf Grid**: Visual shelf displaying available book titles, categories, cover art, and progress indicators.
- **Category & Tag Filters**: Filtering books by subjects (Science, Fiction, Philosophy, Technology, Custom Notes).

### Reading Experience (`ReadingContextPanel.tsx`, `ArchiveSidebar.tsx`)
- **Book Reader View**: Dedicated panel for reading book chapters, markdown articles, and text notes.
- **Reading Progress Tracker**: Tracks percentage read and last active position per book.
- **Archive & Bookmarks Sidebar (`ArchiveSidebar.tsx`)**: Quick navigation through saved bookmarks, reading history, and archived topics.

---

## 3. Current Implementation Status

### ✅ Working Features
1. **Bookshelf Transition**: Smooth transition from room view to the interactive bookshelf interface upon clicking the bookshelf object.
2. **Library Catalog Browser**: Searching, filtering, and selecting books from the library catalog.
3. **Markdown Text Reader**: Rendering book content, chapters, and documentation with custom styling.
4. **Archive Sidebar Navigation**: Viewing reading list history and saved reference tags.

### ❌ Non-Working / Planned Features
1. **PDF / EPUB File Parser**: Direct upload and parsing of `.pdf` or `.epub` files (currently content must be provided as text/markdown).
2. **3D Physical Book Slide-Out**: Animated physical book extraction from the 3D room canvas before opening the reader view.
3. **Cross-Device Bookmark Sync**: Cloud synchronization of bookmarks across multiple active sessions.

### ⚠️ Redundant / Mocked Components
1. **AI Reading Explanations**: Contextual AI explanations for highlighted text selections are stubbed out and return simulated response cards.
