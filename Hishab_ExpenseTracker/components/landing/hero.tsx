'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/20 dark:bg-emerald-900/10 rounded-full blur-[100px] -ml-32 -mb-32" />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-full">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Beta Version 1.0.4 Now Live</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[112px] font-black tracking-[-0.04em] leading-[0.88] italic dark:text-white">
              Financial <br />
              <span className="text-emerald-600">Clarity.</span>
            </h1>
            
            <p className="max-w-md text-lg font-medium text-gray-500 leading-relaxed font-serif italic">
              A minimalist, mobile-first ecosystem for personal tracking and group splitting. Built for those who value precision over noise.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link 
              href="/auth"
              className="w-full sm:w-auto h-20 px-12 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/10 hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              Start Tracking <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-slate-900 transition-colors">
                <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Watch Demo</span>
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-8 pt-8 border-t border-gray-100"
          >
            {[
              { label: 'Users', val: '12k+' },
              { label: 'Tracked', val: '$4.2M' },
              { label: 'Groups', val: '2.5k' }
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-black italic">{stat.val}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-slate-800 aspect-[4/5] max-w-sm mx-auto overflow-hidden group"
          >
            {/* Mock Interface */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg animate-pulse" />
                </div>
                <div className="w-32 h-4 bg-gray-50 dark:bg-slate-800 rounded-full" />
              </div>
              
              <div className="space-y-4">
                <div className="w-full h-48 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                   <div className="relative z-10 text-center">
                      <p className="text-3xl font-black italic dark:text-white">BDT 42,500</p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Monthly Limit Reached</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-24 bg-gray-50 dark:bg-slate-800 rounded-3xl" />
                   <div className="h-24 bg-emerald-600 rounded-3xl" />
                </div>
              </div>

              <div className="space-y-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-12 w-full bg-white border border-gray-100 rounded-2xl flex items-center px-4 justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 bg-gray-100 rounded-full" />
                         <div className="w-20 h-2 bg-gray-100 rounded-full" />
                      </div>
                      <div className="w-12 h-2 bg-red-100 rounded-full" />
                   </div>
                 ))}
              </div>
            </div>
          </motion.div>

          {/* Floating elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-600 rounded-full border-[6px] border-white dark:border-slate-900 shadow-2xl flex items-center justify-center rotate-[-12deg] z-20">
             <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-100 dark:bg-emerald-950/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute top-20 -left-40 w-60 h-60 bg-emerald-50 dark:bg-emerald-950/10 rounded-full blur-[80px] -z-10" />
        </div>
      </div>

      {/* Vertical Rail Text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="writing-vertical-rl rotate-180 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">
          <span>Secure Architecture</span>
          <div className="w-px h-20 bg-gray-100" />
          <span>Local Persistence</span>
          <div className="w-px h-20 bg-gray-100" />
          <span>Cross Contextual Tracking</span>
        </div>
      </div>
    </section>
  );
}
