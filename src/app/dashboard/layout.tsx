"use client";

import React, { useState } from 'react';
import { Search, Settings, Bell, Home, Shield, BookOpen, Moon, Sun, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/login/actions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    const nextState = !isNightMode;
    setIsNightMode(nextState);
    if (nextState) {
      document.documentElement.classList.add('night-mode');
    } else {
      document.documentElement.classList.remove('night-mode');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Scanner', href: '/scan', icon: Shield },
    { name: 'Education Hub', href: '/scams', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans flex flex-col text-slate-900 relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      {/* FLOATING TOP NAV */}
      <header className="relative z-30 pt-6 px-6 max-w-7xl w-full mx-auto">
        <div className="bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 flex items-center justify-between px-6 py-3">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md object-cover" />
          </Link>

          {/* Centered Pill Navigation */}
          <nav className="hidden md:flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 relative">
            
            {/* Settings Button */}
            <div className="relative">
              <button 
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowProfile(false); }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute top-full mt-4 right-0 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-slate-100 bg-white/50">
                    <h3 className="font-bold text-slate-800">Settings</h3>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={toggleNightMode}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        {isNightMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{isNightMode ? 'Light Mode' : 'Night Mode'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Toggle app theme</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); setShowProfile(false); }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#F1651A] rounded-full border-2 border-white"></span>
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-full mt-4 right-0 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <button className="text-xs font-medium text-[#F1651A] hover:text-[#d95a16]">Mark all as read</button>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">New phishing attempt blocked</p>
                        <p className="text-xs text-slate-500 mt-0.5">12 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button */}
            <div className="relative ml-2">
              <button 
                onClick={() => { setShowProfile(!showProfile); setShowSettings(false); setShowNotifications(false); }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F1651A] to-orange-300 shadow-sm border-2 border-white cursor-pointer"
              ></button>
              
              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute top-full mt-4 right-0 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-slate-100 bg-white/50">
                    <h3 className="font-bold text-slate-800">Security Admin</h3>
                    <p className="text-xs text-slate-500">admin@phishinginspector.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-800">My Profile</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left p-3 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-3 mt-1"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <LogOut className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-sm font-medium text-rose-600">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
