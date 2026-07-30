# TARDIS Den – AI Companion V2 Developer Guide

## Executive Overview
The AI Companion Version 2 in TARDIS Den is a production-grade, modular, provider-independent, and context-intelligent AI subsystem. It operates as a calm Observatory Companion assisting the user across all modules in TARDIS Den without intruding or risking system stability.

---

## 1. System Architecture & Topology

```
frontend/src/features/ai/
├── components/
│   ├── SuggestedActions.tsx   # Contextual prompt action pills
│   ├── MessageActions.tsx     # Copy, Regenerate, & response actions
│   └── SafeMarkdown.tsx       # Error-boundary protected markdown renderer
├── context/
│   ├── extractors/            # Module-specific context extractors
│   │   ├── bookshelfExtractor.ts
│   │   ├── telescopeExtractor.ts
│   │   ├── journalExtractor.ts
│   │   ├── galleryExtractor.ts
│   │   ├── desktopExtractor.ts
│   │   ├── dreamSpaceExtractor.ts
│   │   └── roomExtractor.ts
│   └── contextIntelligence.ts  # Unified context aggregation service
├── hooks/
│   ├── useAIChat.ts           # Core chat business logic & AbortController
│   └── useAIContext.ts        # Module context management hook
├── services/
│   └── aiClient.ts            # Centralized SSE streaming client
├── types/
│   └── ai.types.ts            # Strongly-typed data contracts
├── useAIStore.ts              # Zustand store for state management
└── AICompanion.tsx            # Clean presentation UI component

backend/src/ai/
├── controller/
│   ├── ai.controller.ts       # Chat endpoint handler with correlation IDs
│   └── aiHealth.controller.ts # GET /api/ai/health diagnostics
├── middleware/
│   └── aiRateLimiter.ts       # Express rate-limiting middleware
├── services/
│   └── ai.service.ts          # Core service orchestrating context & prompts
├── providers/
│   ├── aiProvider.interface.ts# IAIProvider interface contract
│   ├── gemini.provider.ts     # Gemini SDK implementation with mock fallback
│   └── provider.factory.ts    # Factory pattern for active AI provider
├── context/
│   ├── contextCompressor.ts   # Context prioritization & payload truncation
│   └── tokenBudgetManager.ts  # Token estimation & history trimming
├── prompts/
│   ├── templates/
│   │   └── moduleTemplates.ts # Module personas (Science Educator, Tutor, etc.)
│   └── promptOrchestrator.ts  # System instruction & output constraints
├── streaming/
│   └── streamingEngine.ts     # SSE stream formatting engine
├── telemetry/
│   ├── promptAnalytics.ts     # Operational telemetry logger
│   └── costTracker.ts         # Token cost estimation
├── validators/
│   └── ai.validator.ts        # Request body validation & sanitization
├── errors/
│   └── ai.errors.ts           # Custom AI error hierarchy
└── types/
    └── ai.types.ts            # Backend data contracts
```

---

## 2. Key Architecture Components

### A. Provider Abstraction
To add a new AI Provider (e.g. OpenAI or Anthropic):
1. Create a class implementing `IAIProvider` in `backend/src/ai/providers/`.
2. Register it in `ProviderFactory` (`backend/src/ai/providers/provider.factory.ts`).
3. Set `AI_PROVIDER=openai` in environment variables.

### B. Context Intelligence Engine
Context extractors isolate module internals. No module sends raw databases or private objects:
- `ContextIntelligence.extractModuleContext(module, data)` formats raw state into standardized `AIContextData`.
- `ContextCompressor` truncates large excerpts (>400 chars) before backend prompt injection.

### C. Prompt Orchestrator & Personas
System instructions are built dynamically based on active module personas:
- **Bookshelf**: Educational Reading Tutor
- **Telescope**: Observatory Astronomical Guide & Science Educator
- **Journal**: Empathetic Journaling & Writing Companion
- **Gallery**: Observational Visual Companion
- **Desktop**: TARDIS System Assistant
- **Dream Space**: Calm Reflective Companion
- **Room**: Observatory Assistant

### D. Resilient SSE Streaming Engine
- Frontend uses `StreamParser` to handle partial JSON chunks across reads.
- Requests pass an `AbortSignal` managed by `useAIChat`.
- Closing the panel or triggering a new request immediately aborts the active fetch stream.

### E. Health & Monitoring
- `GET /api/ai/health` provides real-time diagnostics:
```json
{
  "status": "ok",
  "service": "Tardis AI Subsystem",
  "provider": "Gemini",
  "configured": true,
  "mode": "production",
  "subsystems": {
    "contextEngine": "operational",
    "promptOrchestrator": "operational",
    "rateLimiter": "active"
  }
}
```

---

## 3. Maintenance & Extension Guide
- **Adding a new Suggested Action**: Edit `frontend/src/features/ai/components/SuggestedActions.tsx`.
- **Modifying AI Output Constraints**: Edit `backend/src/ai/prompts/templates/moduleTemplates.ts`.
- **Adjusting Token Limits**: Edit `backend/src/ai/context/tokenBudgetManager.ts`.
- **Rate Limits**: Configured in `backend/src/ai/middleware/aiRateLimiter.ts` (default: 15 req/min per IP).
