import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client. It automatically picks up GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({});

export interface ScanResult {
  threat_index: number;
  risk_level: string; // "Safe" | "Suspicious" | "High Risk"
  detected_red_flags: string[];
  scam_type_detected: string; // "Pay-for-equipment" | "Deposit Trap" | "Fake Appointment" | "None"
  executive_summary: string;
}

export async function analyzeOffer(
  content: string, 
  type: 'text' | 'url' | 'image' | 'pdf', 
  fileBase64?: string, 
  mimeType?: string
): Promise<ScanResult> {
  const prompt = `You are an elite cybersecurity analyst specializing in employment and real estate fraud. 
Analyze the following user input (which may be a job offer, an email, an appointment letter, or a rental agreement).

Your objective is to identify vectors that bypass standard spam filters, specifically focusing on:
1. Pay-for-equipment phishing (e.g., asking the user to buy a laptop from a "trusted vendor").
2. Advance deposit traps (e.g., housing deposits before viewing, or background check fees).
3. Sender domain legitimacy (e.g., HR using a generic @gmail.com or newly registered domain).
4. Unrealistic salary-to-effort ratios or intense artificial urgency.

Calculate a Scam Threat Index from 0 to 100 (0 = completely safe, 100 = obvious scam).

Return ONLY a valid JSON object with the following schema, with no markdown formatting or backticks:
{
  "threat_index": <integer 0-100>,
  "risk_level": "<Safe | Suspicious | High Risk>",
  "detected_red_flags": [
    "<String detailing specific suspicious payment demand, if any>",
    "<String detailing domain or contact anomalies, if any>",
    "<String detailing psychological pressure/urgency, if any>"
  ],
  "scam_type_detected": "<Pay-for-equipment | Deposit Trap | Fake Appointment | None>",
  "executive_summary": "<A 2-sentence explanation of why this score was given>"
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

    const text = response.text || "{}";
    const result = JSON.parse(text) as ScanResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze content using AI.");
  }
}
