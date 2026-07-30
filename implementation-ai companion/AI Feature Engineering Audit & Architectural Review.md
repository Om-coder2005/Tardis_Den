\# **AI Feature Engineering Audit \& Architectural Review**



\*\*Target System:\*\* TARDIS Den AI Companion (`frontend/src/features/ai`, `backend/src/controllers/ai.controller.ts`, `backend/src/services/ai.service.ts`, `backend/src/routes/ai.routes.ts`)  

\*\*Specification Baseline:\*\* `implementation/Phase 09 - AI Companion.md`  

\*\*Audit Date:\*\* July 30, 2026  

\*\*Status:\*\* Audit Complete — No code changes made.



\---



\## 1. Executive Summary



\### Overall Health Score: \*\*28 / 100\*\*



The current implementation of the AI Companion in TARDIS Den is a minimal prototype (PoC) that suffers from severe architectural fragility, missing core specification components, and instability under production conditions.



While basic text streaming functions when conditions are ideal, the system lacks error boundaries, stream buffer normalization, request cancellation, structured context extraction, provider abstraction, and proper state management. Under real-world network conditions or API edge cases (429 rate limits, 500 server errors, malformed SSE chunks, or broken markdown syntax), the frontend UI either freezes, leaks memory, or crashes the entire React component tree.



\---



\## 2. Architecture Review



\### Target Architecture (Phase 09 Spec)

$$\\text{UI Component} \\longrightarrow \\text{Custom Hooks} \\longrightarrow \\text{AI Client Service} \\longrightarrow \\text{Context Manager} \\longrightarrow \\text{Prompt Builder} \\longrightarrow \\text{Backend API} \\longrightarrow \\text{Provider Adapter} \\longrightarrow \\text{AI Model (Gemini/OpenAI)}$$



\### Actual Implemented Flow

$$\\text{AICompanion.tsx (UI)} \\xrightarrow\[\\text{bypassing hooks \\\& client}]{Direct\\ \\texttt{fetch()}} \\text{Backend Route} \\longrightarrow \\text{AIController} \\longrightarrow \\text{AIService} \\xrightarrow\[\\text{hardcoded}]{@google/genai}$$



\### Architectural Compliance Breakdown



| Architectural Layer | Expected Design (Phase 09) | Current Implementation | Compliance Status |

| :--- | :--- | :--- | :---: |

| \*\*UI Components\*\* | Modular AI Panel, Action Pills, Retry/Cancel controls | Monolithic `AICompanion.tsx`, hardcoded single input | ❌ Non-compliant |

| \*\*Custom Hooks\*\* | Encapsulated streaming hook (`useAIChat`, `useAIContext`) | Direct state mutations inside component `handleSubmit` | ❌ Non-compliant |

| \*\*Client API Layer\*\* | Centralized API client with interceptors \& typed contracts | Raw browser `window.fetch()` inside UI component | ❌ Non-compliant |

| \*\*Context Manager\*\* | Rich context aggregators for Bookshelf, Telescope, Journal, Desktop | Weak string concatenation (`"Reading book " + id`) | ❌ Non-compliant |

| \*\*Prompt Builder\*\* | Structured system/user prompt templates by module | Single static string in `ai.service.ts` | ❌ Non-compliant |

| \*\*Backend API Route\*\* | Authenticated, validated SSE endpoint with Zod schema | Unvalidated `req.body` with basic string check | ❌ Non-compliant |

| \*\*Provider Adapter\*\* | Abstracted interface (`IAIProvider`) for OpenAI / Gemini | Direct instantiation of `@google/genai` in service | ❌ Non-compliant |

| \*\*State Management\*\* | Isolated Zustand store for active session, history \& settings | Partial Zustand store, missing settings, retry \& cancellation state | ⚠️ Partial |



\---



\## 3. Crash Analysis \& Root Causes



\### Why the Website Crashes in Production



\#### Crash Vectors Identified:



1\. \*\*Unbuffered SSE Chunking Syntax Error (`JSON.parse` Crash)\*\*

&#x20;  - \*\*Location:\*\* \[AICompanion.tsx:L54-L75](file:///d:/the\_space/frontend/src/features/ai/AICompanion.tsx#L54-L75)

&#x20;  - \*\*Mechanism:\*\* HTTP Server-Sent Events (SSE) stream data in network TCP chunks. A single `data: {"text": "hello"}\\n\\n` line can be split across two network packets (e.g., Packet 1: `data: {"tex`, Packet 2: `t": "hello"}\\n\\n`).

&#x20;  - \*\*Failure Mode:\*\* `AICompanion.tsx` reads `decoder.decode(value, { stream: true })` and directly executes `chunk.split('\\n')` without a line buffer. Passing partial JSON string `{"tex` to `JSON.parse()` throws an uncaught `SyntaxError`. In certain React render frames, uncaught async errors during state batching crash the component hierarchy.



2\. \*\*Uncaught Component Crash in `@uiw/react-md-editor`\*\*

&#x20;  - \*\*Location:\*\* \[AICompanion.tsx:L149](file:///d:/the\_space/frontend/src/features/ai/AICompanion.tsx#L149)

&#x20;  - \*\*Mechanism:\*\* During live token streaming, Markdown content is incomplete (e.g. unclosed HTML tags `<div class=`, unclosed code blocks `` ```typescript ``, or unclosed LaTeX delimiters).

&#x20;  - \*\*Failure Mode:\*\* `<MDEditor.Markdown />` attempts to parse invalid AST nodes during mid-stream renders. Without a React \*\*Error Boundary\*\* wrapping the markdown parser, any markdown engine exception bubbles straight up to the root React tree, unmounting the entire app (white screen of death).



3\. \*\*Backend Response Leak on Unhandled SDK Exceptions\*\*

&#x20;  - \*\*Location:\*\* \[ai.controller.ts:L16-L30](file:///d:/the\_space/backend/src/controllers/ai.controller.ts#L16-L30)

&#x20;  - \*\*Mechanism:\*\* When Google Gemini API throws a 429 (Rate Limit Exceeded), 403 (Invalid Key), or 500 (Internal Error), `AIService.streamChat` throws an exception \*after\* `res.setHeader('Content-Type', 'text/event-stream')` has already executed.

&#x20;  - \*\*Failure Mode:\*\* The controller catches the error and writes `data: {"error": "..."}` to the stream, but if `fetch` on the frontend fails to read or gets an unexpected HTTP status code, `response.body.getReader()` throws an unhandled Promise rejection in `AICompanion.tsx:L43-L45`.



4\. \*\*Missing AbortController (Hanging Stream \& Race Conditions)\*\*

&#x20;  - \*\*Location:\*\* \[AICompanion.tsx:L28-L84](file:///d:/the\_space/frontend/src/features/ai/AICompanion.tsx#L28-L84)

&#x20;  - \*\*Mechanism:\*\* When a user closes the AI Panel or submits a second prompt while a stream is in progress, the active `ReadableStreamDefaultReader` continues running in the background.

&#x20;  - \*\*Failure Mode:\*\* Multiple background stream readers write simultaneously to `updateMessage(responseId, ...)`, causing state corruption, rapid flickering, infinite render loops, and out-of-memory browser tab crashes.



\---



\## 4. Comprehensive Issues Categorization



\### 3. Critical Issues (Production Blockers)



1\. \*\*Missing Line Buffer for SSE Chunk Parsing\*\*

&#x20;  - Raw TCP chunks are split by `\\n` without buffering incomplete lines across reader reads. `JSON.parse` throws on split JSON tokens.

2\. \*\*Missing React Error Boundaries Around Markdown Renderer\*\*

&#x20;  - Malformed markdown generated during streaming crashes the entire React application.

3\. \*\*No AbortController / Request Cancellation\*\*

&#x20;  - Closing the panel or navigating away leaves active network streams consuming memory and updating unmounted/stale state.

4\. \*\*Hardcoded Frontend API URL Fallback\*\*

&#x20;  - \[AICompanion.tsx:L29](file:///d:/the\_space/frontend/src/features/ai/AICompanion.tsx#L29) defaults to `http://localhost:3001` if `VITE\_API\_URL` is unset, causing CORS and connection failures on deployed production URLs.

5\. \*\*Unhandled Backend Stream Exceptions\*\*

&#x20;  - Gemini API errors (rate limits, key expiration) fail mid-stream without terminating SSE connections properly.



\---



\### 4. High Priority Issues (Fix Before Next Release)



1\. \*\*Weak \& Primitive Context Extraction\*\*

&#x20;  - \[BookshelfModule.tsx:L38](file:///d:/the\_space/frontend/src/features/bookshelf/BookshelfModule.tsx#L38), \[TelescopeModule.tsx:L32](file:///d:/the\_space/frontend/src/features/telescope/TelescopeModule.tsx#L32), \[JournalModule.tsx:L31](file:///d:/the\_space/frontend/src/features/journal/JournalModule.tsx#L31) only pass simple strings like `'Reading book/document ' + selectedContentId`.

&#x20;  - The AI receives no actual book text, observation description, APOD data, or journal entry content.

2\. \*\*Missing Prompt Builder System\*\*

&#x20;  - No template management for specific action pills ("Explain Simply", "Summarize", "Improve Writing", "Define Terms").

3\. \*\*Layout Thrashing \& Excessive Re-renders\*\*

&#x20;  - `useEffect` calling `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })` executes on every single streaming token. Smooth scroll animations stack up, causing severe UI lag.

4\. \*\*Markdown Re-parsing Overhead\*\*

&#x20;  - Re-rendering `<MDEditor.Markdown />` on every single token delta parses the full conversation history from scratch every \~50ms.

5\. \*\*No Input Validation Schema (Zod)\*\*

&#x20;  - Backend `ai.controller.ts` only checks `if (!prompt)`. `context` and `history` objects are passed directly to the LLM without schema validation or sanitization.



\---



\### 5. Medium Issues (Architecture \& Design Improvements)



1\. \*\*Direct Provider Lock-in (`@google/genai`)\*\*

&#x20;  - `ai.service.ts` directly instantiates `GoogleGenAI`. There is no provider-agnostic adapter layer to switch to OpenAI, Anthropic, or local Ollama models.

2\. \*\*Missing AI Settings Layer\*\*

&#x20;  - Phase 09 requirement for user-configurable streaming, response length, and explanation level is entirely absent.

3\. \*\*No Prompt / Payload Truncation\*\*

&#x20;  - Conversation history grows indefinitely in `useAIStore`. Sending 50+ messages forwards the entire conversation array in every request, risking token limit breaches and high latency.

4\. \*\*Bypassing Centralized API Client\*\*

&#x20;  - `AICompanion.tsx` uses raw `window.fetch()` instead of `axios` / `api.ts`, missing global error interceptors, authentication headers, and request tracking.



\---



\### 6. Low Priority Issues (Code Quality \& Hygiene)



1\. \*\*Type Safety Gaps (`any` Usage)\*\*

&#x20;  - `context: any`, `history: any\[]` in `ai.service.ts` and `useAIStore.ts`.

2\. \*\*Inconsistent UI Styling Tokens\*\*

&#x20;  - `AIToggleButton.tsx` uses Tailwind `bg-indigo-600` while `AICompanion.tsx` uses retro styling (`bg-retro-cream`, `retro-shadow`), violating design system consistency.

3\. \*\*Magic Strings in Communication Protocol\*\*

&#x20;  - Protocol literals (`'data: '`, `'\[DONE]'`, `'tardis\_session'`) scattered inline without a shared constant module.



\---



\## 5. Security Findings



1\. \*\*Unsanitized Markdown Output (XSS Vulnerability)\*\*

&#x20;  - `MDEditor.Markdown` is rendered without strict HTML sanitization (`rehype-sanitize`). If the AI output contains malicious HTML tags or script injection vectors, it executes in the user's browser context.

2\. \*\*Raw Context Exposure in Logs\*\*

&#x20;  - Full `context.data` is logged or sent in system instructions without filtering sensitive personal user journal text or credentials.

3\. \*\*Missing Rate Limiting per User Session\*\*

&#x20;  - `ai.routes.ts` uses global rate limiters, but lacks specific per-user prompt rate limiting, exposing the backend to API quota exhaustion attacks.



\---



\## 6. Performance Findings



1\. \*\*Token Delta Re-rendering Bottleneck:\*\* Rendering heavy markdown components on every 10ms token chunk blocks the main browser thread.

2\. \*\*DOM Scroll Thrashing:\*\* Triggering smooth scrolling on every character update causes GPU compositing bottlenecks.

3\. \*\*Uncompressed Payload Transmission:\*\* JSON text deltas are streamed without text compression buffers.



\---



\## 7. Stability Findings



| Failure Scenario | Expected Behavior (Phase 09) | Current Behavior | App Survival? |

| :--- | :--- | :--- | :---: |

| \*\*Backend Offline\*\* | Graceful error banner in AI panel | `TypeError: Failed to fetch` logged, UI stuck in loading state | ⚠️ Survives (Degraded) |

| \*\*429 Rate Limited\*\* | Clear rate-limit message with countdown | Append error string to message, input field remains locked | ⚠️ Survives (Degraded) |

| \*\*Malformed SSE Line\*\* | Ignore malformed line, keep reader open | Uncaught `SyntaxError` in `JSON.parse()`, breaks stream loop | ❌ Component Freezes |

| \*\*Broken Markdown Tag\*\* | Render raw text fallback gracefully | `MDEditor.Markdown` throws unhandled render error | ❌ \*\*App Crashes\*\* |

| \*\*Panel Closed Mid-Stream\*\* | Abort HTTP request immediately | Stream continues in background, updates unmounted state | ⚠️ Memory Leak |

| \*\*Double Click Submit\*\* | Ignore secondary click | Spawns parallel fetch requests and stream loops | ❌ State Corrupted |



\---



\## 8. Missing Features Matrix (vs. Phase 09 Spec)



| Feature Requirement | Document Reference | Status |

| :--- | :--- | :---: |

| \*\*Bookshelf Context Extraction\*\* | Phase 09 § AI Entry Points | ❌ Missing (Sends ID string only) |

| \*\*Telescope Context Extraction\*\* | Phase 09 § AI Entry Points | ❌ Missing (Sends empty/partial tab state) |

| \*\*Journal Context Extraction\*\* | Phase 09 § AI Entry Points | ❌ Missing (Sends ID string only) |

| \*\*Desktop / Search Assistant\*\* | Phase 09 § AI Entry Points | ❌ Missing (Not implemented) |

| \*\*Prompt Template / Suggested Actions\*\* | Phase 09 § Prompt Templates | ❌ Missing |

| \*\*Request Cancellation (Cancel Button)\*\* | Phase 09 § Streaming Responses | ❌ Missing |

| \*\*Retry Response Control\*\* | Phase 09 § Streaming Responses | ❌ Missing |

| \*\*Copy Response Control\*\* | Phase 09 § Streaming Responses | ❌ Missing |

| \*\*AI Settings Panel \& Persistence\*\* | Phase 09 § AI Settings | ❌ Missing |



\---



\## 9. Architectural Refactoring Blueprint (Proposed Plan)



\*(Note: Implementation strictly deferred per constraints)\*



\### Proposed Target Architecture Architecture:



```

\[ Frontend ]

&#x20; AICompanion (Panel View)

&#x20;    └─> useAIChat Hook (Manages AbortController, SSE buffer parser)

&#x20;          ├─> useAIStore (Zustand: messages, panel state, settings)

&#x20;          └─> Context Aggregator (Extracts active module state into typed schema)

&#x20;                └─> API Client (POST /api/ai/chat)



\[ Backend ]

&#x20; ai.routes -> requireAuth -> rateLimiter -> validateBody(zodSchema)

&#x20;    └─> AIController

&#x20;          └─> AIService

&#x20;                ├─> PromptBuilder (Injects system instructions \& templates)

&#x20;                ├─> ContextSanitizer (Filters sensitive data, limits token length)

&#x20;                └─> ProviderAdapterFactory

&#x20;                      ├─> GeminiProviderAdapter

&#x20;                      └─> OpenAIProviderAdapter (Fallback)

```



\### Safe Refactoring Phases (For Future Execution):



1\. \*\*Phase 1: Resilience \& Crash Prevention (Zero UI Changes)\*\*

&#x20;  - Add SSE line buffer (`accumulatedBuffer += chunk; lines = accumulatedBuffer.split('\\n')`).

&#x20;  - Wrap `<MDEditor.Markdown />` with a React `ErrorBoundary`.

&#x20;  - Add `AbortController` support to cancel active streams on unmount/close/new request.



2\. \*\*Phase 2: Context Manager \& Prompt System\*\*

&#x20;  - Create structured context extractors for Bookshelf (book title, excerpt), Telescope (APOD metadata, celestial object details), and Journal (entry body).

&#x20;  - Implement backend `PromptBuilder` to format module context deterministically.



3\. \*\*Phase 3: Abstraction \& Provider Flexibility\*\*

&#x20;  - Create `IAIProvider` interface in backend to decouple `@google/genai` from `AIService`.

&#x20;  - Implement Zod schema validation on backend `/api/ai/chat`.



4\. \*\*Phase 4: UI Polish \& Feature Completion\*\*

&#x20;  - Add suggested action pills ("Explain Simply", "Summarize").

&#x20;  - Add Cancel, Retry, and Copy buttons.

&#x20;  - Implement AI Settings store (persistable in `localStorage`).



\---



\## 10. Priority Matrix



| Priority | Issue / Task | Domain | Risk / Impact |

| :--- | :--- | :--- | :--- |

| \*\*CRITICAL\*\* | Implement SSE line buffer to fix `JSON.parse` split chunk crashes | Frontend | High Risk of Freeze |

| \*\*CRITICAL\*\* | Wrap Markdown renderer in a React `ErrorBoundary` | Frontend | \*\*White Screen Crash\*\* |

| \*\*CRITICAL\*\* | Integrate `AbortController` for stream cancellation | Frontend | Memory Leaks \& Race Conditions |

| \*\*HIGH\*\* | Replace raw string context with structured Context Managers | Both | Unusable / Irrelevant AI Output |

| \*\*HIGH\*\* | Fix hardcoded `http://localhost:3001` fallback URL | Frontend | Production Deployment Failure |

| \*\*HIGH\*\* | Add Zod validation schema to `/api/ai/chat` endpoint | Backend | Unsanitized Input / Server Error |

| \*\*MEDIUM\*\* | Implement `IAIProvider` interface abstraction layer | Backend | Vendor Lock-in |

| \*\*MEDIUM\*\* | Implement AI Prompt Templates / Suggested Action Pills | Frontend | Missing Spec Requirement |

| \*\*MEDIUM\*\* | Add AI Settings persistence store | Both | Missing Spec Requirement |

| \*\*LOW\*\* | Clean up `any` types and standardize CSS styling tokens | Both | Code Quality \& Maintainability |



\---



> \*\*Audit Conclusion:\*\* The AI Companion infrastructure requires a structural overhaul following the Priority Matrix above to achieve production stability, safety, and compliance with the Phase 09 Specification. All code modifications remain strictly paused awaiting user authorization.

