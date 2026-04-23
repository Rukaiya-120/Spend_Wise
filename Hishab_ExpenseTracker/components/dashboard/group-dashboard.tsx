'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Wallet, CreditCard, ChevronRight, Settings, Plus, Info, Copy, Check, X } from 'lucide-react';
import { storageDB } from '@/lib/storage';
import { cn } from '@/lib/utils';

export function GroupDashboard() {
  const { user, currency, activeGroup, setActiveGroup, refreshCount } = useApp();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [newBudget, setNewBudget] = useState(activeGroup?.budget || 0);
  const [copied, setCopied] = useState(false);

  const isAdmin = activeGroup?.adminId === user?.uid;

  const expenses = React.useMemo(() => {
    if (!activeGroup || !user) return [];
    return storageDB.expenses.list({
      groupId: activeGroup.id,
      type: 'group'
    });
  }, [activeGroup, user, refreshCount]);

  const handleUpdateBudget = async () => {
    if (!isAdmin) return;
    try {
      storageDB.groups.update(activeGroup.id, {
        budget: Number(newBudget)
      });
      setActiveGroup({ ...activeGroup, budget: Number(newBudget) });
      setIsEditingBudget(false);
    } catch (err) {
      console.error(err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activeGroup.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">{activeGroup.name}</h1>
          <button 
            onClick={() => setShowCode(true)}
            className="flex items-center gap-2 mt-1 px-4 py-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-all shadow-sm"
          >
            <span>View Group Code</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <img 
              key={i}
              src={`https://picsum.photos/seed/${activeGroup.id + i}/32/32`} 
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" 
              alt="member" 
            />
          ))}
        </div>
      </div>

      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-100 dark:shadow-emerald-900/10 overflow-hidden relative"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100">Collective Balance</span>
            {isAdmin && (
              <button onClick={() => setIsEditingBudget(true)} className="bg-white/20 p-2 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="space-y-1 text-center py-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {totalSpent.toLocaleString()} <span className="text-xl font-medium text-emerald-200 not-italic opacity-50 uppercase tracking-widest">{currency}</span>
            </h1>
            <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-[0.3em]">
              Limit: {activeGroup.budget?.toLocaleString()} {currency}
            </p>
          </div>

          <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / (activeGroup.budget || 1)) * 100, 100)}%` }}
              className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-[100px] opacity-40" />
      </motion.div>

      {/* Activity List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black italic dark:text-white">Recent Transactions</h2>
        </div>

        <div className="space-y-3">
          {expenses.map((expense) => (
            <motion.div 
              key={expense.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between border border-gray-50 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all card-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center relative">
                   <img 
                    src={`https://picsum.photos/seed/${expense.userId}/48/48`} 
                    className="w-full h-full rounded-2xl object-cover" 
                    alt="user"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <p className="font-black italic text-sm tracking-tight dark:text-white uppercase">{expense.title || expense.category}</p>
                  <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <span className="uppercase tracking-widest text-emerald-600 font-black italic">{expense.userName || 'Member'}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-slate-700 rounded-full" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <p className="font-black italic text-sm dark:text-white">-{expense.amount.toLocaleString()} {currency}</p>
            </motion.div>
          ))}

          {expenses.length === 0 && (
            <div className="text-center py-20 px-8 space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
               <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300">
                 <Users className="w-10 h-10" />
               </div>
               <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">Awaiting first shared expense</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Modal */}
      <AnimatePresence>
        {showCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-sm space-y-8 text-center relative shadow-2xl"
            >
              <button onClick={() => setShowCode(false)} className="absolute top-6 right-6 p-2 bg-gray-50 dark:bg-slate-800 rounded-full">
                <X className="w-4 h-4 text-gray-400" />
              </button>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Invite Members</p>
                <h3 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Access Credentials</h3>
              </div>

              <div className="p-8 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 relative group">
                <span className="text-4xl font-black italic tracking-[0.2em] text-gray-900 dark:text-white select-all">
                  {activeGroup.code}
                </span>
                <button 
                  onClick={copyCode}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                >
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <p className="text-[10px] font-medium text-gray-400 dark:text-slate-500 leading-relaxed font-serif italic">
                Share this unique code with others to let them join your group and start tracking collective expenses.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Budget Modal */}
      <AnimatePresence>
        {isEditingBudget && isAdmin && (
            <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] w-full max-w-sm space-y-8 text-center shadow-2xl"
              >
                <div className="space-y-2">
                   <h3 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Set Group Goal</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none italic">Admin Restricted Setting</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-transparent focus-within:border-emerald-600 transition-all">
                    <span className="text-2xl font-black italic text-emerald-600">{currency}</span>
                    <input 
                      type="number" 
                      value={newBudget}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      className="w-full bg-transparent text-3xl font-black outline-none italic dark:text-white"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsEditingBudget(false)}
                    className="flex-1 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateBudget}
                    className="flex-1 h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    Confirm Plan
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
