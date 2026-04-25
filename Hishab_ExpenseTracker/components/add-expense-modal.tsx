'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Calendar, Tag, FileText, Loader2, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { expenseApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function AddExpenseModal() {
  const { context, currency, user, userProfile, activeGroup, triggerRefresh } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load categories when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, context, activeGroup]);

  const loadCategories = async () => {
    try {
      const params: any = {};
      if (context === 'group' && activeGroup?.id) {
        params.context_id = activeGroup.id;
      }
      const result = await expenseApi.getCategories(params);
      setCategories(result.map((cat: any) => cat.name));
      if (result.length > 0) {
        setCategory(result[0].name);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to default categories
      setCategories(['Transport', 'Food', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']);
      setCategory('Food');
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory(categories.length > 0 ? categories[0] : '');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowCategories(false);
  };

  const handleAddExpense = async () => {
    if (!amount || !user || !category) return;
    setLoading(true);
    try {
      const expenseData = {
        amount: Number(amount),
        category,
        note,
        date: new Date(date).toISOString(),
        context_id: context === 'group' ? activeGroup?.id : undefined,
      };

      await expenseApi.createExpense(expenseData);
      setIsOpen(false);
      resetForm();
      triggerRefresh();
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-6 z-40 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="fixed inset-0 z-[160] bg-black/40 backdrop-blur-sm px-4 flex items-end sm:items-center justify-center"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 relative overflow-visible"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black italic dark:text-white">New {context === 'personal' ? 'Personal' : 'Group'} Expense</h2>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Amount</label>
                    <div className="flex items-center gap-3 border-b-2 border-gray-100 dark:border-slate-800 focus-within:border-emerald-600 transition-colors pb-2">
                      <span className="text-2xl font-black text-gray-300 italic">{currency}</span>
                      <input 
                        type="text" 
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d*$/.test(val)) {
                            setAmount(val);
                          }
                        }}
                        className="text-4xl font-black w-full bg-transparent outline-none placeholder:text-gray-100 dark:text-white italic"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <button 
                        onClick={() => setShowCategories(!showCategories)}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all items-start flex-col"
                      >
                        <div className="flex items-center gap-2 text-gray-400">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold truncate dark:text-white">{category}</span>
                          <ChevronDown className={cn("w-4 h-4 text-gray-300 transition-transform", showCategories && "rotate-180")} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {showCategories && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-10 bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 overflow-hidden"
                          >
                            <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-none">
                              {categories.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    setCategory(cat);
                                    setShowCategories(false);
                                  }}
                                  className={cn(
                                    "w-full text-left p-3 rounded-xl text-xs font-bold transition-colors",
                                    category === cat ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
                                  )}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all items-start flex-col">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                      </div>
                      <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer dark:text-white dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Notes</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="text" 
                        placeholder="What was it for?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl pl-12 text-sm font-bold outline-none border border-transparent focus:border-gray-100 dark:focus:border-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={!amount || loading}
                    onClick={handleAddExpense}
                    className="w-full h-16 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/10 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Expense'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
