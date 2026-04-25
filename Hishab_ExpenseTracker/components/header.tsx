'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { ChevronDown, Bell, User, LayoutGrid, Users, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function Header() {
  const { context, setContext, signOut, theme, toggleTheme, user } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-900 h-16 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setContext('none')} 
          className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="text-white font-black italic">H</span>
        </button>
        
        {context !== 'none' && (
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-50 dark:border-emerald-950/30"
            >
              {context === 'personal' ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Personal</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5" />
                  <span>Group</span>
                </>
              )}
              <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl z-20 p-2 overflow-hidden"
                  >
                    <button
                      onClick={() => { setContext('personal'); setIsOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors",
                        context === 'personal' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                      )}
                    >
                      <LayoutGrid className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Personal Hub</span>
                    </button>
                    <button
                      onClick={() => { setContext('group'); setIsOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors",
                        context === 'group' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                      )}
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Shared Wallets</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
        </button>
        
        <div className="h-6 w-px bg-gray-100 dark:bg-slate-800 mx-2" />

        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="group flex items-center gap-3 p-1 pl-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-900 transition-all"
          >
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">Operator</p>
              <p className="text-xs font-bold dark:text-white truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
              <User className="w-5 h-5" />
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl z-20 p-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-800 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authenticated as</p>
                    <p className="text-xs font-bold dark:text-white truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
