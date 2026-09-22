"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity } from 'lucide-react';

interface RecentScan {
  id: string;
  created_at: string;
  threat_index: number;
  scam_type: string;
}

export function LiveTicker() {
  const [scans, setScans] = useState<RecentScan[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRecent() {
      // Return early if no keys are set to prevent errors on the landing page
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        setError(true);
        return;
      }

      const { data, error } = await supabase
        .from('scans')
        .select('id, created_at, threat_index, scam_type')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!error && data) {
        setScans(data);
      }
    }
    fetchRecent();

    // Set up realtime subscription
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const channel = supabase
        .channel('public:scans')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans' }, (payload) => {
          setScans((current) => [payload.new as RecentScan, ...current].slice(0, 5));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  if (error || scans.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-24 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#F1651A] animate-pulse" />
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Live Threat Feed</h3>
      </div>
      <div className="flex flex-col gap-3">
        {scans.map((scan) => (
          <div key={scan.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
               <span className={`w-3 h-3 rounded-full ${scan.threat_index > 70 ? 'bg-rose-500' : scan.threat_index > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
               <span className="text-sm font-medium text-slate-700">Scan performed just now</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                {scan.scam_type || 'Unknown'}
              </span>
              <span className={`font-black ${scan.threat_index > 70 ? 'text-rose-500' : scan.threat_index > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {scan.threat_index}% Risk
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
