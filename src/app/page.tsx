import React from 'react';
import { Shield, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LiveTicker } from '@/components/LiveTicker';

export default function PhishingInspectorLanding() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans relative flex flex-col overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70"></div>

      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-md object-cover" />
          Phishing Inspector
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
          <Link href="/scams" className="hover:text-slate-900">Education Hub</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold bg-[#F1651A] hover:bg-[#d95a16] text-white px-5 py-2.5 rounded-full transition-colors shadow-[0_4px_14px_0_rgb(241,101,26,0.39)]">
            Sign In
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-24 pb-32">
        
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 border border-slate-100">
           <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md object-cover" />
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-center max-w-4xl leading-[1.1] text-slate-900">
          Don't Pay for That <br/>
          <span className="text-[#F1651A] font-bold">'Free' Laptop</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 text-center max-w-xl font-medium">
          Catch the <span className="text-[#F1651A] font-bold">'Free' Laptop</span>, advance-fee deposit traps and pay-for-equipment phishing scams that slip right past Gmail and Outlook.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <Link href="/login" className="w-full sm:w-auto bg-[#F1651A] hover:bg-[#d95a16] text-white font-bold text-lg px-8 py-4 rounded-full transition-all shadow-[0_8px_30px_rgb(241,101,26,0.25)] flex items-center justify-center gap-2">
            Start Scanning Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Live Community Feed */}
        <LiveTicker />

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 md:left-24 w-64 bg-[#FFF9C4] rounded-sm p-5 shadow-lg transform -rotate-3 hidden lg:block">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full mx-auto mt-0.5"></div>
          </div>
          <p className="font-['Caveat',cursive] text-xl text-slate-800 leading-tight mt-2">
            "They sent a check for my home office setup, but asked me to wire $500 back..."
          </p>
        </div>

        <div className="absolute top-32 right-10 md:right-24 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 transform rotate-6 hidden lg:block">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
             <AlertTriangle className="text-rose-500 w-6 h-6" />
          </div>
          <div className="ml-6">
            <h3 className="text-sm font-bold text-slate-800">Scam Threat Index</h3>
            <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-xs font-medium text-slate-500">Risk Assessment</p>
              <p className="text-lg font-black text-rose-500 mt-0.5 flex items-center gap-1">
                98% High Risk
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
