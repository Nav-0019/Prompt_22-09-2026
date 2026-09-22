# Testing & QA Specification

## 1. Unit Testing Strategy
Given the 2-hour constraint for the MVP, automated unit tests (e.g., Jest/React Testing Library) are **out of scope**. QA will rely on structured manual verification.

## 2. Core Manual Test Cases

### TC01: Text Input Validation
- **Action:** Type fewer than 5 characters.
- **Expected:** "Scan" button remains disabled.
- **Action:** Paste exactly 5,001 characters.
- **Expected:** Input truncates or shows an error; cannot scan.

### TC02: URL Detection
- **Action:** Paste `https://suspicious-domain-example.com/login`.
- **Expected:** UI automatically detects this as a URL and switches context internally before sending to the API.

### TC03: The Happy Path (Safe Content)
- **Action:** Paste a standard, non-urgent greeting message (e.g., "Hi, checking in on our meeting tomorrow.").
- **Expected:** 
  1. Scan animation plays (2-4 seconds).
  2. Threat Index returns < 20% (Green).
  3. No severe Red Flag cards are shown.

### TC04: The Scam Path (High Risk Content)
- **Action:** Paste "URGENT: Your account will be locked. Pay the $50 equipment fee now at http://fake-link.com".
- **Expected:**
  1. Scan animation plays.
  2. Threat Index returns > 75% (Red).
  3. Risk Factor cards appear specifically highlighting "Payment Demand" and "Urgency".

### TC05: API Error Handling
- **Action:** Disconnect the internet or temporarily alter the Gemini API key to simulate a failure.
- **Expected:** The animation stops, and a graceful error message appears in the UI. No application crash.

## 3. Visual QA
- Ensure the dot-grid background renders correctly on both large screens and mobile devices.
- Ensure the `lucide-react` icons are perfectly aligned within their glassmorphism containers.
- Check contrast ratios for the light grey text (`text-slate-400` vs `text-slate-600`) against the white/grey background.
