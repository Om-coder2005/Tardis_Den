# Resting Area Section Specification

## 1. Overview & Purpose
The **Resting Area** (Zone F: Comfort Area) serves as a sanctuary within TARDIS Den designed for relaxation, focus, soundscapes, and passive observation of space visuals. It balances technical utilities with cozy environmental storytelling.

---

## 2. Included Features & Functionalities

### Ambient Controls & Soundscapes
- **Audio Player Toolbar (`AudioPlayerToolbar.tsx`)**: Ambient audio player supporting background tracks (lo-fi, rain, space hum, campfire sounds) with volume controls.
- **Pomodoro / Focus Timer (`TimerWidget.tsx`)**: Countdown timer widget supporting work/rest cycles, pause/resume, and sound alerts.
- **Media Playback Controller (`MediaWidget.tsx`)**: Media widget for playback management and audio track switching.

### External Visual Windows
- **Campfire Stream (`CampfireWindow.tsx`)**: Relaxing ambient video/animation overlay.
- **NASA APOD Viewer (`NasaWindow.tsx`)**: Window fetching and displaying NASA Astronomy Picture of the Day images and descriptions.
- **ISS / Astronaut Tracker (`AstrosWindow.tsx`)**: Live tracker displaying current occupants and telemetry from space stations.

### Layout & Navigation (`RestAreaModule.tsx`, `RestCenter.tsx`, `RestSidebar.tsx`, `RestWidgets.tsx`)
- **Resting Dashboard**: Central layout bringing together widgets, ambient controls, and streaming windows.

---

## 3. Current Implementation Status

### ✅ Working Features
1. **Dynamic Royalty-Free Music Stream Engine ([MediaWidget.tsx](file:///d:/the_space/frontend/src/features/rest/components/MediaWidget.tsx))**: Replaced hardcoded ambient tracks with dynamic music streaming API (`/api/external/music`). Users can search vibes/genres (chillout, ambient, lofi, classical, piano, space) live.
2. **ZenQuotes Daily Mindfulness API**: Fetches live daily mindfulness quotes (`/api/external/quote`) inside the evening reflection prompt cards.
3. **Pomodoro Focus Timer**: Functional countdown timer supporting work/rest cycles and countdown progress indicators.
4. **Cloudinary NASA APOD Window**: Optimized daily astronomy picture fetching with WebP conversion.
5. **ISS Astronaut Tracker Window**: Renders live human space station occupants and telemetry details.

---

## 4. Connected APIs & Efficiency

- **Jamendo Free Music API**: Streaming royalty-free music tracks (`api.jamendo.com/v3.0/tracks`).
- **ZenQuotes API**: Daily mindfulness quotes (`zenquotes.io/api/today`).
- **NASA APOD & Open-Notify ISS APIs**: Daily astronomy image & astronaut tracking.
- **Cloudinary Image Optimizer**: Auto WebP image compression for NASA daily imagery.
