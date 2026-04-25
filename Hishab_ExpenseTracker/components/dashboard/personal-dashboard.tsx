'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, CreditCard, ChevronRight, Target, Plus, Settings } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { expenseApi, balanceApi } from '@/lib/api';
import { budgetApi } from '@/lib/budget-api';
import { cn } from '@/lib/utils';
import { contextApi } from '@/lib/context-api';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  context_id?: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  category?: string;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
}

export function PersonalDashboard() {
const { user, currency, userProfile, setUserProfile, refreshCount } = useApp();

const [isEditingBudget, setIsEditingBudget] = useState(false);
const [newBudget, setNewBudget] = useState(0);
const [expenses, setExpenses] = useState<Expense[]>([]);
const [budgets, setBudgets] = useState<Budget[]>([]);
const [balanceSummary, setBalanceSummary] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [personalContextId, setPersonalContextId] = useState<string | null>(null);
const personalBudget = budgets[0];
const personalBudgetAmount = Number(
  personalBudget?.amount || userProfile?.personalBudget || 0
);

useEffect(() => {
  setNewBudget(personalBudgetAmount);
}, [personalBudgetAmount]);

  useEffect(() => {
    loadData();
  }, [refreshCount]);


const loadData = async () => {
  try {
    setLoading(true);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [expensesRes, contextsRes, balanceRes] = await Promise.all([
      expenseApi.getExpenses(),
      contextApi.getContexts(),
      balanceApi.getSummary(),
    ]);

    console.log('Contexts response:', contextsRes);

    const contexts =
      Array.isArray(contextsRes)
        ? contextsRes
        : Array.isArray(contextsRes?.data)
          ? contextsRes.data
          : Array.isArray(contextsRes?.contexts)
            ? contextsRes.contexts
            : Array.isArray(contextsRes?.data?.contexts)
              ? contextsRes.data.contexts
              : [
                  contextsRes?.personal,
                  contextsRes?.personal_context,
                  contextsRes?.data?.personal,
                  contextsRes?.data?.personal_context,
                  ...(contextsRes?.groups || []),
                  ...(contextsRes?.data?.groups || []),
                ].filter(Boolean);

    const currentUserId = user?.id || user?.uid;

    const personalContext =
      contexts.find((ctx: any) => {
        return ctx.type === 'personal' && ctx.owner_id === currentUserId;
      }) ||
      contexts.find((ctx: any) => {
        return ctx.type === 'personal';
      });

    const contextId = personalContext?.id || null;

    console.log('Selected personal context id:', contextId);

    setPersonalContextId(contextId);

    const budgetsRes = contextId
      ? await budgetApi.getBudgets({
          context_id: contextId,
          month,
          year,
        })
      : [];

    const expenseList = Array.isArray(expensesRes)
      ? expensesRes
      : expensesRes?.data || expensesRes?.expenses || expensesRes?.data?.data || [];

    const budgetList = Array.isArray(budgetsRes)
      ? budgetsRes
      : budgetsRes?.data || budgetsRes?.budgets || budgetsRes?.data?.data || [];

    setExpenses(
      expenseList.map((expense: any) => ({
        ...expense,
        amount: Number(expense.amount || 0),
        category: expense.category_name || expense.category || 'Other',
      }))
    );

    setBudgets(budgetList);
    setBalanceSummary(balanceRes);
  } catch (error: any) {
    console.error('Failed to load dashboard data:', error.response?.data || error);
  } finally {
    setLoading(false);
  }
};

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const hasDetails = expenses.length > 0 || budgets.length > 0;


  const handleUpdateBudget = async () => {
  try {
    let contextId = personalContextId;

    if (!contextId) {
      await loadData();
      contextId = personalContextId;
    }

    if (!contextId) {
      alert('No personal context found. Please refresh or log in again.');
      return;
    }

    const now = new Date();

    const payload = {
      context_id: contextId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: Number(newBudget),
    };

    console.log('Budget payload:', payload);

    if (personalBudget?.id) {
      await budgetApi.updateBudget(personalBudget.id, payload);
    } else {
      await budgetApi.createBudget(payload);
    }

    setIsEditingBudget(false);
    await loadData();
  } catch (err: any) {
    console.error('Failed to update budget:', err.response?.data || err);
  }
};
  if (!hasDetails) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
            <Wallet className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Ready to start?</h2>
          <p className="text-gray-400 dark:text-slate-400 text-sm font-medium italic font-serif">Set your goals and track your first expense.</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button 
            onClick={() => setIsEditingBudget(true)}
            className="w-full h-16 bg-white dark:bg-slate-900 rounded-[2rem] card-shadow border border-gray-100 dark:border-slate-800 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] text-emerald-600 hover:border-emerald-100 transition-all active:scale-95"
          >
            <Target className="w-5 h-5" /> Set Monthly Budget
          </button>
          <button className="w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
            <Plus className="w-5 h-5" /> Add First Expense
          </button>
        </div>

        {isEditingBudget && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] w-full max-w-sm space-y-8 text-center shadow-2xl"
            >
              <h3 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">Monthly Budget</h3>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-6 rounded-[2rem]">
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
              <button 
                onClick={handleUpdateBudget}
                className="w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-200 active:scale-95 transition-all"
              >
                Start Tracking
              </button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
       {/* Hero Card */}
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-100 dark:shadow-emerald-900/10 overflow-hidden relative"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100">Monthly Burn Rate</span>
            <button onClick={() => setIsEditingBudget(true)} className="bg-white/20 p-2 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-1 text-center py-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {totalSpent.toLocaleString()} <span className="text-xl font-medium text-emerald-200 not-italic opacity-50 uppercase tracking-widest">{currency}</span>
            </h1>
            <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-[0.3em]">
              Goal: {personalBudgetAmount.toLocaleString()} {currency}
            </p>
          </div>

          <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / (personalBudgetAmount || 1)) * 100, 100)}%` }}              className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-[100px] opacity-40" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Analytics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 card-shadow border border-gray-50 dark:border-slate-800"
        >
          <h2 className="text-lg font-black italic dark:text-white mb-6 uppercase tracking-tight">Recent Burn</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenses.slice(0, 7).reverse()}>
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }} 
                />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                  {expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#e2e8f0'} className="dark:fill-slate-800" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[2.5rem] flex flex-col justify-between">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
               <p className="text-xl font-black italic dark:text-white uppercase tracking-tight">{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-between">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expenses</p>
               <p className="text-xl font-black italic dark:text-white uppercase tracking-tight">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black italic dark:text-white uppercase tracking-tight">Recent History</h2>
          <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense) => (
            <div 
              key={expense.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between border border-gray-50 dark:border-slate-800 hover:border-emerald-50 transition-all card-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black italic text-sm dark:text-white uppercase tracking-tight">{expense.category}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="font-black italic text-sm dark:text-white uppercase last:text-red-500">-{expense.amount.toLocaleString()} {currency}</p>
            </div>
          ))}
        </div>
      </div>

      {isEditingBudget && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-sm space-y-8 text-center shadow-2xl"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Edit Goal</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none italic">Manage your financial limits</p>
              </div>

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
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}
