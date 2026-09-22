# Implementation Task Plan

This document outlines the sequential steps required to build the Phishing Inspector MVP within the 2-hour constraint.

## Phase 1: Project Setup (15 mins)
- [ ] Initialize Next.js app (`app-router`, Tailwind, TypeScript).
- [ ] Clean up default Next.js boilerplate.
- [ ] Install `lucide-react`.
- [ ] Configure Tailwind for the specific "Light SaaS" color palette (slate, bright blue, specific amber/red for risk).

## Phase 2: Core UI Construction (45 mins)
- [ ] Build `app/page.tsx` scaffold based on the provided React code snippet.
- [ ] Create `ScannerInput` component (Textarea, char count, URL detection).
- [ ] Create `ScanAnimation` component (Progressive state steps).
- [ ] Create `ThreatResult` component (Score ring, Risk Factor cards).
- [ ] Wire up local React state in `app/page.tsx` to transition between Input -> Scanning -> Result (using mock data).

## Phase 3: Backend & AI Integration (45 mins)
- [ ] Set up Gemini API key in `.env.local`.
- [ ] Create `lib/gemini.ts` with the specific prompt instruction to analyze text and return structured JSON (Score + Factors).
- [ ] Create `app/api/scan/route.ts` to handle POST requests, validate input, call `lib/gemini.ts`, and return the JSON.
- [ ] Connect the frontend `app/page.tsx` to the real `/api/scan` endpoint instead of mock data.

## Phase 4: Persistence & Polish (15 mins)
- [ ] Set up Supabase project and credentials.
- [ ] Create `scans` table in Supabase.
- [ ] Update `/api/scan/route.ts` to log anonymized scan results to Supabase (fire-and-forget to avoid blocking the response).
- [ ] Final UI review against `UIUX_SPEC.md` (check contrasts, remove default outlines, ensure smooth transitions).
