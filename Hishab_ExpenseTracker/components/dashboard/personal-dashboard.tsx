'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import {
  Wallet, TrendingUp, CreditCard, ChevronRight,
  Target, Plus, Settings, Loader2
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { expenseApi } from '@/lib/expense-api';
import { balanceApi } from '@/lib/balance-api';
import { budgetApi } from '@/lib/budget-api';
import { contextApi } from '@/lib/context-api';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
}

interface Budget {
  id: string;
  amount: number;
  month?: number;
  year?: number;
  context_id?: string;
}

export function PersonalDashboard() {
  const { user, currency, refreshCount, personalContextId, setPersonalContextId } = useApp();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [balanceSummary, setBalanceSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [error, setError] = useState('');

  const personalBudget = budgets[0] ?? null;
  const personalBudgetAmount = Number(personalBudget?.amount ?? 0);

  useEffect(() => {
    setNewBudget(personalBudgetAmount);
  }, [personalBudgetAmount]);

  // Step 1: Resolve personal context_id (cached in global state to avoid re-fetching)
  const resolvePersonalContextId = useCallback(async (): Promise<string | null> => {
    if (personalContextId) return personalContextId;

    try {
      const contexts = await contextApi.getContexts();
      const ctxArray: any[] = Array.isArray(contexts) ? contexts : [];

      // Try to find the personal context for the current user
      const userId = user?.uid;
      const personal =
        ctxArray.find((c: any) => c.type === 'personal' && String(c.owner_id) === String(userId)) ??
        ctxArray.find((c: any) => c.type === 'personal') ??
        ctxArray[0] ??
        null;

      const id = personal?.id ? String(personal.id) : null;
      if (id) setPersonalContextId(id);
      return id;
    } catch (err) {
      console.error('Failed to resolve personal context:', err);
      return null;
    }
  }, [personalContextId, user?.uid, setPersonalContextId]);

  // Step 2: Load all dashboard data using the resolved context_id
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const ctxId = await resolvePersonalContextId();

      if (!ctxId) {
        setError('Could not find your personal context. Please log out and back in.');
        return;
      }

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const [expensesRes, budgetsRes, balanceRes] = await Promise.all([
        expenseApi.getExpenses({ context_id: ctxId }),
        budgetApi.getBudgets({ context_id: ctxId, month, year }),
        balanceApi.getSummary({ context_id: ctxId }),
      ]);

      setExpenses(
        expensesRes.map((e: any) => ({
          ...e,
          amount: Number(e.amount ?? 0),
          category: e.category_name ?? e.category ?? 'Other',
          date: e.date ?? e.expense_date ?? e.created_at,
        }))
      );
      setBudgets(budgetsRes);
      setBalanceSummary(balanceRes);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err.response?.data ?? err);
      setError('Failed to load data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, [resolvePersonalContextId]);

  useEffect(() => {
    loadData();
  }, [refreshCount]);

  const handleUpdateBudget = async () => {
    setBudgetLoading(true);
    try {
      const ctxId = await resolvePersonalContextId();
      if (!ctxId) {
        alert('No personal context found. Please log out and back in.');
        return;
      }

      const now = new Date();
      const payload = {
        context_id: ctxId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: Number(newBudget),
      };

      if (personalBudget?.id) {
        await budgetApi.updateBudget(String(personalBudget.id), payload);
      } else {
        await budgetApi.createBudget(payload);
      }

      setIsEditingBudget(false);
      await loadData();
    } catch (err: any) {
      console.error('Failed to update budget:', err.response?.data ?? err);
    } finally {
      setBudgetLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const hasData = expenses.length > 0 || budgets.length > 0;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-500 font-black text-sm uppercase tracking-widest text-center">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-3 bg-emerald-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <Wallet className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Ready to start?</h2>
          <p className="text-gray-400 text-sm font-medium italic">Set your budget goal and log your first expense.</p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={() => setIsEditingBudget(true)}
            className="w-full h-16 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] text-emerald-600 hover:border-emerald-100 transition-all active:scale-95"
          >
            <Target className="w-5 h-5" /> Set Monthly Budget
          </button>
          <button
            onClick={() => setIsEditingBudget(true)}
            className="w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
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
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="flex-1 h-14 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBudget}
                  disabled={budgetLoading}
                  className="flex-1 h-14 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-60 flex items-center justify-center"
                >
                  {budgetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Tracking'}
                </button>
              </div>
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
            <button
              onClick={() => setIsEditingBudget(true)}
              className="bg-white/20 p-2 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 text-center py-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {totalSpent.toLocaleString()}{' '}
              <span className="text-xl font-medium text-emerald-200 not-italic opacity-50 uppercase tracking-widest">
                {currency}
              </span>
            </h1>
            <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-[0.3em]">
              Goal: {personalBudgetAmount.toLocaleString()} {currency}
            </p>
          </div>

          <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalSpent / (personalBudgetAmount || 1)) * 100, 100)}%`,
              }}
              className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>
        <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-[100px] opacity-40" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-gray-50 dark:border-slate-800"
        >
          <h2 className="text-lg font-black italic dark:text-white mb-6 uppercase tracking-tight">Recent Burn</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenses.slice(0, 7).reverse()}>
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fontWeight: 900 }}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '24px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontWeight: 900,
                    fontSize: '10px',
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                  {expenses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[2.5rem] flex flex-col justify-between">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
              <p className="text-xl font-black italic dark:text-white">{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-between">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expenses</p>
              <p className="text-xl font-black italic dark:text-white">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black italic dark:text-white uppercase tracking-tight">Recent History</h2>
          <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between border border-gray-50 dark:border-slate-800 hover:border-emerald-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black italic text-sm dark:text-white uppercase tracking-tight">
                    {expense.category}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="font-black italic text-sm dark:text-white">
                -{expense.amount.toLocaleString()} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditingBudget && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-sm space-y-8 text-center shadow-2xl"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">Edit Goal</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                Manage your financial limits
              </p>
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
                className="flex-1 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBudget}
                disabled={budgetLoading}
                className="flex-1 h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-60 flex items-center justify-center"
              >
                {budgetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}