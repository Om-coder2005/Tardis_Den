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
1. **Bookshelf Focus Transition**: Smooth transition from room view to the interactive bookshelf interface.
2. **Google Books API Integration**: Global search and metadata inspection for millions of book volumes (`/api/external/google-books`).
3. **Gutendex Free Public Domain eBooks**: Instant browsing and indexing of thousands of classic science & literature volumes (`/api/external/gutendex`).
4. **In-App Full-Text eBook Reader ([EbookReaderModal.tsx](file:///d:/the_space/frontend/src/features/bookshelf/components/EbookReaderModal.tsx))**: Full-text reading mode directly inside the app for Gutenberg public domain classics (`/api/external/gutendex/:id/text`).
5. **Personal Vault & Bookmark Filtering**: Persisting saved volumes, reading timestamps, and filtering bookmarks in PostgreSQL via Prisma.
6. **Cloudinary Cover Art Optimization**: Auto WebP formatting and dynamic resizing for all book covers.

---

## 4. Connected APIs & Efficiency

- **Google Books API**: Search index & metadata (`www.googleapis.com/books/v1/volumes`).
- **Gutendex API**: Free public domain ebook index (`gutendex.com/books`).
- **Project Gutenberg Plain Text Proxy**: Full-text eBook fetching (`www.gutenberg.org/files`).
- **Cloudinary Image Optimizer**: Auto WebP image compression for book covers.
