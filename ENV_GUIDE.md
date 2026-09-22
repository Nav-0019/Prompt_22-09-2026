# Environment / Setup Guide

This guide details how to set up the local development environment for Phishing Inspector.

## 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- A Google Cloud account with the Gemini API enabled.
- A Supabase account.

## 2. Environment Variables
Create a file named `.env.local` in the root of the project directory.

```env
# Google Gemini API
# Get this from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (Telemetry DB)
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

*Note: For the MVP, if Supabase is not configured, ensure the codebase falls back gracefully (e.g., skips logging and still returns the AI analysis).*

## 3. Local Development Commands

- **Install dependencies:** `npm install`
- **Run the local dev server:** `npm run dev` (Usually starts on http://localhost:3000)
- **Build for production:** `npm run build`
- **Start production server:** `npm start`
- **Lint the code:** `npm run lint`

## 4. Dependencies of Note
- `next`: The core framework.
- `react`, `react-dom`: UI library.
- `tailwindcss`: For styling.
- `lucide-react`: For the icons used in the UI.
- `@google/genai`: (or relevant generic fetch method) To interface with the Gemini API.
- `@supabase/supabase-js`: To connect to the Supabase database.
