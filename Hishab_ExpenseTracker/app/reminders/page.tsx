'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import { Bell, Clock, Calendar, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const reminders = [
  { id: 1, title: 'Pay Electricity Bill', date: 'Tomorrow, 5:00 PM', category: 'Group', priority: 'High' },
  { id: 2, title: 'Settlement with Tanvir', date: 'Sat, 24 Apr', category: 'Group', priority: 'Medium' },
  { id: 3, title: 'Review Subscription Fees', date: '28 Apr, 10:00 AM', category: 'Personal', priority: 'Low' },
  { id: 4, title: 'Grocery Run', date: 'Sunday, 11:00 AM', category: 'Personal', priority: 'Medium' },
];

export default function RemindersPage() {
  const { context } = useApp();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tight dark:text-white uppercase italic">Reminders</h1>
        <button className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Categories Toggle */}
      <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl flex card-shadow border border-gray-100 dark:border-slate-800 transition-colors">
        <button className="flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-none transition-all">
          Upcoming Epochs
        </button>
        <button className="flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all italic">
          Archived Data
        </button>
      </div>

      <div className="space-y-4 pt-2">
        {reminders.map((reminder, idx) => (
          <motion.div 
            key={reminder.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] card-shadow border border-gray-100 dark:border-slate-800 flex items-start justify-between relative overflow-hidden transition-all hover:translate-y-[-2px] hover:border-emerald-100 dark:hover:border-emerald-900/50"
          >
            {/* Priority Indicator */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1.5",
              reminder.priority === 'High' ? "bg-red-500" :
              reminder.priority === 'Medium' ? "bg-amber-500" : "bg-gray-300 dark:bg-slate-700"
            )} />

            <div className="flex gap-4">
              <div className="mt-1">
                <button className="w-6 h-6 rounded-lg border-2 border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:border-emerald-600 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="font-black italic text-sm tracking-tight dark:text-white uppercase">{reminder.title}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{reminder.date}</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full italic",
                    reminder.category === 'Group' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
                  )}>
                     <span className="scale-75 origin-left">{reminder.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="p-2 -mr-2 text-gray-300 dark:text-slate-700 hover:text-gray-600 dark:hover:text-slate-400 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State Illustration / Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50/50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4 transition-colors"
      >
        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 dark:border-slate-700">
          <Bell className="w-6 h-6 text-emerald-600/50" />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Omniscient Persistence</p>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 max-w-[240px] mx-auto leading-relaxed font-serif">
            The system will automatically trigger notifications 24 hours prior to recurring payments.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
