'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users, ArrowLeft, Hash, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { contextApi } from '@/lib/context-api';

export function GroupHub() {
  const { user, setActiveGroup, setContext } = useApp();
  const [mode, setMode] = useState<'hub' | 'create' | 'join'>('hub');
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await contextApi.createGroup({ name: groupName });
      // Normalize response — backend may wrap in data key
      const group = res?.data ?? res?.group ?? res?.context ?? res;

      setActiveGroup({
        id: group.id,
        name: group.name,
        code: group.invite_code ?? group.code,
        adminId: group.admin_id ?? group.owner_id,
        admin_id: group.admin_id ?? group.owner_id,
        owner_id: group.owner_id,
        budget: 0,
        members: group.members ?? {},
      });
      setContext('group');
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await contextApi.joinGroup(groupCode.trim());
      const group = res?.data ?? res?.group ?? res?.context ?? res;

      setActiveGroup({
        id: group.id,
        name: group.name,
        code: group.invite_code ?? group.code,
        adminId: group.admin_id ?? group.owner_id,
        admin_id: group.admin_id ?? group.owner_id,
        owner_id: group.owner_id,
        budget: 0,
        members: group.members ?? {},
      });
      setContext('group');
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'Invalid or expired group code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
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
              className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Collective Domain</p>
              <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">Group Tracking</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Create or join a shared expense group.</p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('create')}
                className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 transition-all text-left"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Plus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black italic text-lg dark:text-white">Create New Group</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Be the administrator</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('join')}
                className="w-full p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-6 group hover:border-emerald-100 transition-all text-left"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black italic text-lg dark:text-white">Join a Group</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Enter invite code</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-sm space-y-8"
          >
            <button
              onClick={() => { setMode('hub'); setError(''); }}
              className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">New Group</p>
              <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">Create Group</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. House Expenses"
                  className="w-full bg-transparent text-xl font-black outline-none dark:text-white placeholder:text-gray-200 dark:placeholder:text-slate-700"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateGroup}
                disabled={loading || !groupName.trim()}
                className="w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Group'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-sm space-y-8"
          >
            <button
              onClick={() => { setMode('hub'); setError(''); }}
              className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Join Group</p>
              <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">Enter Code</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                <Hash className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="Invite code"
                  className="w-full bg-transparent text-xl font-black outline-none dark:text-white placeholder:text-gray-200 dark:placeholder:text-slate-700 tracking-widest"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleJoinGroup}
                disabled={loading || !groupCode.trim()}
                className="w-full h-16 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Group'}
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}