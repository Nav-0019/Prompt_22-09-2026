# Database Specification

## Overview
The MVP uses Supabase (PostgreSQL) primarily for telemetry and logging scan results to understand usage patterns and improve the AI prompts over time.

## 1. Security & Privacy constraints
- **No PII:** The actual text of the job offer or email must **not** be stored.
- **Anonymity:** No user sessions are tied to the logs in the MVP.
- **Access:** The database is accessed via the Next.js API route using the Supabase Server Client. RLS (Row Level Security) can be enabled to only allow inserts via service role.

## 2. Schema

### Table: `scans`

| Column Name   | Type                     | Description                                                                 |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| `id`          | `uuid` (Primary Key)     | Unique identifier for the scan log.                                         |
| `created_at`  | `timestamp with tz`      | Defaults to `now()`. When the scan occurred.                                |
| `input_type`  | `text`                   | `text` or `url`. Indicates what the user pasted.                            |
| `threat_index`| `integer`                | The final calculated score (0-100).                                         |
| `factors`     | `jsonb`                  | Array of identified risk factors (e.g., `[{"name": "Urgency", "score": 15}]`) |
| `latency_ms`  | `integer`                | How long the Gemini API call took (for performance monitoring).             |

## 3. Operations

### Insert Log (Server-Side Only)
```typescript
const { error } = await supabase
  .from('scans')
  .insert([
    {
      input_type: type,
      threat_index: index,
      factors: factorsJson,
      latency_ms: latency
    }
  ]);
```

*Note: Since this is an MVP, we do not have tables for Users, Sessions, or Auth.*
