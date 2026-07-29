\# TARDIS Den

\# **Phase 09 - AI Companion**



Version: 1.0



Status: Ready for Implementation



\---



\# Goal



Integrate an AI Companion that enhances exploration, learning, and creativity throughout TARDIS Den.



The AI should feel like a quiet observatory assistant—not a chatbot. It appears only when requested, understands the current context, and never interrupts the experience.



The AI must remain modular so that it can be replaced or upgraded without affecting the rest of the application.



\---



\# Objectives



Implement



\- AI Service Layer

\- Context-Aware Assistant

\- Bookshelf Assistant

\- Telescope Assistant

\- Journal Assistant

\- Prompt Management

\- Streaming Responses

\- Conversation History (Session Only)

\- AI Settings



Do NOT Implement



Voice Assistant



Continuous Listening



AI Memory Across Sessions



Autonomous Actions



Background Monitoring



Image Generation



\---



\# User Flow



Room



↓



Open Supported Module



↓



Click "Ask AI"



↓



Context Sent



↓



Streaming Response



↓



Optional Follow-up



↓



Close Assistant



↓



Return to Module



\---



\# AI Philosophy



The AI should



\- Be calm

\- Be accurate

\- Be educational

\- Be transparent

\- Be optional



The AI should never



\- Interrupt

\- Automatically modify user content

\- Invent scientific facts

\- Replace official NASA information

\- Take actions without confirmation



\---



\# AI Entry Points



Bookshelf



\- Explain topic

\- Summarize article

\- Define terminology

\- Suggest related reading



Telescope



\- Explain image

\- Describe object

\- Explain mission

\- Compare celestial objects



Journal



\- Improve grammar

\- Rewrite text

\- Generate title

\- Summarize notes



Desktop



\- Search assistance only



\---



\# AI Panel



Layout



Header



\- AI Companion

\- Current Context

\- Close Button



Conversation Area



\- Streaming responses

\- Markdown rendering

\- Code blocks

\- Lists

\- Tables



Footer



\- Prompt input

\- Suggested actions

\- Send button



\---



\# Context Injection



Every request should include



Current Module



Current Object



Relevant Metadata



Selected Content



User Prompt



Example



Module



Bookshelf



Object



Black Holes



Selected Paragraph



(Page content)



Prompt



"Explain this in simple terms."



The AI should not request information already available in the current context.



\---



\# Prompt Templates



Bookshelf



\- Explain Simply

\- Summarize

\- Define Terms

\- Related Topics



Telescope



\- Explain Object

\- Observation Summary

\- Compare Objects

\- Historical Context



Journal



\- Improve Writing

\- Summarize

\- Create Title

\- Suggest Tags



Desktop



\- Find Resource

\- Explain Feature



\---



\# Streaming Responses



Requirements



\- Token-by-token rendering

\- Loading indicator

\- Cancel response

\- Copy response

\- Retry response



The interface should remain responsive while responses stream.



\---



\# Conversation History



Store only for the current session.



Track



\- Prompt

\- Response

\- Timestamp

\- Module

\- Context



Conversation history is cleared when the session ends.



\---



\# AI Settings



Allow users to configure



\- Streaming on/off

\- Response length

\- Explanation level

\- Markdown rendering

\- Clear conversation history



Settings persist across sessions.



\---



\# Safety



The AI should



\- Clearly identify generated content

\- Refuse unsupported requests gracefully

\- Avoid hallucinating scientific facts

\- Encourage trusted sources for uncertain topics



Sensitive journal content should never be stored beyond the active request.



\---



\# Service Architecture



Create



\- AI Client

\- Prompt Builder

\- Context Manager

\- Streaming Handler

\- Response Parser

\- Error Handler



The UI should never call the AI provider directly.



\---



\# State Management



Create a dedicated AI Store.



Track



\- Active conversation

\- Current context

\- Streaming status

\- Prompt history

\- Suggested prompts

\- Loading state

\- Error state



Keep AI state isolated from room and module stores.



\---



\# Error Handling



Handle



\- Network failure

\- AI provider unavailable

\- Timeout

\- Rate limit

\- Invalid response

\- Cancelled request



Provide meaningful fallback messages without interrupting the user's workflow.



\---



\# Performance



Targets



\- Initial response begins within 2 seconds

\- Streaming remains smooth

\- Minimal UI blocking

\- Efficient context construction

\- Reuse cached metadata where appropriate



\---



\# Accessibility



Support



\- Keyboard navigation

\- Screen reader labels

\- Reduced motion

\- High-contrast mode

\- Focus management



Streaming content should remain accessible to assistive technologies.



\---



\# Testing



✓ AI panel opens correctly



✓ Context passed correctly



✓ Streaming functions



✓ Responses render properly



✓ Retry works



✓ Cancel works



✓ Session history maintained



✓ Errors handled gracefully



✓ Settings persist



✓ Accessibility requirements satisfied



\---



\# Deliverables



\- AI service layer

\- Context-aware prompt system

\- Streaming chat interface

\- Bookshelf assistant

\- Telescope assistant

\- Journal assistant

\- AI settings

\- Session conversation history



\---



\# Acceptance Criteria



The AI feels like a knowledgeable observatory companion rather than a generic chatbot.



It enhances existing modules without replacing them.



Responses are contextual, accurate, and unobtrusive.



The architecture supports changing AI providers with minimal code changes.



\---



\# Constraints



Do not implement voice interaction.



Do not store conversations permanently.



Do not allow AI to automatically modify user data.



Do not expose API keys to the client.



Do not tightly couple AI functionality with any individual module.



Implement the AI as a reusable service that integrates consistently across the entire application.

