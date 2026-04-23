'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  Users, 
  LayoutGrid, 
  ChevronDown, 
  Moon, 
  Sun,
  User,
  LogOut
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dash', href: '/' },
  { icon: Receipt, label: 'Expenses', href: '/expenses' },
  { icon: PieChart, label: 'Budgets', href: '/budgets' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function TopNav() {
  const pathname = usePathname();
  const { context, setContext, signOut, theme, toggleTheme, userProfile } = useApp();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass h-20 px-6 flex items-center justify-between shadow-sm">
      {/* Brand & Context Switcher */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">H</span>
          </div>
          <span className="hidden sm:inline dark:text-white">Hishab.</span>
        </Link>

        {context !== 'none' && (
          <div className="relative">
            <button 
              onClick={() => setIsContextOpen(!isContextOpen)}
              className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-50 dark:border-emerald-900/30"
            >
              {context === 'personal' ? <LayoutGrid className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
              <span>{context}</span>
              <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", isContextOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isContextOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsContextOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-xl z-20 p-2"
                  >
                    <button
                      onClick={() => { setContext('personal'); setIsContextOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors",
                        context === 'personal' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                      )}
                    >
                      <LayoutGrid className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Personal</span>
                    </button>
                    <button
                      onClick={() => { setContext('group'); setIsContextOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors",
                        context === 'group' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                      )}
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Group</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Nav Links */}
      {context !== 'none' && (
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-gray-100 dark:border-slate-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm shadow-emerald-100/10" 
                    : "text-gray-400 hover:text-emerald-600"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border border-gray-100 dark:border-slate-800"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-emerald-400" />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent hover:ring-emerald-100 dark:hover:ring-emerald-900 transition-all flex items-center justify-center"
          >
             <User className="w-5 h-5 text-gray-400" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-2xl z-20 p-2"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                       <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-black truncate dark:text-white">{userProfile?.displayName || 'Member'}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Premium</p>
                    </div>
                  </div>
                  
                  {/* Mobile Nav Links */}
                  <div className="lg:hidden p-2 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsProfileOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-4 p-3 rounded-xl transition-colors",
                          pathname === item.href ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-50 dark:border-slate-800">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
