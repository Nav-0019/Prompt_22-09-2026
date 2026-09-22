# UI/UX Specification

## 1. Product Identity
- **Name:** Phishing Inspector (formerly OfferShield)
- **Vibe:** Calm security, not scary cybersecurity. "Think, plan, and track all in one place" aesthetic applied to threat analysis.
- **Color Palette:**
  - Background: Very light grey (`#F8F9FB`) with a subtle dotted grid pattern (`[radial-gradient(#CBD5E1_1px,transparent_1px)]`).
  - Primary Text: Slate 900 (`#0F172A`).
  - Secondary Text: Slate 600 (`#475569`).
  - Accent/Brand: Bright Blue (`#2563EB` / blue-600).
  - Semantic Risk Colors: Rose/Red for High Risk, Amber for Medium Risk, Emerald/Green for Low Risk.

## 2. Layout & Typography
- **Structure:** Single-page application centered around a Hero section and a scanning input area.
- **Typography:** Sans-serif (Inter or system default). High contrast, bold headings (6xl-7xl for Hero), legible body text.
- **Floating Elements (Glassmorphism):** Use 3D floating UI widgets (cards with `bg-white/90 backdrop-blur`, soft drop shadows `shadow-xl border-slate-100`) to represent abstract concepts or past results, adding depth without clutter.

## 3. Core Interactions (The "Scanner")
1. **Input:**
   - Central white container with a text area.
   - Auto-detects text vs. URL.
2. **Scan Animation (Progressive Disclosure):**
   - After clicking the primary blue CTA button ("Scan Offer Now"), replace the input with an animation sequence.
   - `🔎 Reading submitted content...` → `🌐 Inspecting signals...` → `📊 Calculating index...`
3. **Result View (The Dashboard):**
   - Displays a large Threat Index (e.g., "85% High Risk").
   - Below it, a list of "Identified Red Flags" (e.g., Advance Fee Demand, Generic Domain) with individual score contributions visualized as progress bars or badges.

## 4. Accessibility & Polish
- Subtle animations (e.g., `animate-bounce` with a 3s duration for the main shield icon).
- Hover states on buttons (`transform hover:-translate-y-1 hover:shadow-lg`).
- High text contrast ensuring readability against the light background.
