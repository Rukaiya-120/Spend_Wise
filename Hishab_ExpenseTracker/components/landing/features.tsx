'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Sparkles, Target, Users, Layout } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Layout,
      title: 'Contextual Tracking',
      desc: 'Seamlessly toggle between personal finances and shared group budgets with zero friction.',
    },
    {
      icon: Users,
      title: 'Group Dynamics',
      desc: 'Create shared wallets with unique join codes. Monitor who spent what and keep everyone in sync.',
    },
    {
      icon: Target,
      title: 'Intelligent Budgeting',
      desc: 'Set goals and visualize consumption trends through high-fidelity charts and automated alerts.',
    },
    {
      icon: Shield,
      title: 'Local Privacy',
      desc: 'Your data stays on your device. We prioritize security and speed through local persistence architecture.',
    },
    {
      icon: Zap,
      title: 'Real-time Refresh',
      desc: 'No more loading spinners. Every action updates your dashboard instantly for a fluid experience.',
    },
    {
      icon: Sparkles,
      title: 'Minimalist UX',
      desc: 'Designed with intent. No clutter, no ads, just the essentials for your financial mental model.',
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">The Methodology</p>
            <h2 className="text-5xl md:text-7xl font-black italic leading-[0.9] dark:text-white">
              Engineered for <br />
              <span className="text-gray-300 dark:text-slate-700">Absolute Simplicity.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium text-gray-400 uppercase tracking-widest leading-loose">
            We stripped away the complexity of traditional banking apps to give you a tool that actually works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 card-shadow hover:border-emerald-100 dark:hover:border-emerald-900 transition-all hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6 mb-8 shadow-sm group-hover:shadow-emerald-200 dark:group-hover:shadow-none">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black italic mb-4 dark:text-white">{feature.title}</h3>
              <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed font-serif italic text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
