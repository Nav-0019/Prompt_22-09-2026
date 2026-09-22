"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Loader2, Upload, File as FileIcon, X, FileText, MessageCircle, ExternalLink, Ban } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type AppState = 'IDLE' | 'SCANNING' | 'RESULT' | 'ERROR';

interface ScanResult {
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

export default function ScannerDashboard() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [inputContent, setInputContent] = useState('');
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [scanMode, setScanMode] = useState<'text' | 'url' | 'document'>('text');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    "🔎 Reading submitted content...",
    "🌐 Inspecting signals and domain logic...",
    "💳 Checking payment demands...",
    "⚠ Detecting social-engineering patterns...",
    "📊 Calculating threat index..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'SCANNING') {
      interval = setInterval(() => {
        setScanStep((prev) => {
          if (prev < scanSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [appState, scanSteps.length]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Only allow images and PDFs for now
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
        setInputContent(''); // Clear text if file is uploaded
      } else {
        alert("Please upload a PDF or an Image.");
      }
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (!inputContent.trim() && !selectedFile) return;

    setAppState('SCANNING');
    setScanStep(0);
    setResult(null);
    setShowReport(false);

    try {
      let response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (inputContent) {
           formData.append('content', inputContent);
        }
        
        response = await fetch('/api/scan', {
          method: 'POST',
          body: formData,
        });
      } else {
        const type = inputContent.startsWith('http') ? 'url' : 'text';
        response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: inputContent, type })
        });
      }

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const data: ScanResult = await response.json();
      setResult(data);
      setAppState('RESULT');
    } catch (error) {
      console.error(error);
      setAppState('ERROR');
    }
  }, [inputContent, selectedFile]);

  const renderContent = () => {
    if (appState === 'IDLE' || appState === 'ERROR') {
      return (
        <div className="w-full max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 z-20 relative">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Inspect an Offer</h2>
          <p className="text-slate-500 text-sm mb-6">Select the type of content you want to analyze for threats.</p>

          <div className="flex border-b border-slate-200 mb-6">
            <button 
              onClick={() => { setScanMode('text'); setSelectedFile(null); setInputContent(''); }} 
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${scanMode === 'text' ? 'border-[#F1651A] text-[#F1651A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Text Snippet
            </button>
            <button 
              onClick={() => { setScanMode('url'); setSelectedFile(null); setInputContent(''); }} 
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${scanMode === 'url' ? 'border-[#F1651A] text-[#F1651A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Link / URL
            </button>
            <button 
              onClick={() => { setScanMode('document'); setInputContent(''); }} 
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${scanMode === 'document' ? 'border-[#F1651A] text-[#F1651A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              PDF / Image
            </button>
          </div>
          
          {scanMode === 'document' ? (
            <div className="mb-6">
              {selectedFile ? (
                <div className="p-6 border-2 border-dashed border-orange-200 bg-orange-50 rounded-xl flex flex-col items-center justify-center relative">
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-700"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <FileIcon className="w-10 h-10 text-orange-500 mb-2" />
                  <p className="font-semibold text-slate-700">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Ready for analysis</p>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-10 border-2 border-dashed border-slate-300 hover:border-[#F1651A] bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:bg-orange-50">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#F1651A] transition-colors" />
                  </div>
                  <p className="font-bold text-slate-700 mb-1">Click to upload document</p>
                  <p className="text-sm text-slate-500">Supports PDF, PNG, JPG (Max 5MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,application/pdf"
                    aria-label="Upload document file"
                  />
                </div>
              )}
            </div>
          ) : scanMode === 'url' ? (
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">
                Suspicious Link or URL
              </label>
              <input
                id="content"
                type="url"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F1651A] focus:border-transparent transition-all text-slate-700"
                placeholder="https://example.com/login"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                aria-label="Suspicious Link or URL"
              />
              <p className="text-xs text-slate-500 mt-2">We will parse the URL for domain age, anomalies, and known threat lists.</p>
            </div>
          ) : (
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">
                Job Offer or Email Text
              </label>
              <textarea
                id="content"
                rows={6}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F1651A] focus:border-transparent transition-all resize-none text-slate-700"
                placeholder="Paste the raw text of the email, message, or offer here..."
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                maxLength={5000}
                aria-label="Job Offer or Email Text"
              />
              <div className="flex justify-end mt-2">
                <span className="text-xs text-slate-400 font-medium">{inputContent.length} / 5000 characters</span>
              </div>
            </div>
          )}

          {appState === 'ERROR' && (
             <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600 font-medium flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" /> An error occurred during analysis. Please try again.
             </div>
          )}

          <button 
            onClick={handleScan}
            disabled={!inputContent.trim() && !selectedFile}
            aria-label="Scan Offer Now"
            className="w-full mt-2 bg-[#F1651A] hover:bg-[#d95a16] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-lg px-8 py-4 rounded-xl shadow-[0_8px_30px_rgb(241,101,26,0.3)] transition-all flex justify-center items-center gap-2"
          >
            Scan Offer Now <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
            🔒 Your text and files are analyzed in memory and not permanently stored.
          </p>
        </div>
      );
    }

    if (appState === 'SCANNING') {
      return (
        <div className="w-full max-w-xl mx-auto mt-12 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-100 p-12 z-20 relative flex flex-col items-center justify-center min-h-[300px]">
           <Loader2 className="w-12 h-12 text-[#F1651A] animate-spin mb-6" />
           <h2 className="text-xl font-bold text-slate-800 transition-all duration-300 text-center">
             {scanSteps[scanStep]}
           </h2>
        </div>
      );
    }

    if (appState === 'RESULT' && result) {
      const isHighRisk = result.threat_index >= 70;
      const isMediumRisk = result.threat_index >= 31 && result.threat_index < 70;
      
      const themeColor = isHighRisk ? 'text-rose-500' : isMediumRisk ? 'text-amber-500' : 'text-emerald-500';
      const bgThemeColor = isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500';
      const lightThemeColor = isHighRisk ? 'bg-rose-50' : isMediumRisk ? 'bg-amber-50' : 'bg-emerald-50';

      return (
        <div className="w-full max-w-3xl mx-auto mt-12 z-20 relative flex flex-col items-center">
           <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full overflow-hidden">
             
             {/* Score Header */}
             <div className={`${lightThemeColor} p-8 text-center border-b border-slate-100`}>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Threat Index</h2>
                <div className="flex items-center justify-center gap-4">
                  <div className={`text-6xl font-black ${themeColor}`}>{result.threat_index}%</div>
                </div>
                <div className={`mt-2 text-xl font-bold ${themeColor}`}>{result.risk_category}</div>
                {result.scam_classification !== 'Legitimate Offer' && result.scam_classification !== 'None' && (
                  <div className="mt-4 inline-block px-4 py-1 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                    Type: {result.scam_classification}
                  </div>
                )}
             </div>

             {/* Forensic Breakdown Badges */}
             <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-wrap gap-3 justify-center">
                {result.forensic_breakdown?.financial_risk_detected && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200">
                    <Shield className="w-4 h-4" /> Financial Risk Detected
                  </div>
                )}
                {result.forensic_breakdown?.domain_anomaly_detected && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                    <AlertTriangle className="w-4 h-4" /> Domain Anomaly
                  </div>
                )}
                {result.forensic_breakdown?.urgency_tactic_detected && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                    <Shield className="w-4 h-4" /> High Urgency Tactic
                  </div>
                )}
                {(!result.forensic_breakdown?.financial_risk_detected && !result.forensic_breakdown?.domain_anomaly_detected && !result.forensic_breakdown?.urgency_tactic_detected) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                    <CheckCircle className="w-4 h-4" /> No Primary Forensic Anomalies
                  </div>
                )}
             </div>

             {/* Factors */}
             <div className="p-8 bg-white">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Executive Summary</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{result.executive_summary}</p>

                <h3 className="text-lg font-bold text-slate-800 mb-6">Identified Red Flags</h3>
                
                {!result.red_flags || result.red_flags.length === 0 ? (
                  <div className="flex items-center gap-3 text-emerald-600 font-medium p-4 bg-emerald-50 rounded-xl">
                    <CheckCircle className="w-6 h-6" /> No significant scam indicators detected.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.red_flags.map((flag, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="shrink-0 mt-1">
                          <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 font-medium">{flag}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                 )}
              </div>

             {/* Deep IOC Breakdown */}
             {result.ioc_breakdown && (
               <div className="p-8 bg-slate-50 border-t border-slate-100">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Shield className="w-5 h-5 text-indigo-500" /> Technical Indicators (IOCs)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suspicious URLs</p>
                     {result.ioc_breakdown.suspicious_urls.length > 0 ? (
                       <ul className="list-disc pl-4 space-y-1">
                         {result.ioc_breakdown.suspicious_urls.map((url, i) => (
                           <li key={i} className="text-sm font-mono text-rose-600 break-all">{url}</li>
                         ))}
                       </ul>
                     ) : <p className="text-sm text-slate-500">None detected</p>}
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suspicious Emails</p>
                     {result.ioc_breakdown.suspicious_emails.length > 0 ? (
                       <ul className="list-disc pl-4 space-y-1">
                         {result.ioc_breakdown.suspicious_emails.map((email, i) => (
                           <li key={i} className="text-sm font-mono text-rose-600 break-all">{email}</li>
                         ))}
                       </ul>
                     ) : <p className="text-sm text-slate-500">None detected</p>}
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Malicious Phrasing Matches</p>
                     {result.ioc_breakdown.suspicious_phrases.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                         {result.ioc_breakdown.suspicious_phrases.map((phrase, i) => (
                           <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-md text-xs font-medium">"{phrase}"</span>
                         ))}
                       </div>
                     ) : <p className="text-sm text-slate-500">None detected</p>}
                   </div>
                 </div>
               </div>
             )}

             {/* Actionable Remediation Checklist */}
             {result.remediation_steps && result.remediation_steps.length > 0 && (
               <div className="p-8 bg-white border-t border-slate-100">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-emerald-500" /> Recommended Action Plan
                 </h3>
                 <div className="space-y-3">
                   {result.remediation_steps.map((step, idx) => (
                     <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                       <input type="checkbox" aria-label={`Remediation step ${idx + 1}`} className="mt-1 w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                       <span className="text-sm text-slate-700 font-medium">{step}</span>
                     </label>
                   ))}
                 </div>
               </div>
             )}

             {/* Report Action Center */}
             <div className="p-8 bg-slate-900 text-white flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-2">Report Action Center</h3>
                
                <div className="flex flex-wrap gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors" aria-label="Block Sender">
                    <Ban className="w-4 h-4 text-rose-400" /> Block Sender
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors" aria-label="Report to SafeBrowsing">
                    <ExternalLink className="w-4 h-4 text-indigo-400" /> Report to SafeBrowsing
                  </button>
                  <a 
                    href={`https://wa.me/917310347742?text=${encodeURIComponent(`🚨 THREAT ALERT: ${result.risk_category} (${result.threat_index}%)\nType: ${result.scam_classification}\n\nSummary: ${result.executive_summary}`)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="Share via WhatsApp"
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold px-4 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    <MessageCircle className="w-4 h-4" /> Share via WhatsApp
                  </a>
                </div>

                <div className="mt-4 border-t border-slate-700 pt-6">
                  <button 
                    onClick={() => setShowReport(!showReport)}
                    aria-label="Generate Official Cybercrime Complaint"
                    className="w-full flex items-center justify-center gap-2 bg-[#F1651A] hover:bg-[#d95a16] text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all"
                  >
                    <FileText className="w-5 h-5" /> {showReport ? "Hide Cybercrime Report" : "Generate Official Cybercrime Complaint"}
                  </button>

                  {showReport && result.official_report_draft && (
                    <div className="mt-6 bg-slate-800 border border-slate-700 p-6 rounded-xl relative">
                      <div className="absolute -top-3 left-6 bg-slate-900 px-2 text-xs font-bold tracking-widest text-slate-400">DRAFT COMPLAINT</div>
                      <textarea 
                        className="w-full bg-transparent text-slate-300 text-sm font-mono leading-relaxed resize-none focus:outline-none h-64"
                        defaultValue={result.official_report_draft}
                      />
                      <div className="mt-4 flex justify-end">
                        <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200">Copy to Clipboard</button>
                      </div>
                    </div>
                  )}
                </div>
             </div>

             <div className="p-6 bg-slate-50 flex justify-center">
                <button 
                  onClick={() => { setAppState('IDLE'); setInputContent(''); setSelectedFile(null); setShowReport(false); }}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-6 py-2 rounded-lg shadow-sm"
                >
                  Scan Another Offer
                </button>
             </div>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans relative flex flex-col">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>

      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80">
          <Image src="/logo.png" alt="Phishing Inspector Logo" width={24} height={24} className="w-6 h-6 rounded-md object-cover" priority />
          Phishing Inspector
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="/scan" className="text-[#F1651A] font-bold">Scanner</a>
          <a href="/scams" className="hover:text-slate-900">Education Hub</a>
        </nav>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-start pt-8 pb-32 px-6">
        {renderContent()}
      </main>
    </div>
  );
}
