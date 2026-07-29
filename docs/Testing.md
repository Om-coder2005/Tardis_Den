\# TARDIS Den

\# **11\_Testing\_Checklist.md**



Version: 1.0



Status: Draft



Author: Om Kagilkar



\---



\# 1. Purpose



This document defines the quality assurance process for TARDIS Den.



The objective is to ensure that every feature functions correctly, performs efficiently, and delivers the intended user experience before production release.



Testing should verify not only functionality but also immersion, consistency, accessibility, and performance.



\---



\# 2. Testing Strategy



The project will use multiple layers of testing.



\- Unit Testing

\- Integration Testing

\- End-to-End Testing

\- Performance Testing

\- Accessibility Testing

\- Security Testing

\- Visual Regression Testing

\- Manual Experience Testing



\---



\# 3. Authentication Testing



\## Login



☐ Correct passcode logs in successfully.



☐ Incorrect passcode shows an appropriate error.



☐ Multiple failed attempts trigger rate limiting.



☐ Session persists after page refresh.



☐ Logout destroys session.



☐ Protected routes cannot be accessed without authentication.



☐ Expired sessions redirect to login.



\---



\# 4. Room Testing



\## Initial Load



☐ Room loads without errors.



☐ Camera initializes correctly.



☐ Lighting appears correctly.



☐ Ambient sound starts properly.



☐ Interactive objects are visible.



☐ Hover detection works.



☐ Clicking an object focuses correctly.



☐ Returning to room restores previous state.



\---



\# 5. Bookshelf Testing



☐ Books render correctly.



☐ Book categories load.



☐ Search returns valid results.



☐ Reading interface opens.



☐ Bookmarks save correctly.



☐ Favorites persist.



☐ API failures display graceful fallback.



☐ Loading animations complete correctly.



\---



\# 6. Telescope Testing



☐ Search works.



☐ Images load.



☐ Metadata displays correctly.



☐ Favorites save.



☐ Observation history records correctly.



☐ Invalid searches handled gracefully.



☐ API timeout handled properly.



\---



\# 7. Journal Testing



☐ Create entry.



☐ Edit entry.



☐ Delete entry.



☐ Autosave functions.



☐ Markdown renders correctly.



☐ Search works.



☐ Tags work.



☐ Favorite entries persist.



☐ Images attach successfully.



\---



\# 8. Photobooth Testing



☐ Camera permission requested.



☐ Preview appears.



☐ Countdown functions.



☐ Capture succeeds.



☐ Polaroid generated.



☐ Photo stored.



☐ Gallery updated.



☐ Capture cancellation handled.



☐ Camera unavailable handled gracefully.



\---



\# 9. Gallery Testing



☐ Images load.



☐ Timeline order correct.



☐ Favorites work.



☐ Delete works.



☐ Restore works.



☐ Metadata accurate.



☐ Broken image handled.



\---



\# 10. AI Testing



☐ Book summaries generated.



☐ Image explanations generated.



☐ Journal assistance functions.



☐ Quiz generation works.



☐ Invalid prompts handled.



☐ AI unavailable handled gracefully.



☐ Response streaming works.



\---



\# 11. API Testing



☐ NASA API reachable.



☐ ESA API reachable.



☐ ISS endpoint works.



☐ Caching works.



☐ Retry logic functions.



☐ Invalid responses handled.



☐ Rate limits respected.



\---



\# 12. Database Testing



☐ CRUD operations.



☐ Relationships valid.



☐ Foreign keys enforced.



☐ Soft delete works.



☐ Data restored correctly.



☐ Duplicate records prevented.



\---



\# 13. Storage Testing



☐ Upload image.



☐ Delete image.



☐ Retrieve image.



☐ Invalid upload blocked.



☐ Missing file handled.



☐ Metadata synchronized.



\---



\# 14. Accessibility Testing



☐ Keyboard navigation.



☐ Focus indicators visible.



☐ Reduced motion supported.



☐ Screen reader labels present.



☐ Color contrast passes WCAG AA.



☐ Interactive targets appropriately sized.



\---



\# 15. Performance Testing



☐ Initial load under target.



☐ Smooth camera movement.



☐ Stable 60 FPS interactions.



☐ Lazy loading verified.



☐ Memory usage acceptable.



☐ No unnecessary network requests.



☐ Images optimized.



\---



\# 16. Security Testing



☐ Passcode hashed.



☐ Secure session cookies.



☐ HTTPS enforced.



☐ Input validation.



☐ Output sanitization.



☐ API keys protected.



☐ Unauthorized access blocked.



☐ Rate limiting verified.



\---



\# 17. Responsive Testing



Desktop



☐ Layout correct.



Laptop



☐ Layout correct.



Tablet



☐ Layout usable.



Mobile



☐ Core features accessible.



\---



\# 18. Browser Compatibility



☐ Chrome



☐ Edge



☐ Firefox



☐ Safari



Verify:



Rendering



Animations



Camera



Media



Forms



Storage



\---



\# 19. Visual Regression Testing



☐ Room appearance unchanged.



☐ Colors consistent.



☐ Typography consistent.



☐ Shadows correct.



☐ Animations consistent.



☐ Component spacing correct.



\---



\# 20. Manual Experience Testing



These tests evaluate the overall experience rather than individual features.



Questions:



☐ Does the room feel calm?



☐ Does navigation feel natural?



☐ Are animations purposeful?



☐ Does every object feel meaningful?



☐ Does the room encourage exploration?



☐ Does the application feel like a place rather than a dashboard?



☐ Is the overall experience immersive?



\---



\# 21. Regression Checklist



Before every release verify:



☐ Authentication



☐ Room loading



☐ Bookshelf



☐ Telescope



☐ Journal



☐ Photobooth



☐ Gallery



☐ Computer



☐ Settings



☐ AI



\---



\# 22. Release Checklist



Before Version 1.0:



☐ All functional requirements complete.



☐ All critical bugs resolved.



☐ Performance targets achieved.



☐ Accessibility verified.



☐ Documentation updated.



☐ Security review completed.



☐ Database backup verified.



☐ Environment variables configured.



☐ Production build tested.



☐ Deployment successful.



\---



\# 23. Bug Severity



Critical



Application unusable or data loss.



High



Core feature broken.



Medium



Feature works with noticeable issues.



Low



Minor UI or usability issue.



Cosmetic



Visual inconsistency only.



\---



\# 24. Acceptance Criteria



Version 1.0 is considered complete when:



\- Every feature in the PRD is implemented.

\- All critical and high-severity defects are resolved.

\- Performance goals are achieved.

\- Accessibility requirements meet WCAG AA standards.

\- Security checks pass.

\- Documentation matches the implemented system.

\- The application provides a smooth, immersive, and reliable experience.



\---



\# Final Principle



A feature is not finished when it works.



A feature is finished when it is reliable, performant, accessible, visually consistent, and aligns with the vision of TARDIS Den.

