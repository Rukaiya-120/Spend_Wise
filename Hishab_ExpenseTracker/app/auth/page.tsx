'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, LogIn, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

 const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await authApi.register(name, email, password, confirmPassword);
    } else {
      await authApi.login(email, password);
    }

    // Redirect after success
    window.location.href = '/';
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      err.message ||
      'Authentication failed'
    );
  } finally {
    setLoading(false);
  }
};

  const signInWithGoogle = () => {
    setError('Google Sign-In is disabled in LocalStorage mode. Please use Email/Password.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20"
        >
          <span className="text-white text-3xl font-black italic">H</span>
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tight italic text-gray-900 dark:text-white">Hishab</h1>
          <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Smart Expense Tracking</p>
        </div>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col space-y-6">
        <div className="flex p-1 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-gray-400'}`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-slate-600" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-emerald-100 dark:focus:border-emerald-900/30 rounded-2xl pl-12 text-sm font-medium outline-none transition-all dark:text-white"
                />
              </motion.div>
              
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-slate-600" />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-emerald-100 dark:focus:border-emerald-900/30 rounded-2xl pl-12 text-sm font-medium outline-none transition-all dark:text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-slate-600" />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-emerald-100 dark:focus:border-emerald-900/30 rounded-2xl pl-12 text-sm font-medium outline-none transition-all dark:text-white"
            />
          </div>
          <AnimatePresence mode="wait">
  {mode === 'signup' && (
    <motion.div
      key="confirmPassword"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative"
    >
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-slate-600" />
      <input
        type="password"
        placeholder="Confirm Password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-emerald-100 dark:focus:border-emerald-900/30 rounded-2xl pl-12 text-sm font-medium outline-none transition-all dark:text-white"
      />
    </motion.div>
  )}
</AnimatePresence>

          {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {mode === 'login' ? 'Log In' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
          <span className="text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
        </div>

        <button 
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full h-14 bg-white dark:bg-slate-900 rounded-2xl card-shadow border border-gray-100 dark:border-slate-800 flex items-center justify-center gap-4 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-slate-400">Continue with Google</span>
        </button>
      </div>

      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest text-center px-12 leading-relaxed italic">
        By continuing, you agree to our <span className="text-emerald-600 underline">Terms</span> and <span className="text-emerald-600 underline">Privacy</span>.
      </p>
    </div>
  );
}
