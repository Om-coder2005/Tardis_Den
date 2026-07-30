After Phase 2, your architecture is clean but the AI is still fairly "generic." \*\*Phase 3 should focus on making the AI truly context-aware\*\*—the core promise of your original Phase 09 documents.  



I would avoid adding UX polish or multiple providers yet. Instead, make the AI actually understand where it is and what the user is doing.



\---



\# **AI Companion V2 — Phase 3: Context Intelligence \& Prompt Orchestration**



\## Objective



The AI infrastructure has been completed in Phase 2.



This phase transforms the AI from a generic chatbot into a true \*\*Context-Aware Observatory Companion\*\*.



The AI should understand



\* where it is

\* what the administrator is viewing

\* what action is being requested

\* what information is relevant

\* what information should NOT be sent



Every AI response should feel aware of the current module rather than responding with generic LLM knowledge.



\---



\# Scope



Implement



\* Context Intelligence Engine

\* Prompt Orchestration Engine

\* Context Extractors

\* Prompt Templates

\* Conversation Context

\* Token Budgeting

\* Context Compression

\* Metadata Selection



Do \*\*NOT\*\*



\* redesign the UI

\* add AI settings

\* add provider switching

\* redesign conversations



\---



\# 1. Context Intelligence Engine



Create a centralized Context Intelligence Engine.



Responsibilities



\* collect module data

\* normalize context

\* remove unnecessary information

\* prioritize relevant information

\* compress large payloads

\* calculate token usage

\* build AI-ready context



The frontend should never manually construct prompts.



\---



\# 2. Context Extractors



Every supported module should have its own Context Extractor.



Implement extractors for



\## Bookshelf



Extract



\* title

\* author

\* selected chapter

\* selected paragraph

\* current page

\* reading progress

\* tags

\* categories

\* highlighted text

\* metadata



Do NOT send the full book.



\---



\## Telescope



Extract



\* celestial object

\* APOD data

\* NASA metadata

\* observation details

\* object type

\* distance

\* mission information

\* current filters

\* selected image



\---



\## Journal



Extract



\* selected entry

\* title

\* body

\* tags

\* date

\* mood (if available)



Never expose unrelated journal entries.



\---



\## Gallery



Extract



\* selected photo

\* caption

\* metadata

\* observation notes



\---



\## Desktop



Extract



\* current application

\* selected feature

\* current workflow



\---



\## Dream Space



Extract



\* active ambience

\* reading session

\* timer status

\* current activity



\---



\## Room



Extract



\* current room

\* active object

\* navigation state



\---



\# 3. Context Prioritization



Design a scoring system.



Determine



What information is



Critical



Important



Useful



Optional



Ignore irrelevant context.



Never send everything.



\---



\# 4. Prompt Orchestration Engine



Create a dedicated Prompt Orchestrator.



Responsibilities



\* select template

\* inject context

\* inject conversation

\* apply module rules

\* apply response constraints

\* build final prompt



No prompts should exist inside components.



\---



\# 5. Prompt Templates



Implement reusable templates.



Bookshelf



\* Explain Simply

\* Summarize

\* Define Terms

\* Key Takeaways

\* Related Topics



\---



Telescope



\* Explain Object

\* Observation Summary

\* Compare Objects

\* Scientific Background

\* Interesting Facts



\---



Journal



\* Improve Writing

\* Rewrite

\* Summarize

\* Create Title

\* Suggest Tags



\---



Gallery



\* Caption

\* Reflection

\* Observation Notes



\---



Desktop



\* Explain Feature

\* Search

\* Help



\---



Dream Space



\* Reflection Prompt

\* Calm Explanation

\* Reading Companion



\---



\# 6. Conversation Context



Implement intelligent conversation management.



Instead of sending



Entire conversation



↓



Send



Recent messages



\*



Relevant summary



\*



Current context



Conversation should remain coherent while minimizing token usage.



\---



\# 7. Token Budget Manager



Create a Token Budget Manager.



Responsibilities



Estimate



System Prompt



Context



Conversation



User Prompt



Expected Response



If limits are exceeded



Automatically



compress



summarize



remove irrelevant context



without affecting response quality.



\---



\# 8. Context Compression



Large content



↓



Relevant excerpts



↓



Summaries



↓



Metadata



↓



Final Context



The AI should never receive unnecessary information.



\---



\# 9. Output Constraints



Every prompt should include



Tone



Length



Formatting



Scientific accuracy



Hallucination prevention



Reference trusted sources when uncertain



Never invent astronomy facts.



\---



\# 10. Module Behaviour



Bookshelf



Educational tutor



\---



Journal



Writing assistant



\---



Telescope



Science educator



\---



Gallery



Observation companion



\---



Dream Space



Gentle reflective companion



\---



Desktop



Navigation helper



The assistant should adapt its personality to the module while maintaining a consistent overall voice.



\---



\# 11. Prompt Analytics



Record



Prompt size



Context size



Estimated tokens



Response tokens



Compression ratio



Execution time



Do not log sensitive user content.



\---



\# 12. Testing



Create tests for



Context extraction



Prompt generation



Token budgeting



Context compression



Conversation summarization



Module switching



Cross-module isolation



Prompt accuracy



Privacy protection



\---



\# Constraints



Do NOT redesign the interface.



Do NOT implement AI Settings.



Do NOT add voice.



Do NOT add persistent memory.



Do NOT modify unrelated application modules.



Focus only on making the AI truly context-aware.



\---



\# Success Criteria



At the end of this phase:



\* Every AI request is generated through the Prompt Orchestrator.

\* Every module provides structured, relevant context.

\* The AI understands the active module and adapts its responses accordingly.

\* Prompt construction is centralized and reusable.

\* Token usage is optimized through intelligent context selection.

\* Sensitive data is protected and unnecessary information is excluded.

\* The assistant behaves like a knowledgeable observatory companion rather than a generic chatbot.



\---



\# Required Deliverables



Provide:



1\. Executive Summary

2\. Context Intelligence Architecture

3\. Prompt Orchestrator Design

4\. Context Extractor Specifications

5\. Prompt Template Catalog

6\. Token Budget Strategy

7\. Context Compression Strategy

8\. Privacy \& Data Flow Review

9\. Files Created

10\. Files Modified

11\. Test Results

12\. Remaining Work Before Phase 4



\---



\# Completion Rule



This phase is complete only when \*\*all AI requests are driven by structured context and centralized prompt orchestration\*\*, making the AI consistently aware of the user's location, activity, and intent throughout TARDIS Den, in line with the original Phase 09 vision.  



