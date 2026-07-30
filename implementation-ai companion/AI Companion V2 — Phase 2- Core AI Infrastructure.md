After Phase 1 is complete, the next milestone should be \*\*building the architecture\*\*, not adding user-facing features. This is where you replace the "prototype plumbing" with a maintainable foundation.



\---

\# **AI Companion V2 — Phase 2: Core AI Infrastructure**



\## Objective



Phase 1 stabilized the existing AI implementation.



Phase 2 replaces the underlying architecture with the modular infrastructure defined in the AI Companion V2 Specification.



This phase should \*\*not introduce major UI changes\*\*.



The goal is to replace tightly coupled code with reusable, scalable, and provider-independent components.



\---



\# Scope



Build the complete AI infrastructure layer.



Do not implement advanced AI features yet.



Focus entirely on architecture.



\---



\# 1. AI Module Structure



Create a dedicated AI module with clear separation of responsibilities.



Example structure



```text

frontend/

└── features/

&#x20;   └── ai/

&#x20;       ├── components/

&#x20;       ├── hooks/

&#x20;       ├── services/

&#x20;       ├── stores/

&#x20;       ├── context/

&#x20;       ├── prompts/

&#x20;       ├── streaming/

&#x20;       ├── types/

&#x20;       ├── utils/

&#x20;       └── index.ts



backend/

└── ai/

&#x20;   ├── controller/

&#x20;   ├── services/

&#x20;   ├── providers/

&#x20;   ├── prompts/

&#x20;   ├── context/

&#x20;   ├── validators/

&#x20;   ├── streaming/

&#x20;   ├── types/

&#x20;   └── utils/

```



Every folder should have a single responsibility.



\---



\# 2. AI Client Layer



Remove all direct API calls from UI components.



Create a centralized AI Client.



Responsibilities



\* send requests

\* stream responses

\* retry requests

\* cancel requests

\* authentication

\* response parsing

\* timeout handling



The UI should never use fetch() directly.



\---



\# 3. Custom Hooks



Create reusable hooks.



Examples



```text

useAIChat()



useAIContext()



useAIStreaming()



useConversation()



usePromptSuggestions()



useAbortRequest()

```



Hooks should contain business logic.



Components should only render UI.



\---



\# 4. Zustand Store Refactor



Refactor the AI Store.



Separate



Panel State



Conversation State



Streaming State



Settings



Errors



Loading



Current Context



Provider Status



Avoid a single giant store.



\---



\# 5. API Layer



Standardize every AI request.



All requests should use



typed request objects



typed responses



shared interfaces



central error handling



request interceptors



response interceptors



\---



\# 6. Backend Validation



Introduce request validation.



Validate



prompt



context



history



module



metadata



Reject malformed requests before reaching the provider.



\---



\# 7. Context Manager



Implement a reusable Context Manager.



Each module should expose a standardized context object.



Bookshelf



Journal



Telescope



Gallery



Desktop



Dream Space



Room



Every module should provide



module id



title



selected object



metadata



current state



user action



The Context Manager should normalize all of this.



\---



\# 8. Prompt Builder



Move all prompt creation into a dedicated Prompt Builder.



Support



Bookshelf



Journal



Telescope



Gallery



Desktop



Dream Space



Prompt Builder responsibilities



system instructions



context injection



conversation history



output constraints



response formatting



No prompt strings should exist inside UI or controllers.



\---



\# 9. Provider Abstraction



Create an interface.



Example



```text

IAIProvider



↓



GeminiProvider



↓



OpenAIProvider



↓



AnthropicProvider



↓



OllamaProvider

```



The rest of the application should never know which provider is being used.



Changing providers should require changing only configuration.



\---



\# 10. Streaming Engine



Move streaming logic into its own module.



Responsibilities



connection lifecycle



SSE parsing



buffering



completion detection



abort



retry



reconnect



progress events



UI components should never parse streams.



\---



\# 11. Error Handling Layer



Centralize AI errors.



Create standardized error types.



Examples



AIProviderError



AIRateLimitError



AITimeoutError



AIValidationError



AINetworkError



AIParsingError



Every layer should understand these errors.



\---



\# 12. Logging



Introduce structured logging.



Development



verbose



Production



minimal



Never log



API keys



user prompts



journal contents



tokens



sensitive metadata



\---



\# 13. Testing



Write tests for



API Client



Context Manager



Prompt Builder



Hooks



Store



Streaming Engine



Provider Interface



Validation



\---



\# Constraints



Do NOT redesign the UI.



Do NOT add prompt templates.



Do NOT implement AI Settings.



Do NOT improve response quality.



Do NOT implement provider switching UI.



Do NOT modify unrelated modules.



Focus only on replacing the architecture underneath the existing interface.



\---



\# Success Criteria



At the end of this phase:



\* No UI component directly communicates with the AI provider.

\* All AI logic is centralized and modular.

\* Context is generated through a single Context Manager.

\* Prompts are generated through a single Prompt Builder.

\* Providers are interchangeable through a common interface.

\* Streaming is isolated from the UI.

\* State is cleanly separated.

\* Every request and response is strongly typed.

\* The codebase is easier to extend and maintain.



\---



\# Required Deliverables



Provide:



1\. Executive Summary

2\. Architecture Diagram

3\. Files Created

4\. Files Modified

5\. New Folder Structure

6\. API Contracts

7\. Context Object Specification

8\. Prompt Builder Design

9\. Provider Interface Design

10\. Streaming Engine Design

11\. Testing Results

12\. Remaining Work Before Phase 3



\---



\# Completion Rule



This phase is complete only when the AI Companion has a clean, modular architecture that matches the approved AI Companion V2 specification, while preserving the existing user experience and production stability established in Phase 1.



