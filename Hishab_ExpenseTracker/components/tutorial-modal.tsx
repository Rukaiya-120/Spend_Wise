'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Wallet, Users, Target, Shield, Zap } from 'lucide-react';

interface Step {
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    title: "Welcome to Hishab",
    desc: "Your new command center for financial clarity. Designed for speed, security, and absolute precision.",
    icon: Wallet
  },
  {
    title: "Contextual Tracking",
    desc: "Switch between Personal and Group modes instantly. Track your own expenses or sync with housemates and friends.",
    icon: Zap
  },
  {
    title: "Group Dynamics",
    desc: "Create groups and share your unique join code. Everyone can log expenses and see the collective burn in real-time.",
    icon: Users
  },
  {
    title: "Intelligent Budgeting",
    desc: "Set monthly goals. Our heuristic analysis helps you maintain equilibrium and reach your targets faster.",
    icon: Target
  },
  {
    title: "Privacy First",
    desc: "Local-first architecture ensures your data stays on your device. High-fidelity tracking without compromising security.",
    icon: Shield
  }
];

export function TutorialModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 text-center relative overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose} 
              className="absolute top-8 right-8 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-10 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-600">
                    {React.createElement(steps[currentStep].icon, { className: "w-10 h-10" })}
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Module {currentStep + 1} of {steps.length}</p>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase dark:text-white leading-tight">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400 leading-relaxed font-serif italic px-6">
                      {steps[currentStep].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between pt-8">
                <button 
                  onClick={prev}
                  disabled={currentStep === 0}
                  className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-emerald-600 disabled:opacity-0 transition-all border border-transparent dark:hover:border-slate-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-8 bg-emerald-600' : 'w-1.5 bg-gray-200 dark:bg-slate-800'}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={next}
                  className="w-16 h-16 rounded-[1.5rem] bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-none active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {currentStep === steps.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onClose}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                >
                  Terminate Tutorial
                </motion.button>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-600/5 rounded-full blur-[80px] -ml-24 -mt-24" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-[60px] -mr-16 -mb-16" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
