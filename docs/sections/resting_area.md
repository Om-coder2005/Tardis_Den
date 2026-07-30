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
1. **Ambient Audio Playback**: Selecting ambient audio streams, volume adjustment, and playback toggle.
2. **Pomodoro Timer**: Functional timer start, pause, reset, and duration configuration.
3. **NASA APOD Window**: Fetching and displaying NASA daily astronomy imagery with fallback content handling.
4. **ISS Occupants Tracker**: Rendering current astronauts in space with telemetry details inside `AstrosWindow`.
5. **Widget Grid Layout**: Toggle and layout management for rest area tools.

### ❌ Non-Working / Planned Features
1. **Interactive 3D Furniture**: Interactive animations for sitting on the bed or folding/unfolding the crochet blanket in 3D canvas mode.
2. **Custom Audio Upload**: Uploading custom MP3/audio files to the soundscape player (currently limited to pre-configured audio tracks).

### ⚠️ Redundant / Mocked Components
1. **Campfire Animation Stream**: `CampfireWindow` uses pre-rendered canvas fallback animations when external video streams fail to load.
2. **Dynamic Room Lighting Sync**: Audio frequency reactive lighting (changing room ambient lights based on playing soundscapes) is currently stubbed out.
