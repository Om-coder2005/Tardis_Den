\# TARDIS Den

\# **Developer\_Playbook.md**



Version: 1.0



Status: Required Before Development



\---



\# Purpose



This document defines the engineering rules that every contributor and coding agent must follow while working on TARDIS Den.



It exists to keep the codebase consistent, maintainable, scalable, and predictable.



\---



\# Core Philosophy



Build systems.



Not screens.



Build modules.



Not pages.



Build reusable components.



Not one-off implementations.



\---



\# Golden Rules



\## Rule 1



Never modify another module unless absolutely necessary.



\---



\## Rule 2



Every feature must be independently testable.



\---



\## Rule 3



No duplicated business logic.



\---



\## Rule 4



No duplicated API requests.



\---



\## Rule 5



Every API must go through the service layer.



Never fetch directly inside UI components.



\---



\## Rule 6



Components should be presentation-only whenever possible.



Business logic belongs in hooks, services, or stores.



\---



\## Rule 7



No file should exceed approximately 300–400 lines without justification.



Split responsibility before complexity grows.



\---



\## Rule 8



One responsibility per component.



Bad



BookCard

BookSearch

BookReader

BookEditor



inside one component.



Good



BookCard



BookGrid



BookReader



BookToolbar



BookSidebar



\---



\# Folder Ownership



Each feature owns



components/



hooks/



services/



store/



types/



utils/



Do not import feature internals into another feature.



Communicate through public APIs only.



\---



\# State Rules



Global Store



Only



Theme



Authentication



Room



Settings



Everything else owns its own store.



\---



\# API Rules



Every endpoint



Controller



↓



Service



↓



Repository



↓



Database



Never skip layers.



\---



\# Error Handling



Every async function



must



return predictable errors.



Never throw raw database errors to the UI.



\---



\# Naming



Components



PascalCase



Hooks



useSomething



Utilities



camelCase



Constants



UPPER\_SNAKE\_CASE



Interfaces



IUser



Types



BookCategory



Enums



PascalCase



\---



\# TypeScript



Strict mode enabled.



No `any`.



Prefer explicit types.



Use discriminated unions where appropriate.



\---



\# Styling



Tailwind only.



Avoid inline styles.



No hardcoded colors.



Use design tokens.



\---



\# Animations



Framer Motion only.



Animation durations should remain consistent.



No animation should delay usability.



\---



\# Accessibility



Every interactive element must



\- be keyboard accessible

\- have an accessible label

\- expose visible focus states

\- respect reduced motion preferences



Accessibility issues are treated as bugs.



\---



\# Performance



Lazy-load large modules.



Memoize expensive calculations.



Avoid unnecessary renders.



Optimize assets before committing.



\---



\# Git Workflow



feature/bookshelf



feature/telescope



feature/journal



fix/login



refactor/api



docs/prd



One feature per branch.



\---



\# Pull Request Checklist



\- Builds successfully

\- No TypeScript errors

\- Lint passes

\- Tests pass

\- Documentation updated

\- Screenshots included for UI changes



\---



\# Code Review Checklist



Review



Architecture



Naming



Performance



Accessibility



Security



Readability



Testing



Reject code that violates project principles even if it works.



\---



\# Final Principle



Write code that your future self can understand in six months without needing an explanation.



The project should feel engineered—not merely assembled.

