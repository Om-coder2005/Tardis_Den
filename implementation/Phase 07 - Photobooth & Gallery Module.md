\# TARDIS Den

\# **Phase 07 - Photobooth \& Gallery Module**



Version: 1.0



Status: Ready for Implementation



\---



\# Goal



Transform the vintage camera on the desk into an interactive photobooth that captures memories from within TARDIS Den.



Photos should feel like physical instant prints that are collected, displayed, and revisited in a personal gallery.



This module emphasizes memories rather than photography tools.



\---



\# Objectives



Implement



\- Interactive Photobooth

\- Webcam Integration

\- Camera Preview

\- Countdown Timer

\- Photo Capture

\- Polaroid Generation

\- Personal Gallery

\- Timeline View

\- Favorites

\- Albums

\- Image Metadata

\- Local Storage



Do NOT Implement



AI photo enhancement



Face recognition



Image filters



Cloud sharing



Social features



Video recording



Desktop integration



\---



\# User Flow



Room



↓



Click Camera



↓



Camera Focus



↓



Photobooth Opens



↓



Grant Camera Permission



↓



Preview



↓



Countdown



↓



Capture



↓



Generate Polaroid



↓



Save to Gallery



↓



Return to Room



\---



\# Photobooth Experience



The camera should feel like an old instant camera placed on the desk.



Capturing a photo should be a small event.



The resulting image should appear as a printed Polaroid rather than a digital file.



\---



\# Camera Permission



Request browser camera permission only when the module is opened.



Handle



\- Permission granted

\- Permission denied

\- Camera unavailable

\- Multiple cameras

\- Permission revoked



Provide clear recovery instructions when access fails.



\---



\# Camera Preview



Display



\- Live preview

\- Camera selector (if multiple devices)

\- Mirror option

\- Capture button

\- Countdown indicator



Preview should maintain the correct aspect ratio.



\---



\# Countdown



Support



\- 3 seconds

\- 5 seconds

\- 10 seconds

\- Instant capture



Countdown should include subtle visual feedback without loud effects.



\---



\# Photo Capture



Requirements



\- High-resolution capture

\- Automatic orientation correction

\- Timestamp

\- Capture animation

\- Immediate preview



Photos should be stored efficiently without noticeable delay.



\---



\# Polaroid Generation



Each captured image should be transformed into a digital instant photograph.



Include



\- White Polaroid frame

\- Capture date

\- Optional handwritten-style caption

\- Slight paper texture

\- Soft drop shadow



The original image should also be retained internally.



\---



\# Gallery



Layout



Left Sidebar



\- Albums

\- Favorites

\- Timeline

\- Search



Center



\- Photo Grid



Right Sidebar



\- Photo Details

\- Metadata

\- Notes



\---



\# Timeline View



Display photos chronologically.



Support



\- Year

\- Month

\- Day grouping



Scrolling should remain smooth even with large collections.



\---



\# Albums



Default Albums



\- All Photos

\- Favorites

\- Recent



Users can



\- Create albums

\- Rename albums

\- Delete empty albums

\- Move photos between albums



\---



\# Favorites



Support



\- Favorite photo

\- Remove favorite

\- Filter favorites



Favorites persist across sessions.



\---



\# Photo Metadata



Store



\- Capture date

\- Capture time

\- Camera device

\- Resolution

\- Album

\- Favorite status

\- Caption



Future metadata fields can be added without schema changes.



\---



\# Captions



Users can



\- Add caption

\- Edit caption

\- Remove caption



Captions are optional.



No AI caption generation in this phase.



\---



\# Search



Search by



\- Caption

\- Album

\- Date



Support instant filtering.



\---



\# Image Viewer



Features



\- Fullscreen

\- Zoom

\- Pan

\- Previous / Next

\- Metadata panel



Images should load progressively for better performance.



\---



\# Storage



Persist



\- Original image

\- Polaroid version

\- Metadata

\- Albums

\- Favorites

\- Captions



Storage architecture should support future cloud synchronization.



\---



\# Error Handling



Handle



\- Camera unavailable

\- Permission denied

\- Storage full

\- Capture failure

\- Corrupted image

\- Missing metadata



Provide graceful fallback messages.



\---



\# State Management



Create a dedicated Gallery Store.



Track



\- Current photo

\- Selected album

\- Timeline position

\- Favorites

\- Search query

\- Camera status

\- Capture state

\- Loading state

\- Error state



Keep gallery state independent from other modules.



\---



\# Animations



Implement



\- Camera opening

\- Countdown

\- Flash effect

\- Polaroid printing animation

\- Gallery transitions

\- Returning to room



Animations should be subtle and nostalgic.



\---



\# Accessibility



Support



\- Keyboard navigation

\- Screen reader labels

\- Visible focus states

\- Reduced motion

\- High-contrast interface



\---



\# Performance



Targets



\- Camera preview starts in under 2 seconds

\- Photo capture completes in under 1 second

\- Gallery scrolls smoothly

\- Progressive image loading

\- Efficient image compression



\---



\# Testing



✓ Camera permission handled correctly



✓ Preview functions



✓ Countdown works



✓ Capture succeeds



✓ Polaroid generated



✓ Gallery updates



✓ Albums function correctly



✓ Favorites persist



✓ Captions save



✓ Metadata stored correctly



✓ Return to room functions correctly



\---



\# Deliverables



\- Interactive photobooth

\- Webcam integration

\- Countdown capture

\- Polaroid generation

\- Personal gallery

\- Albums

\- Favorites

\- Timeline

\- Metadata management

\- Local image storage



\---



\# Acceptance Criteria



The photobooth feels like using a vintage instant camera rather than a webcam.



The gallery provides a warm, personal archive of memories.



Photos are organized, searchable, and performant even as the collection grows.



The module integrates cleanly with the room while remaining architecturally independent.



\---



\# Constraints



Do not implement AI enhancements.



Do not implement cloud synchronization.



Do not implement social sharing.



Do not record video.



Do not modify the room interaction framework.



Build the photobooth and gallery as self-contained modules that integrate seamlessly with the architecture established in previous phases.

