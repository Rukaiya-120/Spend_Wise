'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import {
  TrendingUp,
  AlertCircle,
  Plus,
  ChevronRight,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { expenseApi } from '@/lib/api';
import { budgetApi } from '@/lib/budget-api';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function BudgetsPage() {
  const { currency, user, userProfile, context, activeGroup, refreshCount } = useApp();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudgets([]);
      return;
    }

    const loadBudgetData = async () => {
      setLoading(true);

      try {
        const params =
          context === 'group' && activeGroup?.id
            ? { context_id: activeGroup.id }
            : {};

        const [expenseResponse, budgetResponse] = await Promise.all([
          expenseApi.getExpenses(params),
          budgetApi.getBudgets(params),
        ]);

        const expenseList = Array.isArray(expenseResponse)
          ? expenseResponse
          : expenseResponse?.data || expenseResponse?.expenses || expenseResponse?.data?.data || [];

        const budgetList = Array.isArray(budgetResponse)
          ? budgetResponse
          : budgetResponse?.data || budgetResponse?.budgets || budgetResponse?.data?.data || [];

        setExpenses(
          expenseList.map((expense: any) => ({
            ...expense,
            amount: Number(expense.amount || 0),
            category: expense.category_name || expense.category || 'Other',
          }))
        );

        setBudgets(budgetList);
      } catch (error) {
        console.error('Failed to load budget analytics:', error);
        setExpenses([]);
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [user, context, activeGroup?.id, refreshCount]);

  const totalBudget = useMemo(() => {
    const apiBudgetTotal = budgets.reduce((sum, budget) => {
      return sum + Number(budget.amount || budget.limit || 0);
    }, 0);

    if (apiBudgetTotal > 0) return apiBudgetTotal;

    return context === 'personal'
      ? userProfile?.personalBudget || 0
      : activeGroup?.budget || 0;
  }, [budgets, context, userProfile?.personalBudget, activeGroup?.budget]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }, [expenses]);

  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const pieData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: Math.max(0, totalBudget - totalSpent) },
  ];

  const COLORS = ['#10b981', '#f1f5f9'];
  const DARK_COLORS = ['#10b981', '#1e293b'];

  const categoriesBase = [
    'Transport',
    'Food',
    'Bills',
    'Entertainment',
    'Shopping',
    'Health',
    'Other',
  ];

  const categoryData = categoriesBase
    .map((category) => {
      const spent = expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

      const categoryBudget = budgets.find((budget) => {
        return (budget.category_name || budget.category) === category;
      });

      const fallbackTarget = totalBudget > 0 ? totalBudget / categoriesBase.length : spent;
      const target = Number(categoryBudget?.amount || categoryBudget?.limit || fallbackTarget || 0);

      return {
        category,
        spent,
        total: Math.max(target, spent),
        color:
          category === 'Food'
            ? 'bg-orange-500'
            : category === 'Transport'
              ? 'bg-blue-500'
              : 'bg-emerald-600',
      };
    })
    .filter((category) => category.spent > 0 || category.total > 0);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 bg-[var(--background)]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">
          Budget analytics
        </h1>
        <button className="bg-emerald-600 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/10 text-white p-3 rounded-2xl active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {loading && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">
            Loading budget analytics...
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center space-y-8"
      >
        <div className="w-full flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 leading-none italic">
              Distribution
            </p>
            <h2 className="text-xl font-black italic dark:text-white uppercase tracking-tight">
              Capital status
            </h2>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-[1.5rem]">
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="relative w-full h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? COLORS[0]
                        : typeof document !== 'undefined' &&
                            document.documentElement.classList.contains('dark')
                          ? DARK_COLORS[1]
                          : COLORS[1]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '24px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  background: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black dark:text-white italic tracking-tighter">
              {percentSpent.toFixed(0)}
              <span className="text-sm not-italic">%</span>
            </span>
            <span className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.3em] mt-1 italic">
              Utilized
            </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 italic">
              Total Allowance
            </p>
            <p className="text-base font-black dark:text-white italic">
              {totalBudget.toLocaleString()}{' '}
              <span className="text-[10px] not-italic opacity-50 uppercase tracking-widest">
                {currency}
              </span>
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/10 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 space-y-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400 italic">
              Liquid Surplus
            </p>
            <p className="text-base font-black text-emerald-600 italic">
              {(totalBudget - totalSpent).toLocaleString()}{' '}
              <span className="text-[10px] not-italic opacity-50 uppercase tracking-widest">
                {currency}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black italic dark:text-white uppercase tracking-[0.4em] px-2 flex items-center gap-3">
          <span className="shrink-0 text-emerald-600">Category breakdown</span>
          <div className="h-[1px] w-full bg-gray-100 dark:bg-slate-800" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryData.map((budget, idx) => {
            const currentPercent = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-slate-800 space-y-5"
              >
                <div className="flex items-center justify-between leading-none">
                  <div className="space-y-1.5">
                    <p className="text-sm font-black italic dark:text-white uppercase tracking-tight">
                      {budget.category}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest italic">
                      {budget.spent.toLocaleString()}{' '}
                      <span className="opacity-40">/</span>{' '}
                      {budget.total.toLocaleString()} {currency}
                    </p>
                  </div>

                  {currentPercent > 90 && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl animate-pulse">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="h-4 bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(currentPercent, 100)}%` }}
                    className={cn(
                      'h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]',
                      budget.color
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-600 dark:bg-emerald-950 p-8 rounded-[3rem] shadow-2xl shadow-emerald-100 dark:shadow-emerald-950/30 flex items-start gap-6 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="bg-white/20 backdrop-blur-md p-4 rounded-[1.5rem] shadow-inner text-white shrink-0">
          <TrendingUp className="w-8 h-8" />
        </div>

        <div className="space-y-2 flex-1 pt-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 italic leading-none">
            Capital Insight
          </p>
          <p className="text-base font-bold text-white leading-tight font-serif italic">
            Your budget analytics are now calculated from live backend expense and budget records.
          </p>
        </div>

        <ChevronRight className="text-emerald-300 w-6 h-6 mt-6 animate-bounce-x" />
      </motion.div>
    </div>
  );
}