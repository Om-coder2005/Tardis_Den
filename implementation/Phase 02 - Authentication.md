\# TARDIS Den

\# **Phase 02 - Authentication**



Version: 1.0



Status: Ready for Implementation



\---



\# Goal



Implement a secure authentication system that protects access to TARDIS Den.



The administrator must authenticate using a six-character passcode before entering the room.



No room functionality should be implemented in this phase.



Authentication should be production-ready and easily extensible for future authentication methods.



\---



\# Objectives



Implement



• Login Page



• Passcode Input



• Session Management



• Route Protection



• Logout



• Authentication API



• Security Middleware



• Error Handling



Do NOT implement



Room



Bookshelf



Journal



Telescope



Animations



Desktop



AI



Gallery



Photobooth



\---



\# User Flow



Landing



↓



Enter Passcode



↓



Validate



↓



Create Session



↓



Redirect to /room



↓



Room Placeholder



\---



\# Login Screen



The login screen should be minimal.



Elements



Application Logo



Title



Subtitle



Six Input Boxes



Submit Button



Error Message Area



Footer



\---



\# Passcode



Exactly six characters.



Auto focus.



Backspace support.



Paste support.



Keyboard accessible.



Enter submits.



Mask characters after short delay.



\---



\# Validation



Frontend



Length



Required



Character validation



Backend



Verify hash



Rate limit



Create session



Return secure cookie



\---



\# Session



Secure HTTP-only cookie.



Persistent session.



Automatic refresh.



Logout clears session.



\---



\# Route Protection



Protected



/room



/settings



/gallery



/journal



Future routes



Public



/



/login



404



\---



\# API Endpoints



POST



/api/auth/login



GET



/api/auth/session



POST



/api/auth/logout



\---



\# Login Request



Body



passcode



\---



\# Success Response



Authenticated



Session created



Redirect



\---



\# Failure Response



Generic error only.



Never reveal whether passcode length or value is incorrect.



\---



\# Backend



Create



Auth Controller



Auth Service



Auth Repository



Auth Middleware



Validation



Session Manager



Password Hash Utility



\---



\# Database



Administrator



Session



Tables only.



No future models.



\---



\# Security



Hash passcode.



Never store plaintext.



Rate limiting.



Helmet.



CORS.



Input validation.



Secure cookies.



CSRF protection.



Environment variables.



\---



\# UI Requirements



Theme follows Design System.



Responsive.



Centered layout.



No scrolling.



Accessible.



Keyboard-first.



Reduced motion support.



\---



\# Loading State



Disable submit.



Loading indicator.



Prevent duplicate requests.



\---



\# Error Handling



Network failure



Invalid credentials



Expired session



Server unavailable



Unexpected error



Each should have user-friendly messaging.



\---



\# Logout



Destroy session.



Clear cookies.



Redirect to login.



\---



\# Testing



✓ Login success



✓ Login failure



✓ Rate limiting



✓ Refresh session



✓ Logout



✓ Protected routes



✓ Cookie security



✓ Keyboard navigation



✓ Accessibility



\---



\# Deliverables



Working authentication system.



Protected routes.



Session management.



Backend authentication APIs.



Production-ready security.



Placeholder room route.



\---



\# Acceptance Criteria



Administrator can securely log in.



Session persists after refresh.



Unauthorized users cannot access protected routes.



Logout completely removes authentication.



No room features are implemented.



Project is ready for Phase 03.



\---



\# Constraints



Do not implement any room objects.



Do not create placeholder business logic for future modules.



Only create the authentication infrastructure required by this phase.



Follow the architecture, design system, and coding standards defined in the project documentation.

