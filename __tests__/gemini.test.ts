import { analyzeOffer } from '@/lib/gemini';

// Mock the GoogleGenAI module
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: JSON.stringify({
              threat_index: 85,
              risk_category: 'High Risk',
              scam_classification: 'Pay-for-Equipment',
              forensic_breakdown: {
                financial_risk_detected: true,
                domain_anomaly_detected: true,
                urgency_tactic_detected: false
              },
              red_flags: ['Urgent language'],
              executive_summary: 'Test summary'
            })
          })
        }
      };
    })
  };
});

describe('Gemini AI Service', () => {
  it('analyzes text successfully and returns typed ScanResult', async () => {
    const result = await analyzeOffer("Fake job offer text", "text");
    expect(result.threat_index).toBe(85);
    expect(result.risk_category).toBe('High Risk');
    expect(result.scam_classification).toBe('Pay-for-Equipment');
    expect(result.red_flags).toContain('Urgent language');
  });
});
