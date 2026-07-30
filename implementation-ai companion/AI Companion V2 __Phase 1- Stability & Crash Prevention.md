

\# **AI Companion V2 — Phase 1: Stability \& Crash Prevention**



\## Objective



Begin implementing the AI Companion Version 2 according to the approved Architecture Specification and Implementation Roadmap.



This phase focuses \*\*only on production stability\*\*.



Do \*\*NOT\*\* implement new AI features.



Do \*\*NOT\*\* redesign the UI.



Do \*\*NOT\*\* improve prompts.



Do \*\*NOT\*\* add providers.



The objective is to ensure the AI Companion can never crash TARDIS Den again.



\---



\# Scope



Only implement the following:



\## 1. Crash Prevention



Fix every issue capable of crashing



\* React

\* Zustand

\* AI Panel

\* Streaming

\* Markdown rendering



The application must remain fully functional even if the AI completely fails.



\---



\## 2. Error Boundaries



Implement dedicated Error Boundaries around



\* AI Panel

\* Markdown Renderer

\* Streaming Renderer



If any component throws



Only the AI panel should fail.



Never the application.



\---



\## 3. AbortController



Implement complete request lifecycle management.



Support



\* cancel request

\* panel closed

\* module changed

\* navigation

\* component unmount

\* new request replaces previous request



There must never be orphaned network requests.



\---



\## 4. Streaming Buffer



Replace the existing stream parser with a production-grade implementation.



Handle



\* partial chunks

\* incomplete JSON

\* malformed events

\* duplicated chunks

\* empty events

\* DONE events

\* unexpected EOF



Streaming must never throw uncaught exceptions.



\---



\## 5. Safe Markdown Rendering



The markdown renderer must



\* never crash

\* sanitize HTML

\* tolerate incomplete markdown

\* tolerate broken code blocks

\* tolerate malformed tables

\* tolerate unfinished streaming responses



If parsing fails



Render plain text.



Never crash React.



\---



\## 6. Loading States



Review every loading state.



Prevent



\* stuck loading

\* infinite loading

\* loading after unmount

\* loading after cancel



\---



\## 7. Error Handling



Handle



Network unavailable



429



401



403



500



503



Timeout



Cancelled request



Invalid JSON



Malformed SSE



Provider unavailable



Unexpected provider response



Every error must display an appropriate UI message.



Never expose stack traces.



\---



\## 8. Environment Variables



Remove every localhost fallback.



The application must fail gracefully if



VITE\_API\_URL



or backend configuration is invalid.



Never silently connect to localhost.



\---



\## 9. Logging



Improve logging.



Development



Detailed logs



Production



Minimal structured logs



Never log



\* prompts

\* journal content

\* API keys

\* tokens

\* secrets



\---



\## 10. Testing



Write



Unit Tests



Integration Tests



Manual QA



Include test cases for



\* closing panel while streaming

\* opening multiple panels

\* double-click send

\* network disconnect

\* malformed stream

\* provider timeout

\* markdown parser failure

\* navigation during response

\* refresh during response



\---



\# Constraints



Do NOT modify



Prompt Builder



Context Manager



Conversation Management



Provider Architecture



AI Settings



Prompt Templates



Suggested Actions



Response Quality



UI Design



These belong to later phases.



\---



\# Success Criteria



The AI Companion should



\* never crash the website

\* never leak memory

\* never leave hanging requests

\* recover gracefully from every error

\* remain responsive under poor network conditions

\* safely render incomplete responses

\* isolate failures to the AI panel



The rest of TARDIS Den must continue working even if the AI backend is completely unavailable.



\---



\# Required Deliverables



Provide



1\. Executive Summary



2\. Files Created



3\. Files Modified



4\. Architectural Decisions



5\. Issues Fixed



6\. Remaining Known Issues



7\. Test Results



8\. Performance Impact



9\. Manual QA Checklist



10\. Production Readiness Assessment



\---



\# Completion Rule



This phase is complete \*\*only if every crash scenario identified in the engineering audit has been eliminated\*\* and the AI Companion can safely fail without affecting the rest of the application.



\*\*Do not begin Phase 2 until Phase 1 has been fully implemented, tested, and verified.\*\*



\---



This workflow (Architecture → Roadmap → Phase 1 → Phase 2 → …) is much closer to how a senior engineering team would execute a production refactor than trying to rebuild the entire AI subsystem in one large change.



