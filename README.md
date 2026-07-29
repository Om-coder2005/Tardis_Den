# TARDIS Den 🌌

TARDIS Den is an immersive, interactive 3D-inspired virtual room environment designed as a personal productivity and exploration space. Built with a modern React stack and a cosmic retro aesthetic, it features several interactive modules to help you focus, explore the universe, and document your journey.

## 🚀 Features

- **Cosmic Environment**: A beautiful night-sky backdrop with a high-performance 3D starfield particle system.
- **Interactive Modules**:
  - 🖥️ **Computer / Desk**: A solid retro-styled workspace with 18 customizable wallpapers and productivity settings.
  - 🔭 **Telescope**: Explore the cosmos with live data from NASA (APOD) and Open-Notify (Astronauts in space).
  - 📚 **Bookshelf**: Search, discover, and organize books using the OpenLibrary API.
  - 📸 **Camera**: Take photos using your webcam and save them in the virtual gallery.
  - 📓 **Journal**: A Markdown-powered notebook to write down thoughts, pin notes to the room, and manage folders.
  - 🤖 **AI Companion**: A Gemini-powered AI chat assistant embedded right into the room to help you with your tasks.
  - ☕ **Rest Area**: A cozy ambient section featuring an aesthetic cosmic vinyl player and focus timer.
- **Highly Optimized**: Features code-splitting, lazy loading, and network payload compression for blazing-fast load times.
- **Secure**: Implements rate-limiting, strict Content Security Policies (CSP), and secure JWT session handling.

## 🛠️ Tech Stack

### Frontend
- React 19, TypeScript, Vite
- Tailwind CSS v4 for styling
- Zustand for state management
- Framer Motion for fluid animations
- React Router for navigation
- React Webcam & RND for interactive widgets

### Backend
- Node.js & Express
- Prisma ORM (with SQLite for local development)
- JWT for Authentication
- Compression, Helmet, Rate-Limit, and CORS for security

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Om-coder2005/Tardis_Den.git
   cd Tardis_Den
   ```

2. **Install Dependencies:**
   Install dependencies for the root, frontend, and backend workspaces.
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Navigate to the `backend` directory and set up your environment variables based on the `.env.example` file.
   ```bash
   cd backend
   cp .env.example .env
   ```
   *Note: Make sure to add your `GEMINI_API_KEY`, `NASA_API_KEY`, and a secure `ADMIN_PASSKEY`.*

4. **Database Setup:**
   Initialize the Prisma SQLite database.
   ```bash
   npm run db:push
   ```

5. **Run the Application:**
   From the root directory, start both the frontend and backend servers.
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

The application should now be running at `http://localhost:5173`.

## 🔒 Production Deployment
The application is pre-configured and hardened for deployment to platforms like Vercel (Frontend) and Render (Backend). Ensure you set the `NODE_ENV=production` and map the `ALLOWED_ORIGIN` on your backend to match your frontend deployment URL.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
