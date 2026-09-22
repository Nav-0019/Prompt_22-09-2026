# Product Requirements Document (PRD)

## 1. Project Information
- **Project Name:** Phishing Inspector (formerly OfferShield)
- **Concept:** A calm, trustworthy, single-page web application that analyzes job offers, emails, and URLs for phishing and scam indicators, providing an explainable "Scam Threat Index."
- **Target Audience:** Consumers, job seekers, and everyday users who suspect a message, offer, or link might be a scam.

## 2. Problem Statement
Users frequently receive suspicious job offers, rental agreements, or urgent emails demanding payment or sensitive information. They lack a simple, understandable tool to verify the legitimacy of these communications without feeling overwhelmed by complex cybersecurity jargon or intimidating interfaces.

## 3. Goals
- **Simplicity:** Provide a "Paste → Scan → Understand" workflow.
- **Trust:** Use a clean, light-mode, modern design that feels secure and premium.
- **Transparency:** Never present a threat score without explaining the specific signals (red flags) that contributed to it.
- **Speed:** Deliver a working MVP in 2 hours suitable for a hackathon demo.

## 4. Key Features & Scope (MVP)
### In Scope
1. **Unified Input Area:** A single text box that accepts raw text or URLs and auto-detects the input type.
2. **Scan Animation Sequence:** A progressive loading state that simulates the analysis pipeline (Reading → Inspecting → Checking → Calculating).
3. **Threat Index Display:** A clear 0-100% score indicating the risk level.
4. **Risk Factor Breakdown:** A detailed list of detected signals (e.g., Payment Demand, Domain Mismatch, Urgency) with their individual score weights.
5. **AI Content Analysis:** Integration with Google Gemini to analyze the semantics of the pasted text.

### Out of Scope
- User authentication / Login / Profiles
- PDF or Image OCR scanning
- Browser extensions or email integrations
- Custom ML models (relying on Gemini API instead)
- Complex historical analytics dashboard

## 5. Constraints
- **Time:** 120-minute development limit.
- **Design:** Must adhere strictly to the provided Light SaaS Landing Page aesthetic (white/off-white background, minimal shadows, strong blue accent, no hacker/matrix tropes).
- **Security:** Do not store raw submitted text permanently. Protect API keys.

## 6. User Flow
1. User lands on the single-page application.
2. User pastes suspicious text or a URL into the central input box.
3. User clicks "Scan Offer Now".
4. User observes the progressive scan animation.
5. User is presented with the final Threat Index and the "Why we flagged it" breakdown.
6. User decides how to proceed based on clear, calm advice (e.g., "Don't send money until verified").
