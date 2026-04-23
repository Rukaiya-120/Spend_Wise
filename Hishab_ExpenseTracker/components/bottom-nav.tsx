'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, PieChart, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dash', href: '/' },
  { icon: Receipt, label: 'Expenses', href: '/expenses' },
  { icon: PieChart, label: 'Budgets', href: '/budgets' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors",
                isActive ? "text-emerald-600" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-emerald-600/10")} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1 scale-90">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full" 
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
