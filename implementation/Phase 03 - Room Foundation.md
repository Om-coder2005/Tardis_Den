\# TARDIS Den

\# **Phase 03 - Room Foundation**



Version: 1.0



Status: Ready for Implementation



\---



\# Goal



Build the core interactive room that serves as the foundation of TARDIS Den.



This phase creates the room itself—not the functionality of individual objects.



Every interactive feature in future phases will plug into this foundation.



\---



\# Objectives



Implement



\- 2.5D / Isometric Room

\- Scene Management

\- Camera System

\- Lighting

\- Object Interaction Framework

\- Navigation

\- Ambient Audio

\- Room State Management

\- Responsive Rendering



Do NOT implement



Bookshelf functionality



Telescope functionality



Journal



Desktop



AI



Gallery



Photobooth



API integrations



Business logic for room objects



\---



\# Scene Overview



The room represents a peaceful astronomy workspace.



Visible Objects



\- Window

\- Telescope

\- Bookshelf

\- Desk

\- Chair

\- Computer

\- Bed

\- Rug

\- Lamp

\- Plants

\- Wall Frames

\- Clock

\- Journal

\- Camera

\- Shelf Decorations



Objects should exist visually but remain non-functional unless explicitly enabled in later phases.



\---



\# Rendering Engine



Use



Framer Motion



CSS Transforms



React



Requirements



\- Stable render loop

\- Optimized Interaction Engine

\- Lazy asset loading

\- Asset preloading

\- Responsive Layer Manager



Target



60 FPS on modern desktop hardware.



\---



\# Camera System



Camera Type



Isometric Camera (2.5D)



Features



\- Smooth movement

\- Damped transitions

\- Click-to-focus

\- Return-to-home animation

\- Zoom limits

\- Fixed room boundaries



The camera should never clip through walls or objects.



\---



\# Navigation



Users do not walk inside the room.



Interaction occurs by selecting objects.



Flow



Room View



↓



Hover Object



↓



Highlight



↓



Click



↓



Camera Focus



↓



Future Module Opens



For this phase, clicking only moves the camera and displays a placeholder interaction panel.



\---



\# Object Registry



Create a centralized registry for all room objects.



Each object should define



\- Unique ID

\- Display Name

\- Position

\- Rotation

\- Scale

\- Bounding Box

\- Interaction Target

\- Future Module Identifier



Future phases will attach behavior without modifying the room architecture.



\---



\# Interaction Framework



Each object should support



Hover



Focus



Selection



Deselection



Disabled State



Interaction events must be reusable across all room modules.



\---



\# Hover Behavior



When hovering over an object



\- Cursor changes

\- Soft outline appears

\- Slight elevation or glow

\- Tooltip displays object name



Avoid exaggerated animations.



\---



\# Focus Animation



On click



\- Camera eases toward the object

\- Selected object becomes active

\- Background objects subtly de-emphasize

\- Placeholder interaction card appears



ESC or Back returns to the default room view.



\---



\# Lighting



Primary



Warm evening sunlight through the window.



Secondary



Desk lamp.



Ambient



Soft indirect room lighting.



Requirements



\- Physically believable

\- No harsh shadows

\- Calm atmosphere

\- Performance friendly



\---



\# Environment



Implement



\- Soft sky outside window

\- Subtle cloud movement

\- Gentle dust particles

\- Minimal atmospheric effects



Do not implement weather systems.



\---



\# Audio



Ambient Loop



\- Quiet room tone

\- Soft wind

\- Occasional distant birds

\- Light page rustle



Requirements



\- Volume controls

\- Fade in/out

\- Mute support



No object-specific sounds yet.



\---



\# Room State



Create a dedicated Room Store.



Track



\- Camera position

\- Focused object

\- Hovered object

\- Audio state

\- Theme

\- Interaction mode



Future modules should extend this state rather than replacing it.



\---



\# Placeholder Interaction Panel



When an object is selected, display a lightweight panel containing



\- Object Name

\- Short Description

\- "Coming Soon" message

\- Close Button



This verifies the interaction architecture without implementing module functionality.



\---



\# Asset Management



Organize assets by category.



Example



assets/



layers/



images/



sprites/



audio/



icons/



environment/



Optimize



\- Image compression (PNG/SVG)

\- Asset optimization

\- Lazy loading



\---



\# Performance



Targets



Initial room load under 3 seconds.



Stable 60 FPS.



Minimal unnecessary re-renders.



CSS will-change optimized.



Image resolution appropriate to screen size.



\---



\# Accessibility



Support



\- Keyboard navigation between objects

\- Visible focus states

\- Reduced motion preference

\- Sufficient color contrast

\- Screen reader labels for interaction panel



\---



\# Responsive Behavior



Desktop



Full room experience.



Tablet



Adjusted camera framing.



Mobile



Read-only overview with object selection support.



Maintain usability without redesigning the room.



\---



\# Testing



✓ Scene renders successfully



✓ Camera transitions smoothly



✓ Hover detection works



✓ Object selection works



✓ Placeholder panel opens



✓ ESC returns to room



✓ Ambient audio functions



✓ Responsive layout verified



✓ Stable performance target achieved



\---



\# Deliverables



\- Interactive room scene

\- Camera system

\- Lighting setup

\- Object registry

\- Interaction framework

\- Placeholder interaction panel

\- Ambient environment

\- Room state management



\---



\# Acceptance Criteria



The room feels like a cohesive, immersive place rather than a dashboard.



All visible objects are selectable.



The interaction architecture is reusable.



Performance targets are met.



No functional room modules are implemented yet.



The project is fully prepared for Phase 04.



\---



\# Constraints



Do not connect any room object to business logic.



Do not implement APIs.



Do not implement AI.



Do not implement data persistence.



Focus entirely on creating a stable, extensible room foundation that future phases can build upon without architectural changes.

