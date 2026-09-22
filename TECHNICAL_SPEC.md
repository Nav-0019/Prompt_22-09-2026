# Technical Specification

## 1. System Architecture
Phishing Inspector is a single-page application built on a modern serverless stack.

- **Client:** Next.js (App Router) React application.
- **Server:** Next.js API Routes (`/api/*`) deployed as Serverless Functions (Vercel).
- **AI Engine:** Google Gemini API (Server-to-Server communication only).
- **Persistence:** Supabase PostgreSQL database (accessed via Server).

## 2. Directory Structure

```text
/
├── app/
│   ├── api/
│   │   └── scan/
│   │       └── route.ts       # Main scanning endpoint
│   ├── layout.tsx             # Global layout (fonts, metadata)
│   └── page.tsx               # Main SPA interface
├── components/
│   ├── ui/
│   │   ├── scanner-input.tsx  # Text/URL input component
│   │   ├── scan-animation.tsx # Progressive loading component
│   │   └── threat-result.tsx  # Score and breakdown component
├── lib/
│   ├── gemini.ts              # Gemini API client and prompts
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Tailwind class merging, etc.
└── public/                    # Static assets
```

## 3. Data Flow
1. **Client:** User submits text/URL via `ScannerInput`.
2. **Client:** Updates state to `scanning`, triggers `ScanAnimation`.
3. **Client:** Makes POST request to `/api/scan` with payload `{ content: string, type: 'text' | 'url' }`.
4. **Server (`/api/scan`):**
   - Validates input.
   - If URL, attempts to extract domain/content (basic fetch).
   - Constructs prompt and calls Gemini API via `lib/gemini.ts`.
5. **AI Engine:** Evaluates content against risk heuristics and returns structured JSON (Threat Index + Risk Factors).
6. **Server:** Receives JSON, asynchronously logs the anonymous scan to Supabase via `lib/supabase.ts`.
7. **Server:** Returns structured JSON to Client.
8. **Client:** Updates state, hides animation, displays `ThreatResult`.

## 4. API Endpoints

### `POST /api/scan`
- **Request Body:**
  ```json
  {
    "content": "Urgent: Please pay equipment fee...",
    "type": "text" // or "url"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "threatIndex": 85,
    "riskLevel": "High Risk",
    "factors": [
      { "name": "Payment Demand", "score": 35, "description": "Requests upfront fee." },
      { "name": "Urgency", "score": 20, "description": "Creates pressure to act." }
    ]
  }
  ```

## 5. Security & Privacy
- **API Keys:** Gemini and Supabase Service Role keys must reside only on the server (`.env.local`). Never expose them to the browser.
- **Data Retention:** The raw `content` sent to `/api/scan` is analyzed in-memory and discarded. Only the resulting `threatIndex` and abstract `factors` may be logged to Supabase for telemetry, ensuring PII/sensitive job offer data is not stored.
