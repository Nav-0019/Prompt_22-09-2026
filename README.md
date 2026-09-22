# Phishing Inspector 🕵️‍♂️ (PromptWars Hackathon)

## 📌 Chosen Vertical
**Consumer Scams & Phishing Protection.** 
This project focuses on protecting everyday internet users from sophisticated phishing URLs, fraudulent job offers, advance-fee scams, and malicious documents through AI-powered forensic analysis.

## 🧠 Approach and Logic
The Phishing Inspector acts as a digital forensic analyst. Rather than relying on simple static blocklists, it utilizes **Google Gemini 2.5 Flash** to perform deep semantic and structural analysis on inputs.
- **URL Scanning:** Checks for domain anomalies, typo-squatting, and deceptive URI structures.
- **Text/Email Snippets:** Analyzes tone, urgency markers, and financial coercion tactics.
- **Document Analysis:** Processes uploaded PDFs and Images to extract text and identify fraudulent letterheads or fake invoices.

## ⚙️ How the solution works
1. **User Input:** The user selects a mode (Text, URL, or Document) and provides the suspicious content.
2. **AI Processing:** The Next.js API route formats a highly specific prompt enforcing a strict JSON schema and sends it to the Gemini API.
3. **Forensic Breakdown:** Gemini returns a calculated Threat Index (0-100%), risk categorization, and extracts specific Indicators of Compromise (IOCs).
4. **UI Presentation:** The frontend dynamically renders the JSON response into actionable widgets, providing the user with immediate remediation steps and a generated official cybercrime complaint draft.

## 🛑 Assumptions Made
- **Vercel Hobby Limits:** It is assumed the application is deployed on a free-tier serverless platform, hence the selection of the lightning-fast `gemini-2.5-flash` model to bypass 10-second API timeouts.
- **Supabase Realtime:** It is assumed a public Supabase instance is configured with the provided SQL schema to store and aggregate scan metrics.
- **Browser Compatibility:** It is assumed the user is running a modern browser that supports `localStorage` for theming and React concurrent features.

---
*Built with Next.js, TailwindCSS, Supabase, and Google GenAI.*
