'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useApp } from '@/lib/app-context';

export function LandingNavbar() {
  const { user } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/landing" className="text-2xl font-black italic tracking-tighter dark:text-white">
          Hishab<span className="text-emerald-600">.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-emerald-600 transition-colors">Methodology</a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">Access</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link 
              href="/"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 dark:shadow-emerald-900/10 h-14 flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/auth"
                className="hidden sm:flex px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="px-8 py-4 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 dark:shadow-emerald-900/10 h-14 flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
