'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/app-context';
import { motion } from 'motion/react';
import { Search, CreditCard, Download } from 'lucide-react';
import { expenseApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ExpensesPage() {
  const { context, currency, user, activeGroup, refreshCount } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }

    const loadExpenses = async () => {
      setLoading(true);

      try {
        const params =
          context === 'group' && activeGroup?.id
            ? { context_id: activeGroup.id }
            : {};

        const response = await expenseApi.getExpenses(params);

        const list = Array.isArray(response)
          ? response
          : response?.data || response?.expenses || response?.data?.data || [];

        setExpenses(
          list.map((expense: any) => ({
            ...expense,
            amount: Number(expense.amount || 0),
            category: expense.category_name || expense.category || 'Other',
            note: expense.note || expense.description || expense.category || 'Expense',
            date: expense.date || expense.expense_date || expense.created_at,
            type: expense.type || expense.context_type || context,
          }))
        );
      } catch (error) {
        console.error('Failed to load expenses:', error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user, context, activeGroup?.id, refreshCount]);

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return expenses.filter((expense) => {
      if (activeFilter !== 'All' && expense.category !== activeFilter) {
        return false;
      }

      if (!query) return true;

      return (
        expense.category?.toLowerCase().includes(query) ||
        expense.note?.toLowerCase().includes(query) ||
        String(expense.amount).includes(query)
      );
    });
  }, [expenses, activeFilter, searchQuery]);

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, any[]> = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date || Date.now());
      const monthYear = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(expense);
    });

    return Object.entries(groups).sort((a, b) => {
      return (
        new Date(b[1][0].date || Date.now()).getTime() -
        new Date(a[1][0].date || Date.now()).getTime()
      );
    });
  }, [filteredExpenses]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic dark:text-white uppercase tracking-tight">
          Expense history
        </h1>
        <button className="p-2.5 bg-white dark:bg-slate-900 rounded-2xl card-shadow border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-colors">
          <Download className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-[2rem] card-shadow border border-gray-50 dark:border-slate-800 focus-within:border-emerald-600 transition-all">
          <Search className="w-5 h-5 text-gray-300 dark:text-slate-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search records..."
            className="bg-transparent border-none outline-none text-sm w-full font-bold dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95',
                activeFilter === filter
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10'
                  : 'bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border border-gray-100 dark:border-slate-800'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">
              Loading expense records...
            </p>
          </div>
        ) : groupedExpenses.length > 0 ? (
          groupedExpenses.map(([month, monthExpenses]) => (
            <div key={month} className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-slate-600 px-2 flex items-center gap-3">
                <span className="shrink-0">{month}</span>
                <div className="h-[1px] w-full bg-gray-100 dark:bg-slate-800" />
              </h2>

              <div className="space-y-3">
                {monthExpenses.map((expense, idx) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between border border-gray-50 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all card-shadow"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6',
                          expense.category === 'Food'
                            ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-500'
                            : expense.category === 'Bills'
                              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'
                              : expense.category === 'Transport'
                                ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-500'
                                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'
                        )}
                      >
                        <CreditCard className="w-6 h-6" />
                      </div>

                      <div>
                        <p className="font-black italic text-sm dark:text-white uppercase tracking-tight">
                          {expense.note || expense.category}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="uppercase tracking-widest text-emerald-600 font-black italic">
                            {expense.category}
                          </span>
                          <span className="w-1 h-1 bg-gray-200 dark:bg-slate-800 rounded-full" />
                          <span>{new Date(expense.date || Date.now()).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-black italic text-sm dark:text-white uppercase tracking-tight">
                        -{expense.amount.toLocaleString()} {currency}
                      </p>

                      <div className="flex items-center justify-end gap-1.5 mt-1 border border-gray-100 dark:border-slate-800 rounded-full px-2 py-0.5 inline-flex">
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            expense.type === 'personal' ? 'bg-blue-500' : 'bg-emerald-500'
                          )}
                        />
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                          {expense.type}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800 space-y-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">
              Historical records not found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}