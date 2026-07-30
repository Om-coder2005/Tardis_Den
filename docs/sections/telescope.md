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
2. **NASA APOD Daily Ticker**: Live daily Astronomy Picture of the Day banner with auto-optimized Cloudinary image delivery.
3. **NASA Image & Video Library Search**: Real-time celestial catalog search & sector filtering (Deep Sky, Nebulae, Planets, Supernova).
4. **CDS Aladin Lite v3 Interactive Sky Atlas**: Real-time sky map survey navigation powered by Strasbourg astronomical CDS services (`AladinSkyMap.tsx`).
5. **NASA NeoWS & Live ISS Radar**: Live daily Near-Earth Asteroid detection and 5-second polling of International Space Station latitude/longitude orbit telemetry (`NearEarthTracker.tsx`).
6. **High-Res Inspection & Captain's Log**: Inspection viewport with pan/zoom controls and persistence of observation notes in the database.

---

## 4. Connected APIs & Efficiency

- **CDS Aladin Lite v3 CDN**: Real-time interactive sky survey (`aladin.cds.unistra.fr`).
- **NASA Image & Video Library API**: Live search for thousands of real Hubble & JWST space photos (`images-api.nasa.gov`).
- **NASA APOD & NeoWS Asteroid API**: Daily astronomy imagery & close-approach asteroid telemetry (`api.nasa.gov`).
- **Open-Notify ISS Tracker API**: 5-second interval polling for real-time ISS orbital coordinates (`api.open-notify.org/iss-now.json`).
- **Cloudinary Image Optimization**: Auto WebP/AVIF format conversion and dynamic thumbnail scaling for zero-latency viewport rendering.
