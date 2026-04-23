'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="pt-32 pb-20 px-6 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-24">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/landing" className="text-3xl font-black italic tracking-tighter dark:text-white">
              Hishab<span className="text-emerald-600">.</span>
            </Link>
            <p className="max-w-sm text-lg font-medium text-gray-500 font-serif italic dark:text-slate-400">
              Empowering financial sovereignty through thoughtful design and secure local architectures.
            </p>
            <div className="flex items-center gap-6">
               <Github className="w-5 h-5 text-gray-400 dark:text-slate-600 hover:text-emerald-600 cursor-pointer" />
               <Twitter className="w-5 h-5 text-gray-400 dark:text-slate-600 hover:text-emerald-600 cursor-pointer" />
               <Instagram className="w-5 h-5 text-gray-400 dark:text-slate-600 hover:text-emerald-600 cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-slate-600">Navigation</p>
            <div className="flex flex-col gap-4 text-sm font-bold dark:text-white">
               <a href="#" className="hover:text-emerald-600 transition-colors">Personal Hub</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">Group Wallets</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">Smart Budgets</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">History</a>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-slate-600">Resources</p>
            <div className="flex flex-col gap-4 text-sm font-bold dark:text-white">
               <a href="#" className="hover:text-emerald-600 transition-colors">System Support</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Use</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-emerald-600 transition-colors">API Access</a>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-gray-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest italic">
            © 2026 Hishab Tracker • Crafted in Dhaka • Built with AI Build
          </p>
          
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            System Status: Fully Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
