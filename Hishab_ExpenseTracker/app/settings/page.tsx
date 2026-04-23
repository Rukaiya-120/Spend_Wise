'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import { User, Bell, Shield, CreditCard, ChevronRight, Globe, LogOut, Banknote, Moon, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { context, currency, setCurrency, signOut, userProfile, theme, toggleTheme, setShowTutorial } = useApp();
  const [showCurrencySelect, setShowCurrencySelect] = React.useState(false);

  const currencies = [
    { code: 'BDT', label: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  ];

  const sections = [
    {
      title: 'Profile Information',
      items: [
        { icon: User, label: 'Legal Identity', value: userProfile?.displayName || 'User Admin' },
        { 
          icon: Globe, 
          label: 'Default Matrix', 
          value: currency, 
          onClick: () => setShowCurrencySelect(true) 
        },
        { icon: Banknote, label: 'Payout Channels', value: 'Active Gateway' },
      ]
    },
    {
      title: 'Digital Paradigm',
      items: [
        { icon: HelpCircle, label: 'Re-initialize Tutorial', value: 'System Guide', onClick: () => setShowTutorial(true) },
        { icon: Bell, label: 'System Alarms', value: 'Prioritized' },
        { icon: Moon, label: 'Void Mode', value: theme === 'dark' ? 'Active' : 'Neutral', onClick: toggleTheme },
        { icon: CreditCard, label: 'Interface Polish', value: 'Emerald' },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 transition-colors">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 italic">Control Console</p>
        <h1 className="text-3xl font-black italic tracking-tighter dark:text-white uppercase italic">System Prefs</h1>
      </div>

      {/* User Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] card-shadow border border-gray-100 dark:border-slate-800 flex items-center gap-6"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/10 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-2xl shadow-emerald-100 dark:shadow-none">
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.uid}`} 
               alt="profile" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
        </div>
        <div>
          <h2 className="text-xl font-black italic tracking-tight dark:text-white uppercase italic">{userProfile?.displayName || 'Operator'}</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1 leading-none italic">Authorized Admin</p>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 px-2 italic">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, iIdx) => (
                <motion.button 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={item.onClick}
                  transition={{ delay: (sIdx * 3 + iIdx) * 0.05 }}
                  className="w-full bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between card-shadow border border-gray-100 dark:border-slate-800 group hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black italic dark:text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-700 group-hover:text-emerald-300 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={signOut}
        className="w-full bg-red-50 dark:bg-red-950/10 text-red-600 p-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] italic flex items-center justify-center gap-3 border border-red-100 dark:border-red-900/20 transition-all"
      >
        <LogOut className="w-5 h-5" /> Terminate Session Instance
      </motion.button>

      {/* Currency Modal */}
      {showCurrencySelect && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-8 space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic dark:text-white uppercase italic">Financial Unit</h2>
              <button 
                onClick={() => setShowCurrencySelect(false)}
                className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-400 hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencySelect(false);
                  }}
                  className={cn(
                    "w-full p-5 rounded-2xl flex items-center justify-between font-black transition-all border-2",
                    currency === c.code 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100 dark:shadow-none" 
                      : "bg-gray-50 dark:bg-slate-800 border-transparent text-gray-400 dark:text-slate-500 hover:border-emerald-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl italic">{c.symbol}</span>
                    <span className="text-[10px] uppercase tracking-widest">{c.label}</span>
                  </div>
                  <span className="text-[10px] opacity-40 italic">{c.code}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <p className="text-center text-[10px] font-black text-gray-300 dark:text-slate-800 uppercase tracking-[0.5em] pt-8">
        Hishab v2.0.4 • Emerald OS • Quantum Built
      </p>
    </div>
  );
}
