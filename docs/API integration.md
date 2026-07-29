\# TARDIS Den

\# **08\_API\_Integration.md**



Version: 1.0



Status: Draft



Author: Om Kagilkar



\---



\# 1. Purpose



This document defines every external service integrated into TARDIS Den.



The objective is to provide a secure, maintainable and modular API architecture where the frontend never communicates directly with third-party services.



All external requests must pass through the backend API.



\---



\# 2. API Architecture



Administrator



↓



Frontend (React)



↓



Backend API



↓



Service Layer



↓



External APIs



↓



Response Mapping



↓



Frontend



The backend is responsible for



Authentication



Validation



Caching



Retry Logic



Error Handling



Response Transformation



Logging



Rate Limiting



\---



\# 3. General Integration Rules



API-001



Never expose API keys to the frontend.



\---



API-002



Every external service must have its own service module.



Example



/services



nasa.service.ts



esa.service.ts



iss.service.ts



news.service.ts



ai.service.ts



\---



API-003



Every external response should be transformed into a common internal format before returning to the frontend.



Never expose raw API responses directly.



\---



API-004



Gracefully handle failures.



If one provider fails,



the room must remain usable.



\---



\# 4. NASA API



Purpose



Primary astronomy data provider.



Documentation



https://api.nasa.gov/



Authentication



NASA API Key



Free Tier



Supported Modules



Astronomy Picture of the Day



Mars Rover Photos



EPIC



Near Earth Objects



DONKI



NASA Image Library



Future Mission Data



\---



\### APOD



Purpose



Daily astronomy image.



Usage



Room Calendar



Today's Discovery



Wallpaper Suggestions



Recommended Cache



24 Hours



\---



\### Mars Rover



Purpose



Retrieve Mars rover images.



Usage



Bookshelf



Telescope



Learning Module



Recommended Cache



7 Days



\---



\### EPIC



Purpose



Earth imagery.



Usage



Window



Earth Observation



Recommended Cache



12 Hours



\---



\### NEO



Purpose



Near-Earth Objects.



Usage



Observation Center



Space Alerts



Recommended Cache



24 Hours



\---



\### DONKI



Purpose



Space weather.



Usage



Solar Activity



Aurora Information



Recommended Cache



6 Hours



\---



\# 5. NASA Image \& Video Library



Purpose



High-quality media.



Usage



Books



Gallery



AI Explanations



Image Viewer



Recommended Cache



30 Days



\---



\# 6. ESA APIs



Purpose



European Space Agency content.



Usage



Research



Satellite Missions



Images



Educational Articles



Priority



Secondary provider.



Used when NASA data is unavailable or incomplete.



\---



\# 7. Hubble Archive



Purpose



Retrieve Hubble imagery.



Usage



Bookshelf



Image Viewer



Observations



Cache



30 Days



\---



\# 8. James Webb Data



Purpose



Display JWST observations.



Usage



Deep Space Exploration



High Resolution Images



Educational Content



\---



\# 9. Open Notify



Purpose



ISS Position



Astronaut Count



Usage



Window



Interactive Globe



Observation Panel



Refresh



Every 60 seconds.



\---



\# 10. Le Systeme Solaire API



Purpose



Planetary information.



Usage



Planet Explorer



Bookshelf



Search



Educational Content



Cache



30 Days



\---



\# 11. Spaceflight News API



Purpose



Latest space news.



Usage



Desk Computer



News Feed



Learning



Cache



30 Minutes



\---



\# 12. AI Service



Purpose



Natural language assistance.



Capabilities



Explain astronomy concepts.



Summarize articles.



Generate quizzes.



Suggest related topics.



Summarize journal entries.



Never expose provider-specific implementation to the frontend.



\---



\# 13. Media Storage Service



Recommended



Supabase Storage



Alternative



Cloudinary



Usage



Journal Photos



Polaroids



User Uploads



Generated Images



\---



\# 14. Webcam API



Browser API



MediaDevices



Purpose



Photobooth



Requirements



Permission request



Preview



Capture



Image export



No server interaction until user saves.



\---



\# 15. Browser APIs



Clipboard



Optional



Download



Optional



Fullscreen



Optional



Notifications



Future Feature



Local Storage



Preferences



Session Recovery



\---



\# 16. Internal API Endpoints



Authentication



POST /api/auth/login



POST /api/auth/logout



GET /api/auth/session



\---



Bookshelf



GET /api/books



GET /api/books/:id



GET /api/books/search



\---



Journal



GET /api/journal



GET /api/journal/:id



POST /api/journal



PATCH /api/journal/:id



DELETE /api/journal/:id



\---



Gallery



GET /api/gallery



POST /api/gallery/upload



DELETE /api/gallery/:id



\---



Photobooth



POST /api/photobooth/save



\---



Telescope



GET /api/space/search



GET /api/space/image



GET /api/space/apod



GET /api/space/mars



GET /api/space/iss



\---



AI



POST /api/ai/chat



POST /api/ai/summarize



POST /api/ai/quiz



POST /api/ai/explain



\---



Settings



GET /api/settings



PATCH /api/settings



\---



\# 17. Error Response Format



Every endpoint should return a consistent structure.



Success



status



message



data



timestamp



Failure



status



error



message



code



timestamp



\---



\# 18. Rate Limiting



Authentication



Strict



NASA APIs



Moderate



AI Endpoints



Strict



Gallery Upload



Moderate



General Requests



Standard



\---



\# 19. Retry Policy



Retry only when



Timeout



Temporary network failure



5xx response



Never retry



Authentication failures



Validation errors



Permission denied



Not Found



\---



\# 20. Caching Strategy



NASA



24 Hours



Planet Data



30 Days



ISS



60 Seconds



News



30 Minutes



Journal



No Cache



Authentication



No Cache



Settings



Session Cache



\---



\# 21. Security



Environment variables for all API keys.



Validate every request.



Sanitize every response.



Enable CORS only for approved origins.



Use HTTPS exclusively.



Never expose secrets to the client.



\---



\# 22. Monitoring



Track



API latency



Error rates



Failed requests



Cache hit ratio



Upload failures



Authentication failures



These metrics should be logged by the backend for monitoring and debugging.



\---



\# 23. Future Integrations



NASA Live Streams



ESA Live Missions



Sky Map APIs



Weather APIs



Star Catalog APIs



Planetarium APIs



Satellite Tracking APIs



Voice AI Providers



Custom AI Models



All future integrations must follow the same backend proxy architecture established in this document.



\---



\# 24. Guiding Principle



External services provide data.



The backend transforms that data into a consistent experience.



The administrator should never know which provider supplied the information.



Every interaction should feel like a natural extension of the room rather than a collection of disconnected APIs.

