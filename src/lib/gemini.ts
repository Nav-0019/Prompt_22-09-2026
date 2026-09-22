import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client explicitly with the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScanResult {
  threat_index: number;
  risk_category: string; 
  scam_classification: string;
  forensic_breakdown: {
    financial_risk_detected: boolean;
    domain_anomaly_detected: boolean;
    urgency_tactic_detected: boolean;
  };
  red_flags: string[];
  executive_summary: string;
  ioc_breakdown?: {
    suspicious_urls: string[];
    suspicious_emails: string[];
    suspicious_phrases: string[];
  };
  remediation_steps?: string[];
  official_report_draft?: string;
}

/**
 * Analyzes a given text snippet, URL, or document for phishing/scam red flags using Gemini AI.
 * 
 * @param {string} content - The text, URL, or extracted document text to analyze.
 * @param {'text' | 'url' | 'document'} type - The category of the input to ensure accurate prompt framing.
 * @param {string} [fileBase64] - Optional base64 encoded string of an image or PDF for multimodal analysis.
 * @param {string} [mimeType] - Optional MIME type of the uploaded file.
 * @returns {Promise<ScanResult>} A strongly-typed JSON object containing threat metrics and forensics.
 * @throws {Error} If the API request fails or the model returns unparseable data.
 */
export async function analyzeOffer(content: string, type: 'text' | 'url' | 'document' = 'text', fileBase64?: string, mimeType?: string): Promise<ScanResult> {
  const prompt = `You are an elite, enterprise-grade Cyber Threat Intelligence and Fraud Detection engine. Your task is to perform a deep forensic audit on the provided job offer, rental agreement, or employment communication.

Analyze the input text or visual document across these 4 distinct security vectors:
1. FINANCIAL DEMANDS & DEPOSIT TRAPS: Look for pay-for-equipment schemes, check-cashing clearances, security deposits, or training fee requirements.
2. DOMAIN & IDENTITY SPOOFING: Check if the contact email domain matches official corporate naming conventions or uses deceptive look-alike domains and free webmail providers.
3. RECRUITMENT ANOMALIES: Detect skipped interviews, unrealistic salary-to-effort ratios, and lack of verifiable corporate presence.
4. URGENCY & COERCION: Identify psychological manipulation tactics designed to bypass critical thinking (e.g., immediate deadlines, secrecy requests).

Calculate an exact Scam Threat Index from 0 to 100 (where 0 is completely legitimate, and 100 is a critical, confirmed scam).

You must respond ONLY with a valid, minified JSON object matching this exact structure, with no markdown code blocks or conversational filler:
{
  "threat_index": <integer 0-100>,
  "risk_category": "<Safe | Suspicious | High Risk>",
  "scam_classification": "<Pay-for-Equipment | Advance Deposit Trap | Fake Appointment Letter | Legitimate Offer>",
  "forensic_breakdown": {
    "financial_risk_detected": <boolean>,
    "domain_anomaly_detected": <boolean>,
    "urgency_tactic_detected": <boolean>
  },
  "red_flags": [
    "<Detailed forensic finding 1>",
    "<Detailed forensic finding 2>"
  ],
  "executive_summary": "<A comprehensive 2-sentence breakdown explaining the primary threat vectors identified.>",
  "ioc_breakdown": {
    "suspicious_urls": ["<url1>", "<url2>"],
    "suspicious_emails": ["<email1>"],
    "suspicious_phrases": ["<exact phrasing extracted from text>"]
  },
  "remediation_steps": [
    "<Actionable step 1, e.g. Immediate password reset>",
    "<Actionable step 2, e.g. Freeze credit cards>"
  ],
  "official_report_draft": "<A professionally worded 3-paragraph incident report summarizing the scam attempt, the extracted IOCs, and the intent, written in a formal tone ready to be submitted to a national cybercrime authority.>"
}

Input Text (if provided):
"""
${content}
"""`;

  try {
    let response;
    
    // If a file is provided, use multimodal capabilities
    if (fileBase64 && mimeType) {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType
            }
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });
    } else {
      // Text-only analysis
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });
    }

    let text = response.text || "{}";
    // Strip markdown codeblocks that Gemini sometimes adds
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(text) as ScanResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw new Error("Failed to analyze content using AI.");
  }
}
