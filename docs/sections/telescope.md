# Telescope Section Specification

## 1. Overview & Purpose
The **Telescope** (Zone B: Observation Area) is the primary window to the cosmos. It allows users to observe deep space objects, explore star catalogs, inspect celestial imagery, and study astronomical coordinates.

---

## 2. Included Features & Functionalities

### Camera & Viewport Navigation (`TelescopeModule.tsx`)
- **Telescope Focus Transition**: Smooth camera zooming from room perspective directly into the eyepiece of the telescope.
- **Viewport Controls**: Pan, tilt, and zoom controls for navigating celestial observation imagery.

### Observation Tools (`ObservationViewer.tsx`, `ObservationBrowser.tsx`, `ObservatorySidebar.tsx`)
- **Target Browser (`ObservationBrowser.tsx`)**: Categorized grid of observable targets including planets, nebulae, star clusters, and galaxies.
- **High-Resolution Inspection (`ObservationViewer.tsx`)**: Canvas viewer for inspecting selected celestial targets at high magnification.
- **Astronomical Metadata Sidebar (`ObservatorySidebar.tsx`)**: Displays scientific metadata (RA/Dec coordinates, light-year distance, constellation, spectral class, observation logs).

---

## 3. Current Implementation Status

### ✅ Working Features
1. **Camera Zoom & Mode Switch**: Smooth transition between 3D room view and full-screen telescope observation viewport.
2. **Celestial Catalog Filtering**: Browsing and filtering targets by category (Deep Sky, Solar System, Stars).
3. **High-Res Imagery Viewport**: Pan and zoom controls for detailed image examination.
4. **Metadata Inspection**: Viewing detailed information, distance, and coordinates for selected celestial bodies.

### ❌ Non-Working / Planned Features
1. **Interactive Constellation Overlay**: Vector line overlays mapping constellations dynamically onto the viewport.
2. **AI Voice Celestial Guide**: AI Companion voice narration explaining scientific details when focusing on specific targets.

### ⚠️ Redundant / Mocked Components
1. **Live Sky API Telemetry**: Coordinates and imagery currently rely on local target definitions and static image assets rather than live telescope APIs (e.g. Aladin Sky Atlas / NASA SkyView).
