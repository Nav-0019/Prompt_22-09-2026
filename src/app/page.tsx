"use client";

import React from 'react';
import { TypeAnimation } from 'react-type-animation';
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
          <Link href="/login" className="text-sm font-bold bg-[#F1651A] hover:bg-[#d95a16] text-white px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_14px_0_rgb(241,101,26,0.39)] hover:shadow-[0_8px_20px_0_rgb(241,101,26,0.5)]">
            Sign In
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-24 pb-32">
        
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 border border-slate-100 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:rotate-[10deg] hover:shadow-2xl cursor-default group">
           <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-center max-w-4xl leading-[1.1] text-slate-900">
          Don't Pay for That <br/>
          <TypeAnimation
            sequence={[
              "'Free' Laptop", 2000,
              "Background Check Fee", 2000,
              "Advance Deposit", 2000,
              "Fake Equipment", 2000
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="text-[#F1651A] font-bold"
          />
        </h1>
        <p className="mt-6 text-lg text-slate-600 text-center max-w-xl font-medium">
          Catch the <span className="text-[#F1651A] font-bold">'Free' Laptop</span>, advance-fee deposit traps and pay-for-equipment phishing scams that slip right past Gmail and Outlook.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto group">
          <Link href="/login" className="w-full sm:w-auto bg-[#F1651A] hover:bg-[#d95a16] text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgb(241,101,26,0.25)] hover:shadow-[0_12px_40px_rgb(241,101,26,0.4)] hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
            Start Scanning Now
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Live Community Feed */}
        <LiveTicker />

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 md:left-24 w-64 bg-[#FFF9C4] rounded-sm p-5 shadow-lg transform -rotate-3 hidden lg:block transition-all duration-500 hover:scale-110 hover:rotate-0 hover:z-50 hover:shadow-2xl cursor-pointer group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md group-hover:animate-pulse">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full mx-auto mt-0.5"></div>
          </div>
          <p className="font-['Caveat',cursive] text-xl text-slate-800 leading-tight mt-2">
            "They sent a check for my home office setup, but asked me to wire $500 back..."
          </p>
        </div>

        <div className="absolute top-32 right-10 md:right-24 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 transform rotate-6 hidden lg:block transition-all duration-500 hover:scale-110 hover:rotate-0 hover:z-50 hover:shadow-2xl cursor-pointer group">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:bg-rose-50">
             <AlertTriangle className="text-rose-500 w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
          </div>
          <div className="ml-6 transition-transform duration-300 group-hover:translate-x-1">
            <h3 className="text-sm font-bold text-slate-800">Scam Threat Index</h3>
            <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 transition-colors duration-300 group-hover:bg-rose-50/50">
              <p className="text-xs font-medium text-slate-500">Risk Assessment</p>
              <p className="text-lg font-black text-rose-500 mt-0.5 flex items-center gap-1 group-hover:animate-pulse">
                98% High Risk
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
