# Captain's Journal Section Specification

## 1. Overview & Purpose
The **Captain's Journal** (Zone C: Memory Area - Desk Journal) acts as the central personal logbook for daily entries, personal reflections, mood tracking, and pinning sticky notes and polaroid memories.

---

## 2. Included Features & Functionalities

### Journal Management (`JournalModule.tsx`, `JournalDashboard.tsx`)
- **Journal Logbook Overlay**: Master journal window simulating a physical logbook.
- **Entry Timeline Dashboard (`JournalDashboard.tsx`)**: Chronological listing of entries with date filtering, search bar, and mood tags.
- **Log Statistics Sidebar (`JournalSidebar.tsx`)**: Displays entry counts, mood frequency analytics, and recent activity.

### Writing & Pinning (`JournalEditor.tsx`, `PinnedNotesLayer.tsx`)
- **Rich Markdown Editor (`JournalEditor.tsx`)**: Editor supporting titles, formatted text, tags, date assignment, and mood selectors (e.g. Calm, Inspired, Thoughtful).
- **Pinned Notes & Polaroids Layer (`PinnedNotesLayer.tsx`)**: Canvas overlay allowing sticky notes and polaroid photos to be pinned and positioned on the journal layout.

---

## 3. Current Implementation Status

### ✅ Working Features
1. **Journal Unfolding Animation**: Clicking the desk journal opens the logbook interface smoothly.
2. **Full CRUD Entry Workflow**: Creating, editing, updating, and deleting journal entries.
3. **Local Storage / Database Persistence & Offline Fallback**: Journal logs are persisted via API with automated transparent `localStorage` fallback if the server is offline.
4. **Search, Dynamic Hashtags & Mood Selector**: Filter entries by search terms, assign observation moods (Curious, Inspired, Calm, etc.), and dynamically add/delete entry hashtags.
5. **Pinned Notes Overlay**: Rendering pinned sticky notes with color customization and position offsets.

### ❌ Non-Working / Planned Features
1. **Skeuomorphic 3D Page-Flip**: Interactive 3D page curl / flip animations when turning pages in entry view.
2. **Direct Drag-and-Drop Polaroid Attaching**: Dragging polaroids directly from the Camera Booth gallery onto specific journal entry pages.

### ⚠️ Redundant / Mocked Components
1. **AI Auto-Summarization**: Automatic AI summary generation for past journal entries is currently a placeholder function returning pre-canned summary snippets.
