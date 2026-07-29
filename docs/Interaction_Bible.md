\# TARDIS Den

\# **04\_Interaction\_Bible.md**



Version: 1.0



Status: Draft



Author: Om Kagilkar



\---



\# 1. Purpose



This document defines how every interactive object behaves inside TARDIS Den.



The objective is to create one consistent interaction language throughout the application.



Regardless of which object the administrator interacts with, the experience should always feel smooth, natural, and believable.



This document defines interaction principles rather than implementation details.



\---



\# 2. Interaction Principles



\### INT-001 — Physical First



Interactions should imitate real-world behavior whenever possible.



Examples:



\- Books slide before opening.

\- Journal unfolds before showing pages.

\- Telescope rotates toward the selected target.

\- Computer screen powers on before showing the desktop.



Never instantly replace one screen with another.



\---



\### INT-002 — One Focus At A Time



Only one object can be active.



Opening another object automatically closes the current interaction.



\---



\### INT-003 — Camera Is Navigation



The administrator never "opens a page."



Instead, the camera moves naturally toward the selected object.



\---



\### INT-004 — Animation Must Explain



Every animation should communicate state.



Animation should never exist only for decoration.



\---



\### INT-005 — Interruptible Motion



Camera movement and object animations should be cancellable.



The user should never feel trapped inside an animation.



\---



\# 3. Global Object States



Every interactive object supports the following lifecycle.



Idle



↓



Hover



↓



Focused



↓



Loading (optional)



↓



Active



↓



Closing



↓



Idle



\---



\## Idle



Object remains at rest.



No movement.



Only ambient lighting.



\---



\## Hover



Mouse enters object.



Behavior



• Slight elevation



• Soft glow



• Cursor changes



• Tooltip (optional)



Duration



150–200 ms



\---



\## Focused



After click.



Behavior



• Camera moves.



• Background slightly de-emphasizes.



• Object becomes primary focus.



\---



\## Loading



Only shown if external data is required.



Behavior



Small elegant loading animation.



No full-screen spinners.



\---



\## Active



Object becomes fully usable.



User interaction begins.



\---



\## Closing



Camera returns.



Object resets.



Ambient state restored.



\---



\# 4. Camera Behavior



Camera movement should feel cinematic.



Never robotic.



\### Rules



Smooth acceleration.



Smooth deceleration.



No sudden jumps.



No instant zooms.



Camera always keeps room context visible.



\---



\### Camera Timing



Minor movement



300–450 ms



Major movement



600–900 ms



Return movement



400–700 ms



\---



\# 5. Hover Guidelines



Hover should communicate possibility.



Never excitement.



Effects may include



Small elevation



Soft glow



Tiny rotation



Light reflection



Very small scale increase



Avoid



Large bouncing



Fast pulsing



Aggressive shadows



\---



\# 6. Click Guidelines



Click confirms intention.



Every click should provide immediate feedback.



Possible responses



Object movement



Sound effect



Camera motion



Lighting adjustment



Micro vibration



\---



\# 7. Bookshelf Interaction



Idle



Books aligned.



Hover



Selected book extends slightly.



Click



Book slides outward.



Camera approaches.



Book opens.



Pages animate.



Loading



Content loads.



Active



Reading mode.



Close



Book closes.



Slides back.



Camera returns.



\---



\# 8. Telescope Interaction



Idle



Telescope points outside.



Hover



Lens catches light.



Click



Camera approaches.



Telescope rotates.



Search interface appears.



Loading



Space data retrieved.



Active



Image viewer.



Information panel.



Close



Lens returns.



Camera moves back.



\---



\# 9. Journal Interaction



Idle



Closed notebook.



Hover



Cover lifts slightly.



Click



Notebook opens.



Pages settle.



Active



Writing.



Photo attachment.



Bookmark navigation.



Close



Pages close.



Notebook returns.



\---



\# 10. Camera Booth



Idle



Camera inactive.



Hover



Lens reflection.



Click



Preview opens.



Countdown.



Capture.



Photo prints.



Polaroid develops.



Gallery updates.



Return to room.



\---



\# 11. Computer



Idle



Monitor asleep.



Hover



Power LED glows.



Click



Monitor powers on.



Boot animation.



Desktop appears.



Applications become available.



Close



Screen powers down.



\---



\# 12. Window



Window is never directly opened.



Interaction



Hover



Cursor changes.



Click



Camera approaches.



Expanded observation mode.



Constellations.



Planet labels.



ISS tracking.



Return



Camera returns.



\---



\# 13. Error Handling



Errors should feel gentle.



Never alarming.



Examples



Bookshelf



Unable to load article.



Show elegant retry.



Telescope



Observation unavailable.



Suggest another search.



Journal



Autosave failed.



Retry silently.



\---



\# 14. Sound Feedback



Every interaction should have subtle sound.



Examples



Book movement



Soft paper.



Journal



Page turn.



Camera



Mechanical shutter.



Computer



Power-on chime.



Telescope



Gentle mechanical rotation.



Window



Soft wind.



Avoid repetitive sounds.



\---



\# 15. Keyboard Support



ESC



Close active interaction.



ENTER



Confirm.



TAB



Move focus.



ARROW KEYS



Navigate pages where appropriate.



SPACE



Secondary interaction if applicable.



\---



\# 16. Performance Rules



Interactions should remain responsive.



Target response



<100 ms visual feedback.



Animations



60 FPS target.



Large content



Lazy loaded.



External requests



Background loading.



\---



\# 17. Accessibility



Every interaction should be available without a mouse.



Reduced motion mode should simplify animations.



All interactive objects require accessible labels.



Focus indicators must remain visible.



\---



\# 18. Consistency Rules



Every object should answer these questions.



How does it look when idle?



How does it respond to hover?



What happens on click?



How does it load data?



How does it close?



What happens on failure?



If any answer differs significantly from other objects, redesign the interaction unless there is a strong reason not to.



\---



\# Guiding Principle



Interactions should feel less like operating software and more like naturally engaging with meaningful objects inside a real room.

