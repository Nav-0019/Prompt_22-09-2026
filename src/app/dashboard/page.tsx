"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Calendar, Download, Plus, CheckCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface RecentScan {
  id: string;
  created_at: string;
  threat_index: number;
  scam_type: string;
}

export default function DashboardOverview() {
  const [scans, setScans] = useState<RecentScan[]>([]);
  const [userName, setUserName] = useState('Security Admin');
  const [filter, setFilter] = useState('All');
  const [timeRange, setTimeRange] = useState('All time');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const supabase = createClient();
    let channel: any;

    async function fetchData() {
      // Get User Name
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Security Admin';
        const firstName = fullName.split(' ')[0];
        setUserName(firstName);
      }

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const { data } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (data) setScans(data);

      // Subscribe to real-time changes
      channel = supabase
        .channel('dashboard-scans')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans' }, (payload) => {
          setScans((current) => [payload.new as RecentScan, ...current].slice(0, 200));
        })
        .subscribe();
    }
    fetchData();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const filteredScans = scans.filter(scan => {
    // 1. Search Query
    if (searchQuery && !scan.scam_type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Filter Dropdown
    if (filter === 'High Risk' && scan.threat_index <= 70) return false;
    if (filter === 'Medium Risk' && (scan.threat_index > 70 || scan.threat_index <= 30)) return false;
    if (filter === 'Low Risk' && scan.threat_index > 30) return false;

    // 3. Time Range
    const date = new Date(scan.created_at);
    const now = new Date();
    if (timeRange === 'Last month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      if (date < oneMonthAgo) return false;
    }
    if (timeRange === 'Last week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      if (date < oneWeekAgo) return false;
    }
    if (timeRange === 'Today') {
      if (date.getDate() !== now.getDate() || date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) return false;
    }
    return true;
  });

  // Analytics Cards (Unfiltered Global Metrics)
  const totalScans = scans.length;
  const avgThreat = scans.length > 0 ? Math.round(scans.reduce((acc, scan) => acc + scan.threat_index, 0) / scans.length) : 0;
  const threatsPrevented = scans.filter(s => s.threat_index >= 70).length;
  const safeChecks = scans.filter(s => s.threat_index < 30).length;
  
  // Calculate Top Scam Vector based on all data
  const scamCounts = scans.reduce((acc, curr) => {
    if (curr.scam_type && curr.scam_type !== 'None' && curr.scam_type !== 'Legitimate Offer') {
      acc[curr.scam_type] = (acc[curr.scam_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topScamVector = Object.entries(scamCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  const totalAnalyzed = threatsPrevented + safeChecks || 1;
  const threatHeight = Math.max(10, Math.round((threatsPrevented / totalAnalyzed) * 100));
  const safeHeight = Math.max(10, Math.round((safeChecks / totalAnalyzed) * 100));

  // Note: the toggles are replaced by direct setFilter / setTimeRange in the dropdown UI

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Scam Type', 'Threat Level', 'ID'],
      ...filteredScans.map(s => [
        new Date(s.created_at).toLocaleDateString(),
        `"${s.scam_type}"`,
        `${s.threat_index}%`,
        s.id
      ])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "phishing_scans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animation-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-6">
        <h1 className="text-4xl font-normal text-slate-900 tracking-tight">
          Good morning, <span className="font-bold">{userName}!</span>
        </h1>
        <Link 
          href="/scan" 
          className="bg-[#F1651A] hover:bg-[#d95a16] text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_14px_0_rgb(241,101,26,0.39)] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New scan
        </Link>
      </div>

      {/* FILTER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-sm p-1 border border-slate-100">
          
          {/* FILTER DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowTimeDropdown(false); }} 
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-full text-sm font-bold text-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" /> {filter === 'All' ? 'Filter' : filter}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {['All', 'High Risk', 'Medium Risk', 'Low Risk'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => { setFilter(f); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${filter === f ? 'text-[#F1651A] bg-orange-50/50' : 'text-slate-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-px h-6 bg-slate-200"></div>
          
          {/* TIME RANGE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowFilterDropdown(false); }} 
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-full text-sm font-bold text-slate-700 transition-colors"
            >
               {timeRange}
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {['All time', 'Today', 'Last week', 'Last month'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setTimeRange(t); setShowTimeDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${timeRange === t ? 'text-[#F1651A] bg-orange-50/50' : 'text-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200"></div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-full text-sm font-bold text-slate-700 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-100 px-4 py-2 w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by scam type..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full font-medium text-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3-COLUMN GRID LAYOUT (Image 1 Inspiration) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Active Scanner</h3>
              <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" /> Upgrade
              </button>
            </div>
            
            {/* "Credit Card" Style Status Block */}
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden mb-6 text-white shadow-xl h-48 flex flex-col justify-between">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
               <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#F1651A] rounded-tl-3xl opacity-90"></div>
               
               <div className="flex justify-between items-start relative z-10">
                 <div className="flex items-center gap-2">
                   <img src="/logo.png" className="w-8 h-8 opacity-80" alt="logo" />
                   <span className="font-bold tracking-wider opacity-80">PRO</span>
                 </div>
                 <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                 </div>
               </div>
               
               <div className="relative z-10">
                 <p className="text-xs text-slate-400 font-bold tracking-widest mb-1">SCANS PERFORMED</p>
                 <div className="flex justify-between items-end">
                   <p className="font-mono text-xl tracking-widest">{totalScans}</p>
                   <p className="text-xs font-bold text-slate-400">UNLIMITED</p>
                 </div>
               </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                Threats Prevented
              </div>
              <span className="font-bold text-slate-900">{threatsPrevented}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                Safe Checks
              </div>
              <span className="font-bold text-slate-900">{safeChecks}</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-64 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Threat Analysis</h3>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800">View details &gt;</button>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
               <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{threatsPrevented}</h2>
               <p className="text-sm font-medium text-slate-500 mb-1 leading-tight">Total threats<br/>detected</p>
            </div>

            {/* Dynamic Bar Chart */}
            <div className="flex-1 flex items-end gap-2 mt-auto">
               <div className="w-1/2 bg-rose-500 rounded-t-xl relative group transition-all duration-1000" style={{ height: `${threatHeight}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded">
                   {threatsPrevented}
                 </div>
               </div>
               <div className="w-1/2 bg-emerald-400 rounded-t-xl relative group transition-all duration-1000" style={{ height: `${safeHeight}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded">
                   {safeChecks}
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800 text-lg">Scan Volume</h3>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800">All time v</button>
            </div>
            <div className="flex items-center gap-2 mb-8">
               <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{totalScans}</h2>
               <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Active</div>
            </div>

            {/* SVG Line Chart Mock */}
            <div className="absolute bottom-0 left-0 w-full h-32">
               <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                 <path d="M 0 80 Q 100 80 200 40 T 400 0" fill="none" stroke="#4F46E5" strokeWidth="3" />
                 <path d="M 0 80 Q 100 80 200 40 T 400 0 L 400 100 L 0 100 Z" fill="url(#gradient)" className="opacity-10" />
                 <defs>
                   <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#4F46E5" />
                     <stop offset="100%" stopColor="white" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <circle cx="200" cy="40" r="4" fill="white" stroke="#4F46E5" strokeWidth="2" />
               </svg>
               {/* Tooltip on Line */}
               <div className="absolute left-[50%] top-[20%] -translate-x-1/2 -translate-y-full bg-white shadow-md rounded text-[10px] font-bold px-2 py-1 border border-slate-100 text-slate-600">
                 Sep 12
               </div>
               <div className="absolute left-[50%] top-[20%] w-px h-full bg-slate-200 border-l border-dashed border-slate-300"></div>
            </div>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center h-64">
             {/* Dynamic SVG Gauge */}
             <div className="relative w-48 h-24 overflow-hidden mt-6 flex justify-center">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  {/* Background Arc */}
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                  {/* Dynamic Value Arc */}
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke={avgThreat > 70 ? "#f43f5e" : avgThreat > 30 ? "#fbbf24" : "#6366f1"} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    strokeDasharray="125.6" 
                    strokeDashoffset={125.6 - (125.6 * avgThreat / 100)} 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
             </div>
             
             <div className="absolute mt-14 flex flex-col items-center">
               <h2 className="text-4xl font-bold text-slate-900">{avgThreat}%</h2>
               <p className="text-xs font-medium text-slate-500">Avg Threat Index</p>
             </div>

             <div className="flex items-center gap-6 mt-auto">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 <span className="text-[10px] font-bold text-slate-600 uppercase">High</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                 <span className="text-[10px] font-bold text-slate-600 uppercase">Med</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                 <span className="text-[10px] font-bold text-slate-600 uppercase">Low</span>
               </div>
             </div>
          </div>

          <div className="bg-indigo-500 p-6 rounded-[2rem] shadow-sm h-64 flex flex-col relative overflow-hidden text-white">
            <div className="flex justify-between items-center mb-2 z-10">
              <h3 className="font-bold text-indigo-50 text-lg">Top Scam Vector</h3>
              <button className="text-xs font-bold text-indigo-200 hover:text-white">Past 30 days v</button>
            </div>
            
            <div className="mt-4 z-10">
               <h2 className="text-3xl font-bold mb-1 truncate">{topScamVector}</h2>
               <div className="bg-indigo-400/50 inline-block text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-max">
                 Analyzed via AI
               </div>
            </div>

            {/* Background decorative curve */}
            <svg viewBox="0 0 400 200" className="absolute bottom-0 left-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                 <path d="M 0 150 Q 150 150 250 100 T 400 50" fill="none" stroke="white" strokeWidth="2" />
                 <circle cx="250" cy="100" r="4" fill="white" />
            </svg>
            <div className="absolute left-[62%] top-[45%] bg-white text-indigo-600 shadow-md rounded text-[10px] font-bold px-2 py-1">
                 Sep 18
            </div>
          </div>
        </div>

      </div>

      {/* RECENT SCANS HISTORY TABLE */}
      <div className="mt-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Recent Scan History</h3>
          <button className="text-sm font-bold text-[#F1651A] hover:text-[#d95a16]">View all</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scam Type</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Threat Level</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-slate-600">
                      {new Date(scan.created_at).toLocaleDateString()} {new Date(scan.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-slate-800">
                      {scan.scam_type}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${scan.threat_index > 70 ? 'bg-rose-500' : scan.threat_index > 40 ? 'bg-amber-400' : 'bg-indigo-500'}`}></div>
                        <span className="text-sm font-bold text-slate-700">{scan.threat_index}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors">
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 text-sm font-medium">
                    No scans performed yet. Click "New scan" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
