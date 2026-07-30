# Work Desk Section Specification

## 1. Overview & Purpose
The **Work Desk** represents the technology and administrative core of TARDIS Den (encompassing Zone C: Memory Area and Zone D: Technology Area). It serves as the primary workspace where the user interacts with system utilities, desktop applications, configuration settings, data archives, and photo memory tools.

---

## 2. Included Features & Functionalities

### Desktop Computer OS (`ComputerModule.tsx`)
- **Desktop Environment Interface**: Embedded windowing system simulating a personal workstation desktop.
- **Settings App (`SettingsApp.tsx`)**: Comprehensive configuration panel for application preferences, API keys, AI model selection, sound/audio levels, and theme customizations.
- **Data Archive App (`DataArchiveApp.tsx`)**: Data vault viewer showing system memory consumption, storage stats, and options for database export/import.
- **Exploration App (`ExplorationApp.tsx`)**: System navigation and feature exploration dashboard.
- **Desktop Navigation Bar (`TopBar.tsx`, `DesktopIcons.tsx`)**: Quick access launcher for computer utilities, status indicators, and window controls.

### Camera & Photo Management (`features/camera`)
- **Camera Booth Interface**: Photo booth dialog allowing users to capture snapshots and generate styled polaroid prints.
- **Polaroid Photo Gallery**: Storage overlay for viewing and managing saved polaroid memories.

---

## 3. Current Implementation Status

### ✅ Working Features
1. **Computer OS Launch**: Smooth transition into the computer screen interface when clicking the desk computer in the room view.
2. **App Navigation & Modal Management**: Switching between **SettingsApp**, **DataArchiveApp**, and **ExplorationApp** within the window manager.
3. **Settings Persistence & Custom Wallpaper Upload**: User preferences (themes, audio levels, accessibility) are persisted. Users can select from 18 preset wallpapers or upload custom image files (JPG, PNG, WebP) directly from their device.
4. **Camera Booth Workflow**: Triggering photo capture modal, preview rendering, and saving captured photos to memory storage.

### ❌ Non-Working / Planned Features
1. **Physical Polaroid Pinning**: Placing polaroid photos directly onto the 3D desk workspace surface (currently photos exist only inside a floating overlay modal).
2. **Interactive Desk Calendar**: Real-time interactive desktop calendar widget synced with system dates or external calendar APIs.

### ⚠️ Redundant / Mocked Components
1. **Mock System Telemetry**: `DataArchiveApp` displays static/mocked storage metrics and system health indicators instead of live backend system analytics.
2. **Desktop Drag-and-Drop**: Desktop icons are fixed in layout position; freely dragging icons across the desktop screen is not currently enabled.
