\# TARDIS Den

**# 06\_System\_Architecture.md**



Version: 1.0



Status: Draft



Author: Om Kagilkar



\---



\# 1. Purpose



This document defines the complete software architecture of TARDIS Den.



It specifies how the frontend, backend, database, storage, external APIs, and AI services communicate while remaining modular, maintainable, and scalable.



The architecture prioritizes:



\- Modular development

\- Independent feature modules

\- Easy future expansion

\- High performance

\- Clean separation of concerns



\---



\# 2. Architectural Principles



The architecture shall follow these principles.



\## AP-001 Modularity



Each room object shall function as an independent module.



Examples



Bookshelf



Journal



Telescope



Photobooth



Computer



Each module owns:



UI



Business Logic



API Calls



State



Assets



\---



\## AP-002 Separation of Concerns



The frontend never communicates directly with external APIs.



All requests pass through the backend.



Frontend



↓



Backend



↓



NASA API



This allows:



Caching



Authentication



Security



Rate limiting



API replacement



\---



\## AP-003 Feature-Based Architecture



Instead of grouping files by type,



group them by feature.



Example



features/



journal/



bookshelf/



telescope/



gallery/



photobooth/



computer/



auth/



Each feature contains



components



hooks



types



services



utils



assets



tests



\---



\## AP-004 Stateless Backend



Backend services should remain stateless.



Persistent information belongs inside the database.



Uploaded media belongs inside object storage.



\---



\## AP-005 Progressive Enhancement



The room should remain usable even when:



AI is unavailable



NASA API is unavailable



Network is slow



Some services fail



Failures should degrade gracefully.



\---



\# 3. High-Level Architecture



Administrator



↓



Frontend (React)



↓



Backend API



↓



Database



↓



Storage



↓



External APIs



↓



AI Services



\---



\# 4. Frontend Architecture



Framework



React



Language



TypeScript



Build Tool



Vite



State Management



Zustand



Routing



React Router



Animation



Framer Motion



2.5D Isometric Rendering



Framer Motion



Styling



Tailwind CSS



Icons



Lucide



\---



Frontend Responsibilities



Authentication UI



Room Rendering



Animations



Camera Movement



Interaction Handling



State Management



API Communication



Media Playback



Accessibility



\---



\# 5. Backend Architecture



Runtime



Node.js



Framework



Express



Responsibilities



Authentication



Session Management



Journal Management



Gallery



Media Upload



NASA Proxy



AI Proxy



Caching



Logging



Validation



Rate Limiting



\---



\# 6. Module Architecture



Each module follows the same structure.



Module



↓



UI



↓



State



↓



Business Logic



↓



API Layer



↓



Backend



Example



Bookshelf



Bookshelf UI



↓



Bookshelf Store



↓



Bookshelf Service



↓



Backend Endpoint



↓



NASA



\---



\# 7. Database Layer



Primary Database



PostgreSQL



ORM



Prisma



Stores



Users



Journal Entries



Bookmarks



Settings



Favorites



Metadata



Does NOT store



Images



Videos



Large files



\---



\# 8. Storage Layer



Purpose



Store media.



Recommended



Supabase Storage



Alternative



Cloudinary



Stores



Polaroids



Journal Images



User Uploads



Generated Images



\---



\# 9. API Gateway



The backend acts as a gateway.



Never expose API keys to the frontend.



Responsibilities



Authentication



Caching



Transformation



Validation



Rate Limiting



Retry Logic



Logging



\---



\# 10. External Services



Space APIs



NASA



ESA



Hubble



JWST



ISS



Spaceflight News



AI



OpenAI



Future LLM Providers



Storage



Supabase



Cloudinary



\---



\# 11. Authentication Flow



Landing Page



↓



Passcode Entry



↓



Backend Validation



↓



Session Created



↓



Room Loaded



↓



Session Refresh



↓



Logout



↓



Session Destroyed



\---



\# 12. Request Flow



Administrator



↓



React Component



↓



Feature Service



↓



HTTP Client



↓



Backend API



↓



External API



↓



Response Mapping



↓



State Update



↓



UI Render



\---



\# 13. Error Handling



Frontend



Display friendly messages.



Backend



Log detailed errors.



API



Retry when appropriate.



Database



Rollback failed transactions.



Storage



Prevent broken references.



\---



\# 14. Caching Strategy



NASA Responses



Cache



Space Articles



Cache



Static Assets



Long Cache



Journal



No Cache



Authentication



No Cache



\---



\# 15. Security



Hash administrator passcode.



HTTPS only.



Secure Cookies.



Rate Limiting.



Input Validation.



Output Sanitization.



Content Security Policy.



Environment Variables.



Never expose secrets.



\---



\# 16. Logging



Backend Logs



Authentication



API Calls



Errors



Warnings



Storage Uploads



Performance



Frontend Logs



Development only.



Production logs should remain minimal.



\---



\# 17. Scalability



Future architecture should support



Additional Rooms



Plugin Modules



Multiple Themes



Multiple AI Providers



Additional APIs



Multiple Storage Providers



Future Authentication Methods



No module should depend directly on another module's internal implementation.



Communication should occur through clearly defined interfaces.



\---



\# 18. Performance Goals



Initial Load



<3 seconds



Interaction Delay



<100ms



Animation



60 FPS



Lazy Loading



Required



Image Optimization



Required



Asset Compression



Required



\---



\# 19. Folder Structure



frontend/



&#x20;   app/



&#x20;   components/



&#x20;   features/



&#x20;       auth/



&#x20;       room/



&#x20;       bookshelf/



&#x20;       telescope/



&#x20;       journal/



&#x20;       photobooth/



&#x20;       gallery/



&#x20;       computer/



&#x20;       settings/



&#x20;   hooks/



&#x20;   services/



&#x20;   store/



&#x20;   types/



&#x20;   assets/



backend/



&#x20;   src/



&#x20;       auth/



&#x20;       journal/



&#x20;       telescope/



&#x20;       gallery/



&#x20;       uploads/



&#x20;       ai/



&#x20;       nasa/



&#x20;       middleware/



&#x20;       routes/



&#x20;       prisma/



&#x20;       utils/



shared/



&#x20;   types/



&#x20;   constants/



docs/



\---



\# 20. Guiding Principle



Every feature should be capable of evolving independently.



The room is one experience.



The codebase is many independent modules working together.

