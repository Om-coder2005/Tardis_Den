\# TARDIS Den – AI Companion Refactoring Specification (Version 2)



\## Objective



The AI Companion has undergone a full engineering audit.



The audit identified major architectural weaknesses, production stability issues, missing functionality, tight coupling, and several deviations from the original Phase 09 specification.



\*\*Do NOT modify any code in this task.\*\*



This is an architecture and system design task only.



Your goal is to design the next-generation AI system (Version 2) that will completely replace the current implementation while preserving the philosophy of TARDIS Den.



This document will become the source of truth for the AI refactor.



\---



\# Documents to Follow



Treat these as the source of truth.



\* Project Manifesto

\* PRD

\* System Architecture

\* API Integration

\* Phase 09 – AI Companion

\* 09\_AI\_Features.md

\* AI Engineering Audit Report



The implementation must comply with these documents.



Do not invent functionality that contradicts them.



\---



\# Goal



Design a production-grade AI architecture that is



\* modular

\* provider independent

\* production ready

\* fault tolerant

\* scalable

\* testable

\* secure

\* maintainable



The AI should feel like



> "a knowledgeable observatory companion"



and never like



> "a chatbot bolted onto the application."



\---



\# Review the Current Implementation



Study the current implementation completely.



Review



Frontend



\* AI Panel

\* Components

\* Zustand Store

\* Hooks

\* Streaming

\* Markdown Rendering

\* Prompt Submission

\* Context Collection



Backend



\* Controllers

\* Routes

\* Services

\* Streaming

\* Provider

\* Prompt Builder

\* Context Handling



Compare everything against



Phase 09 documentation.



\---



\# Design Version 2



Create an entirely new architecture.



Do NOT think about the current implementation.



Think about the ideal implementation.



\---



\# Design the Complete AI Architecture



Include diagrams for



Frontend



```

AI Panel



↓



Action Pills



↓



useAIChat()



↓



AI Store



↓



API Client



↓



Backend

```



Backend



```

Controller



↓



Validation



↓



Context Manager



↓



Prompt Builder



↓



Conversation Manager



↓



Provider Adapter



↓



Streaming Engine



↓



LLM

```



Provider



```

Gemini



OpenAI



Anthropic



Ollama



Azure OpenAI



↓



IAIProvider

```



The Provider Adapter must allow changing AI providers without modifying frontend code.



\---



\# Design Every Layer



Document the responsibilities of



AI Panel



Action Toolbar



Conversation View



Streaming Renderer



Markdown Renderer



Prompt Input



Suggested Actions



Retry



Cancel



Copy



AI Settings



Conversation Store



Conversation Manager



Context Manager



Prompt Builder



Prompt Templates



API Client



Streaming Engine



Provider Adapter



Error Handler



Telemetry



Analytics



Caching



Token Manager



Rate Limiter



\---



\# Context Manager



Redesign Context Injection.



Explain exactly how each module provides context.



Bookshelf



Telescope



Journal



Gallery



Desktop



Dream Space



Room



Each module should expose



\* module id

\* title

\* selected content

\* metadata

\* user action

\* relevant state



without leaking unnecessary information.



\---



\# Prompt Builder



Design a reusable Prompt Builder.



It should support



Bookshelf



\* Explain

\* Summarize

\* Define

\* Related Reading



Journal



\* Improve Writing

\* Rewrite

\* Summarize

\* Create Title



Telescope



\* Explain Object

\* Compare Objects

\* Observation Summary



Gallery



\* Reflection

\* Caption Assistance



Desktop



\* Search

\* Explain Feature



Every prompt must have



System Prompt



↓



Context Prompt



↓



User Prompt



↓



Conversation History



↓



Output Constraints



\---



\# Conversation Management



Design



Session memory



History trimming



Token budgeting



Conversation summarization



Maximum context size



Maximum response size



Conversation reset



\---



\# Streaming Design



Create a production-grade streaming architecture.



Document



SSE lifecycle



AbortController lifecycle



Cancellation



Reconnect strategy



Buffer management



Chunk parser



Markdown rendering



Partial responses



Error recovery



Loading states



Completion handling



\---



\# Error Handling



Design how the AI behaves for



Network failure



Provider offline



429



500



503



Timeout



Malformed stream



Broken markdown



Authentication failure



Token limit



Cancelled request



Invalid context



Invalid prompt



Invalid JSON



The application must NEVER crash because of AI.



The AI panel should fail gracefully while the rest of TARDIS Den remains fully usable.



\---



\# Security Design



Design



API security



Authentication



Authorization



Input validation



Prompt injection protection



Markdown sanitization



XSS prevention



CSRF considerations



Rate limiting



Secret management



Provider isolation



Logging policy



Privacy policy



Sensitive journal protection



\---



\# Performance Design



Design



Lazy loading



Streaming optimization



Markdown optimization



Conversation virtualization



Caching



Context reuse



Memoization



Bundle optimization



Token optimization



Cost optimization



\---



\# AI UX



Review the AI experience.



Determine



Does it feel like an observatory assistant?



Does it interrupt immersion?



Should it speak differently?



Should it be calmer?



Should it avoid long responses?



Should it provide educational references?



Should suggested actions change based on context?



Design the complete conversational experience.



\---



\# Settings



Design the AI Settings page.



Include



Streaming



Response Length



Explanation Level



Temperature (if applicable)



Markdown Rendering



Clear Conversation



Provider Information



Debug Mode (Development Only)



\---



\# Testing Strategy



Design a complete testing plan.



Include



Unit Tests



Integration Tests



Streaming Tests



Load Tests



Failure Tests



Security Tests



Provider Mocking



UI Tests



Accessibility Tests



Performance Tests



Regression Tests



\---



\# Migration Strategy



Design how Version 1 will migrate to Version 2.



Include



Safe rollout



Backward compatibility



Feature flags



Incremental migration



Rollback plan



\---



\# Deliverables



Produce a document with the following sections.



1\. Executive Summary



2\. AI Design Philosophy



3\. Version 2 Architecture



4\. Frontend Architecture



5\. Backend Architecture



6\. Provider Architecture



7\. Context Management



8\. Prompt Builder



9\. Conversation Management



10\. Streaming Design



11\. Error Handling



12\. Security



13\. Performance



14\. AI UX Guidelines



15\. Settings



16\. Testing Strategy



17\. Migration Strategy



18\. Implementation Phases



19\. Risk Assessment



20\. Definition of Done



\---



\# Constraints



Do NOT write code.



Do NOT refactor existing files.



Do NOT modify the database.



Do NOT change APIs.



Do NOT redesign unrelated modules.



This task is documentation only.



The resulting document must become the official engineering specification for \*\*AI Companion Version 2\*\*, and all future implementation work must follow it exactly before any code is written.



