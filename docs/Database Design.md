\# TARDIS Den

\# **07\_Database\_Design.md**



Version: 1.0



Status: Draft



Author: Om Kagilkar



\---



\# 1. Purpose



This document defines the database architecture for TARDIS Den.



The database is responsible for storing structured application data.



It should never store large binary assets such as images or videos.



Media files are stored in object storage, while the database stores only metadata and references.



\---



\# 2. Design Principles



\## DB-001 Normalize Data



Avoid duplicate information whenever possible.



\---



\## DB-002 Store References



Images, videos and documents should be stored in object storage.



The database stores only URLs and metadata.



\---



\## DB-003 Audit Everything



Every important record should contain



createdAt



updatedAt



\---



\## DB-004 Soft Delete



Where appropriate, records should support soft deletion.



\---



\## DB-005 UUID Primary Keys



Every table uses UUID as its primary key.



\---



\# 3. Database Technology



Database



PostgreSQL



ORM



Prisma



Migration Tool



Prisma Migrate



\---



\# 4. Entity Overview



Core Entities



Administrator



Journal Entry



Journal Image



Photo



Book Bookmark



Observation



Favorite



Room Setting



System Setting



Session



\---



\# 5. Administrator



Table



Administrator



Purpose



Stores administrator credentials.



Fields



id



passcodeHash



createdAt



updatedAt



lastLogin



Only one administrator exists in Version 1.



\---



\# 6. Session



Table



Session



Purpose



Maintain authenticated sessions.



Fields



id



administratorId



token



expiresAt



createdAt



lastActivity



Supports secure login persistence.



\---



\# 7. Journal Entry



Table



JournalEntry



Purpose



Stores daily diary entries.



Fields



id



title



content



mood (optional)



date



createdAt



updatedAt



isPinned



isFavorite



deletedAt



\---



\# 8. Journal Image



Table



JournalImage



Purpose



Connect uploaded images with journal entries.



Fields



id



journalEntryId



photoId



position



caption



createdAt



\---



\# 9. Photo



Table



Photo



Purpose



Stores metadata for captured photographs.



Fields



id



storageUrl



thumbnailUrl



width



height



caption



takenAt



createdAt



favorite



deletedAt



The actual image is stored in cloud storage.



\---



\# 10. Books



Table



Book



Purpose



Represents bookshelf topics.



Version 1 uses predefined topics.



Fields



id



title



category



icon



apiSource



displayOrder



isVisible



\---



\# 11. Book Bookmark



Table



BookBookmark



Purpose



Stores reading progress.



Fields



id



bookId



page



note



createdAt



updatedAt



\---



\# 12. Observation



Table



Observation



Purpose



Stores telescope search history.



Fields



id



title



objectType



searchQuery



imageUrl



description



apiSource



observedAt



favorite



\---



\# 13. Favorite



Table



Favorite



Purpose



Centralized favorite system.



Fields



id



entityType



entityId



createdAt



Supports



Books



Observations



Photos



Journal Entries



Future modules



\---



\# 14. Room Setting



Table



RoomSetting



Purpose



Stores visual preferences.



Fields



id



theme



musicEnabled



musicVolume



ambientVolume



reducedMotion



showTooltips



createdAt



updatedAt



\---



\# 15. System Setting



Table



SystemSetting



Purpose



Application configuration.



Fields



id



key



value



description



\---



\# 16. AI Conversation



Table



AIConversation



Purpose



Stores conversation history with AI.



Fields



id



context



prompt



response



createdAt



Future feature.



\---



\# 17. Relationships



Administrator



↓



Session



Journal Entry



↓



Journal Image



↓



Photo



Book



↓



Book Bookmark



Observation



↓



Favorite



Photo



↓



Favorite



Journal Entry



↓



Favorite



\---



\# 18. Indexes



JournalEntry.date



Photo.takenAt



Observation.observedAt



Favorite.entityId



Book.category



Session.token



Indexes should prioritize read performance.



\---



\# 19. Constraints



Passcode hash required.



Journal content required.



Storage URL required for photos.



Observation timestamp required.



Unique session token.



Foreign keys enforced.



\---



\# 20. Object Storage Strategy



Database stores



URLs



Dimensions



Metadata



Captions



Dates



Cloud storage stores



Original images



Generated images



Polaroids



Future videos



\---



\# 21. Backup Strategy



Daily automated database backup.



Weekly full backup.



Monthly archive.



Media handled separately by storage provider.



\---



\# 22. Future Tables



Achievement



RoomDecoration



Collectible



Theme



Plugin



PlanetariumSession



VoiceConversation



These are intentionally excluded from Version 1.



\---



\# 23. Estimated Database Size



Version 1 is expected to remain lightweight.



Typical usage



Journal Entries



Less than 10,000



Photos



Less than 5,000



Observations



Less than 20,000



Bookmarks



Less than 5,000



Performance should remain excellent without database sharding or partitioning.



\---



\# 24. Data Retention



Journal entries are permanent unless deleted.



Photos remain until manually removed.



Observations can be cleared by the administrator.



Bookmarks persist indefinitely.



Settings persist indefinitely.



\---



\# 25. Guiding Principle



The database should store only structured information.



Large assets belong in object storage.



Every entity should represent one clear responsibility and remain independent of unrelated features.

