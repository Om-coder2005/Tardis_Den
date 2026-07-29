\# TARDIS Den

\# **Phase 06 - Journal Module**



Version: 1.0



Status: Ready for Implementation



\---



\# Goal



Transform the journal into the administrator's personal space log.



The journal should feel like writing in a beautifully crafted notebook sitting on the desk, while providing the convenience of a modern digital editor.



This module serves as a private knowledge repository, observation log, and creative workspace.



\---



\# Objectives



Implement



\- Interactive Journal

\- Rich Text Editor

\- Daily Entries

\- Drafts

\- Search

\- Tags

\- Favorites

\- Folder Organization

\- Autosave

\- Version History

\- Markdown Support

\- Media Attachments



Do NOT Implement



AI writing assistance



Voice notes



Collaboration



Cloud sharing



Publishing



Desktop integration



\---



\# User Flow



Room



↓



Click Journal



↓



Camera Focus



↓



Journal Opens



↓



Browse Entries



↓



Open Entry



↓



Write



↓



Autosave



↓



Return to Room



\---



\# Journal Experience



The journal should feel calm, personal, and distraction-free.



The interface should resemble a premium notebook while retaining modern editing capabilities.



The focus should always remain on writing.



\---



\# Journal Layout



Left Sidebar



\- Search

\- Daily Entries

\- Favorites

\- Folders

\- Tags



Center



\- Writing Editor



Right Sidebar



\- Entry Information

\- Word Count

\- Reading Time

\- Version History

\- Metadata



Top Toolbar



\- New Entry

\- Save

\- Undo

\- Redo

\- Formatting

\- Export



\---



\# Entry Types



Support



\- Daily Log

\- Observation Notes

\- Research Notes

\- Ideas

\- Personal Reflections

\- Project Notes



Additional entry types should be easily extensible.



\---



\# Rich Text Editor



Support



\- Headings

\- Paragraphs

\- Lists

\- Checklists

\- Quotes

\- Code Blocks

\- Tables

\- Links

\- Images

\- Horizontal Rules



The editor should provide a clean writing experience without unnecessary clutter.



\---



\# Markdown Support



Support



\- Import Markdown

\- Export Markdown

\- Live Markdown rendering

\- Keyboard shortcuts



Markdown should remain fully compatible with common specifications.



\---



\# Autosave



Automatically save



\- Content

\- Cursor position

\- Scroll position



Autosave interval



5 seconds after inactivity.



Unsaved changes should never be lost during accidental refreshes.



\---



\# Drafts



Support



\- Automatic draft creation

\- Manual draft saving

\- Draft recovery



Drafts should be clearly distinguished from published entries.



\---



\# Search



Search by



\- Title

\- Content

\- Tags

\- Date

\- Folder



Features



\- Instant filtering

\- Highlight matching terms

\- Keyboard navigation



\---



\# Tags



Users can



\- Create tags

\- Rename tags

\- Delete tags

\- Filter by tags



Suggested tags are out of scope for this phase.



\---



\# Favorites



Support



\- Mark entry as favorite

\- Remove favorite

\- Filter favorites



Favorites persist across sessions.



\---



\# Folder Organization



Default folders



\- Daily Logs

\- Astronomy

\- Projects

\- Personal

\- Archive



Users can



\- Create folders

\- Rename folders

\- Move entries

\- Delete empty folders



\---



\# Version History



Track



\- Save timestamp

\- Edited by (Administrator)

\- Previous versions



Support



\- View history

\- Restore previous version



Only lightweight versioning is required.



\---



\# Media Attachments



Support



\- Images

\- Screenshots

\- Observation photos



Features



\- Upload

\- Remove

\- Preview

\- Resize



Large media files should be optimized before storage.



\---



\# Entry Metadata



Display



\- Created date

\- Last modified

\- Word count

\- Character count

\- Reading time

\- Folder

\- Tags

\- Favorite status



\---



\# Export



Support



\- Markdown (.md)

\- PDF

\- Plain Text (.txt)



Exports should preserve formatting where applicable.



\---



\# State Management



Create a dedicated Journal Store.



Track



\- Current entry

\- Selected folder

\- Search query

\- Tags

\- Favorites

\- Draft state

\- Autosave status

\- Version history

\- Loading state

\- Error state



Do not mix journal state with the room store.



\---



\# Database



Persist



\- Entries

\- Drafts

\- Tags

\- Folders

\- Favorites

\- Attachments

\- Version history



Design should support future synchronization without schema changes.



\---



\# Error Handling



Handle



\- Autosave failures

\- Storage limits

\- Missing attachments

\- Export failures

\- Database errors



Users should never lose written content.



\---



\# Animations



Implement subtle transitions for



\- Opening journal

\- Switching entries

\- Sidebar expansion

\- Toolbar actions

\- Returning to room



Animations should feel quiet and unobtrusive.



\---



\# Accessibility



Support



\- Keyboard-first editing

\- Screen reader labels

\- High-contrast mode

\- Adjustable font size

\- Reduced motion

\- Visible focus indicators



\---



\# Performance



Targets



\- Journal opens in under 1 second

\- Autosave completes without noticeable delay

\- Search updates instantly

\- Smooth scrolling

\- Efficient rendering of large entries



\---



\# Testing



✓ Create new entry



✓ Edit existing entry



✓ Autosave functions correctly



✓ Draft recovery works



✓ Search returns expected results



✓ Tags filter correctly



✓ Favorites persist



✓ Version history restores successfully



✓ Markdown import/export works



✓ Attachments upload correctly



✓ Return to room functions correctly



\---



\# Deliverables



\- Interactive journal

\- Rich text editor

\- Markdown support

\- Autosave

\- Draft management

\- Search

\- Tags

\- Folder organization

\- Favorites

\- Version history

\- Media attachments

\- Export functionality



\---



\# Acceptance Criteria



The journal feels like a premium digital notebook integrated naturally into the room.



Writing is fast, reliable, and distraction-free.



No content is lost under normal usage.



The module remains independent and ready for future AI writing assistance without requiring architectural changes.



\---



\# Constraints



Do not implement AI writing assistance.



Do not implement collaboration or multi-user editing.



Do not implement cloud synchronization.



Do not integrate directly with the Telescope module.



Do not modify the room interaction framework.



Build the journal as a self-contained module that integrates seamlessly with the architecture established in previous phases.

