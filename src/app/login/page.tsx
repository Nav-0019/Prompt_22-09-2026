"use client";

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, signup } from './actions';

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

            <button type="button" className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-4 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              Continue with Google
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
