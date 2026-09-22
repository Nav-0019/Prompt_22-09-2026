# API Specification

## Endpoints

### 1. `POST /api/scan`

**Description:**
Analyzes a submitted job offer, email text, or URL for phishing indicators and returns a calculated Threat Index along with explainable risk factors.

**Authentication:**
- Publicly accessible for the MVP (Rate limiting recommended).
- Internal Server-to-Server calls to Gemini use `GEMINI_API_KEY`.

**Request Structure:**
```json
{
  "content": "string (max 5000 chars)",
  "type": "text | url"
}
```

**Validation Rules:**
- `content` must be a string and cannot be empty.
- `content` length must be <= 5000.
- `type` must be either "text" or "url".

**Success Response (200 OK):**
```json
{
  "threatIndex": 82,
  "riskLevel": "High Risk",
  "factors": [
    {
      "name": "Payment Demand",
      "score": 35,
      "description": "Requests an upfront equipment payment."
    },
    {
      "name": "Urgency",
      "score": 20,
      "description": "Creates pressure to make the recipient act immediately."
    }
  ]
}
```

**Error Responses:**

*400 Bad Request:*
```json
{
  "error": "Invalid input. Content must be provided and under 5000 characters."
}
```

*500 Internal Server Error:*
```json
{
  "error": "Failed to analyze the content. Please try again later."
}
```

## Internal Dependencies
- **Google Gemini API:** Called synchronously to evaluate the text.
- **Supabase:** Called asynchronously (fire-and-forget) to log the `threatIndex` and `factors`.
