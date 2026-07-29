# TARDIS Den
# **Phase 01 - Project Foundation**

Version: 1.0

---

## Goal
Establish a clean, scalable project foundation that future phases can build upon.
No room features should be implemented during this phase.

---

# Deliverables

## Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Framer Motion
- CSS Transforms
- TanStack Query
- Lucide React

---

## Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Zod
- CORS
- Helmet
- Morgan

---

## Project Structure
frontend/
backend/
shared/
docs/

---

## Configure
- ESLint
- Prettier
- Husky
- lint-staged
- Git Ignore
- Environment Variables

---

## Frontend Folder Structure
src/
  app/
  assets/
  components/
  features/
  hooks/
  layouts/
  lib/
  providers/
  routes/
  services/
  store/
  styles/
  types/
  utils/

---

## Backend Folder Structure
src/
  config/
  controllers/
  middleware/
  routes/
  services/
  repositories/
  prisma/
  utils/
  types/
  validators/

---

## Shared Folder
constants/
types/
schemas/

---

# Routing
Only create placeholder routes.
/ → Landing
/login → Authentication
/room → Placeholder
404

---

# Authentication
Create authentication infrastructure only.
No UI.
No business logic.
Only routing and architecture.

---

# State Management
Global Store
Theme
Session
Settings
Room
Future modules must create their own stores.

---

# API Layer
Create reusable API client.
Axios
Interceptors
Error handling
Authentication headers
Request cancellation
Retry support

---

# Database
Initialize Prisma.
Create connection.
No models yet.
Run initial migration.

---

# Environment Variables
Frontend
VITE_API_URL

Backend
DATABASE_URL
JWT_SECRET
NASA_API_KEY
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_KEY

---

# Code Standards
Strict TypeScript
No any
Feature-first architecture
Absolute imports
Reusable components
Reusable hooks
Reusable services

---

# Acceptance Criteria
✓ Frontend starts
✓ Backend starts
✓ Database connected
✓ Shared types configured
✓ ESLint passes
✓ Build succeeds
✓ No TypeScript errors
✓ Ready for Phase 02

---

# Out of Scope
No room
No authentication UI
No NASA
No AI
No Journal
No Bookshelf
No Telescope
No Animations
Only project foundation.
