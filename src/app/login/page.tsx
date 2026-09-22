"use client";

import React, { useState } from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, signup, demoLogin } from './actions';

export default function SplitLogin() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData(e.currentTarget);
    
    // Server action will throw if it redirects on success, 
    // or return an error object if it fails.
    try {
      const response = isLogin ? await login(formData) : await signup(formData);
      if (response?.error) {
        setErrorMessage(response.error);
        setLoading(false);
      } else if (response?.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* LEFT SIDE (Branding & Value Prop) */}
      <div className="w-full md:w-[45%] bg-[#F4F7FA] relative flex flex-col p-12 overflow-hidden border-r border-slate-200">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 mb-auto">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md object-cover" />
          Phishing Inspector
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white mb-12 transform -rotate-2">
            <div className="flex items-center gap-3 mb-4">
               <img src="/logo.png" alt="Logo" className="w-4 h-4 rounded-md object-cover" />
               <p className="font-bold text-slate-800">Advanced AI Detection</p>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Unlock the power of intelligent threat detection through our AI models. Catch the scams that bypass standard corporate spam filters instantly.
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
            One Click Away from <br/>
            Enterprise-Grade Security
          </h1>
        </div>
        
        <div className="relative z-10 mt-auto text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} Phishing Inspector. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE (Auth Form) */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-8 md:p-24 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            {isLogin ? 'Log in to view your threat analysis.' : 'You are a few moments away from getting started!'}
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 font-medium transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="**********"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 font-medium transition-all"
                required
              />
            </div>

            <div className="text-xs text-slate-500 font-medium leading-relaxed mt-2 mb-2">
              By continuing, you accept Phishing Inspector's <a href="#" className="font-bold text-slate-800 hover:underline">privacy policy</a> and <a href="#" className="font-bold text-slate-800 hover:underline">terms of service</a>.
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#F1651A] hover:bg-[#d95a16] text-white font-bold text-lg px-4 py-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(241,101,26,0.25)] flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
            
            <div className="relative flex items-center py-4">
               <div className="flex-grow border-t border-slate-200"></div>
               <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or</span>
               <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
              type="button" 
              onClick={async () => {
                setLoading(true);
                await demoLogin();
                router.push('/dashboard');
              }}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold px-4 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all flex items-center justify-center gap-3"
            >
              Hackathon Demo Bypass
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }} 
              className="text-slate-900 font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
