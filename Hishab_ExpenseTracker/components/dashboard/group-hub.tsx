'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowLeft, Hash, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { contextApi } from '@/lib/context-api';

export function GroupHub() {
  const { setActiveGroup, setContext } = useApp();

  const [mode, setMode] = useState<'hub' | 'create' | 'join'>('hub');
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupBudget, setGroupBudget] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');

  const normalizeGroup = (response: any) => {
    const group = response?.data || response?.context || response?.group || response;

    return {
      id: group.id,
      name: group.name,
      adminId: group.admin_id || group.adminId,
      code: group.invite_code,
      budget: Number(group.budget || 0),
      createdAt: group.created_at || group.createdAt,
      members: group.members || {},
    };
  };

  const handleCreateGroup = async () => {
    if (!groupName || !groupBudget) return;

    setLoading(true);
    setError('');

    try {
      const response = await contextApi.createGroup({
        name: groupName,
        budget: Number(groupBudget),
      });

      const group = normalizeGroup(response);

      setActiveGroup(group);
      setContext('group');

      localStorage.setItem('hishab_active_group', JSON.stringify(group));
      localStorage.setItem('hishab_context', 'group');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to create group'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (groupCode.length !== 8) return;

    setLoading(true);
    setError('');

    try {
      const response = await contextApi.joinGroup(groupCode);
      const group = normalizeGroup(response);

      setActiveGroup(group);
      setContext('group');

      localStorage.setItem('hishab_active_group', JSON.stringify(group));
      localStorage.setItem('hishab_context', 'group');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Group not found'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-100 selection:text-emerald-600 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {mode === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm space-y-8"
          >
            <button
              onClick={() => setContext('none')}
              className="flex items-center gap-2 text-gray-400 dark:text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Central Gateway
            </button>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">
                Collective Domain
              </p>
              <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">
                Collaborative Tracking
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest leading-relaxed">
                Choose your entry vector into shared finances.
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('create')}
                className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <Plus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black italic text-lg dark:text-white">
                    Create New Group
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    Be the administrator
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('join')}
                className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-rotate-6">
                  <Hash className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black italic text-lg dark:text-white">
                    Join Existing Group
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    Use 6-digit code
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800"
          >
            <button
              onClick={() => setMode('hub')}
              className="text-gray-400 dark:text-slate-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Abort Process
            </button>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">
                Initialization Phase
              </p>
              <h2 className="text-3xl font-black italic tracking-tighter dark:text-white">
                Start a Group
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">
                Naming it is the first step
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest px-4">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flatmates"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl px-6 text-sm font-bold dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-600 transition-all placeholder:text-gray-200 dark:placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest px-4">
                  Monthly Budget
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={groupBudget}
                  onChange={(e) => setGroupBudget(e.target.value)}
                  className="w-full h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl px-6 text-xl font-black dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-600 transition-all italic placeholder:text-gray-200 dark:placeholder:text-slate-700"
                />
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={loading || !groupName || !groupBudget}
                className="w-full h-20 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100 dark:shadow-emerald-900/10 flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Structure'}
              </button>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800"
          >
            <button
              onClick={() => setMode('hub')}
              className="text-gray-400 dark:text-slate-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Abort Process
            </button>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">
                Authentication Required
              </p>
              <h2 className="text-3xl font-black italic tracking-tighter dark:text-white">
                Enter Join Code
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">
                Ask your associate for the 6-digit credential
              </p>
            </div>

            <div className="space-y-6">
            <input
              type="text"
              maxLength={8}
              placeholder="AB12CD34"
              value={groupCode}
              onChange={(e) =>
                setGroupCode(
                  e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                )
              }
              className="w-full h-24 bg-gray-50 dark:bg-slate-800 rounded-3xl text-center text-4xl font-black tracking-[0.25em] outline-none ring-2 ring-transparent focus:ring-emerald-600 transition-all dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-slate-700"
            />

              <button
                onClick={handleJoinGroup}
                disabled={loading || groupCode.length !== 8}
                className="w-full h-20 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100 dark:shadow-emerald-900/10 flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate Entry'}
              </button>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}