import { NextResponse } from 'next/server';
import { analyzeOffer } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60; // Allow up to 60 seconds for Gemini processing on Vercel Hobby tier

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let content = '';
    let inputType: 'text' | 'url' | 'document' = 'text';
    let fileBase64: string | undefined = undefined;
    let mimeType: string | undefined = undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const textContent = formData.get('content') as string;
      
      content = textContent || '';
      
      if (file) {
        inputType = 'document';
        mimeType = file.type;
        const arrayBuffer = await file.arrayBuffer();
        fileBase64 = Buffer.from(arrayBuffer).toString('base64');
      }
    } else {
      const body = await req.json();
      content = body.content || '';
      inputType = body.type === 'url' ? 'url' : 'text';
    }

    if (!content && !fileBase64) {
      return NextResponse.json({ error: 'Content or file is required.' }, { status: 400 });
    }

    // 1. Analyze with Gemini
    const startTime = Date.now();
    const result = await analyzeOffer(content, inputType, fileBase64, mimeType);
    const latency = Date.now() - startTime;

    // 2. Log to Supabase (Fire and forget, don't await/block the response)
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseKey) {
      supabase
        .from('scans')
        .insert([{
          input_type: inputType,
          threat_index: result.threat_index,
          factors: result.red_flags,
          scam_type: result.scam_classification,
          latency_ms: latency
        }])
        .then(({ error }) => {
          if (error) console.error("Supabase Log Error:", error);
        });
    }

    // 3. Return the AI analysis to the client
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Scan API Error:', error);
    // Removed the mock fallback so you can see the real error!
    return NextResponse.json({ error: error.message || "Failed to analyze content" }, { status: 500 });
  }
}
