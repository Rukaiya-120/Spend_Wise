'use client';

import React from 'react';
import { motion } from 'motion/react';
import { User, Users, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export function SelectionHub() {
  const { setContext, userProfile } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-12 selection:bg-emerald-100 selection:text-emerald-600 transition-colors">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Central Gateway</p>
        <h1 className="text-4xl font-black italic tracking-tight leading-none dark:text-white">Welcome back,</h1>
        <p className="text-emerald-600 text-3xl font-black italic">{userProfile?.displayName || 'User'}</p>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest leading-relaxed mt-4">
          Where would you like to track today?
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setContext('personal')}
          className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left"
        >
          <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black italic dark:text-white">Personal</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">Private Finances</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-100 dark:text-slate-800 group-hover:text-emerald-600 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setContext('group')}
          className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left"
        >
          <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
            <Users className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black italic dark:text-white">Group</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">Split with others</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-100 dark:text-slate-800 group-hover:text-emerald-600 transition-colors" />
        </motion.button>
      </div>
    </div>
  );
}
