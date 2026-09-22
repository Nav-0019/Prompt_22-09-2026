-- Run this in your Supabase SQL Editor to fix the 404 errors

CREATE TABLE public.scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    threat_index INTEGER NOT NULL,
    risk_category TEXT NOT NULL,
    scam_classification TEXT NOT NULL,
    executive_summary TEXT NOT NULL
);

-- Enable Row Level Security (RLS) but allow anonymous inserts and reads for the hackathon demo
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.scans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON public.scans
    FOR SELECT USING (true);
