# Feature Specification: Offer Scanner

## Overview
The Offer Scanner is the core feature of the Phishing Inspector MVP. It allows users to paste text or a URL and receive a detailed threat analysis.

## 1. Input State
- **Component:** `ScannerInput`
- **Behavior:**
  - A large textarea that accepts arbitrary text.
  - As the user types/pastes, a local regex checks if the input strongly resembles a URL vs. raw text.
  - A character counter limits input to 5,000 characters.
  - A primary action button "Scan Offer Now" is disabled if the input is empty or exceeds the limit.

## 2. Scanning State (Animation)
- **Component:** `ScanAnimation`
- **Trigger:** User clicks "Scan Offer Now".
- **Behavior:**
  - The `ScannerInput` is disabled or fades out.
  - A sequence of text updates appears, simulating the pipeline:
    1. `🔎 Reading submitted content...` (0-1s)
    2. `🌐 Inspecting signals...` (1-2s)
    3. `💳 Checking payment demands...` (2-3s)
    4. `⚠ Detecting social-engineering patterns...` (3-4s)
    5. `📊 Calculating threat index...` (4s until API returns)
  - This animation masks the latency of the Gemini API call.

## 3. Result State
- **Component:** `ThreatResult`
- **Trigger:** `/api/scan` returns a successful response.
- **Behavior:**
  - Displays a large Threat Index number (0-100%).
  - Colors conditionally based on score:
    - 0-30%: Green (Low Risk)
    - 31-69%: Amber (Medium Risk)
    - 70-100%: Red (High Risk)
  - Iterates over the `factors` array returned by the API to render individual "Red Flag" cards (e.g., Payment Demand, Urgency).
  - Provides a final summary recommendation (e.g., "⚠ Don't send money or identity documents until verified").

## 4. Error State
- **Trigger:** `/api/scan` returns a 500 or times out.
- **Behavior:**
  - Halts the animation.
  - Displays a calm error message: "We encountered an issue analyzing this offer. Please try again or manually verify the source."
  - Provides a "Try Again" button that restores the Input State.

## 5. Edge Cases
- **Input is only whitespace:** Button disabled.
- **Input is a URL but site is unreachable:** The API should fall back to analyzing just the URL structure for suspicious patterns using Gemini, and return a factor indicating the site couldn't be read.
