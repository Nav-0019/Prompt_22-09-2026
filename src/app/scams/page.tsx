import React from 'react';
import { Shield, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EducationHub() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans relative flex flex-col">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70"></div>

      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-md object-cover" />
          Phishing Inspector
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/scan" className="hover:text-slate-900">Scanner</Link>
          <Link href="/scams" className="text-[#F1651A] font-bold">Education Hub</Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col pt-12 pb-32 px-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-[#F1651A]" />
          <h1 className="text-4xl font-bold text-slate-900">Scam Education Hub</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl font-bold text-slate-800">The "Free Laptop" Check Scam</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Scammers offer you a remote job and send a physical check (often forged) to buy "home office equipment" from their "approved vendor". The check bounces weeks later, but the money you sent to the vendor is gone forever.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
              <strong>Red Flag:</strong> Never deposit a check and send money back out to an unknown third party.
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-800">Rental Application Deposit Trap</h2>
            </div>
            <p className="text-slate-600 mb-4">
              A landlord claims they are out of town and cannot show the property, but promises to mail you the keys if you wire a security deposit first to "secure the listing".
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
              <strong>Red Flag:</strong> Never wire money or use Zelle for a property you haven't seen inside.
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <Link href="/scan" className="inline-flex items-center gap-2 bg-[#F1651A] hover:bg-[#d95a16] text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgb(241,101,26,0.39)]">
             Got a suspicious offer? Scan it now <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </main>
    </div>
  );
}
