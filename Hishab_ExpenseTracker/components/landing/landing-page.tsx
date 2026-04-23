'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { motion } from 'motion/react';
import api from '@/lib/axios';

export default function LandingPage() {

   // delete this later

    // http://expense-management-api.test/api/categories?context_id=019db8b6-d5de-7040-8852-3ad6c12ce82e

    const id = '019db8b6-d5de-7040-8852-3ad6c12ce82e';
    const getCategories = async () => {

      const result=  await api.get(`/categories?context_id=${id}`)
      console.log(result)
    }

  return (
    <div className="bg-white dark:bg-slate-950 selection:bg-emerald-100 selection:text-emerald-600">
      <LandingNavbar />
      <main>
        <Hero />

        <button onClick={getCategories}>Amake click koro</button>
        
        {/* Quote Section */}
        <section className="py-32 px-6">
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-16 h-1 w-24 bg-emerald-600 mx-auto rounded-full" 
              />
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tight leading-tight font-serif dark:text-white">
                &quot;Finance isn&apos;t just about math; <br />
                it&apos;s about the <span className="text-emerald-600 underline underline-offset-8">peace of mind</span> that comes with clarity.&quot;
              </h2>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto" />
                 <div>
                    <p className="text-sm font-black uppercase tracking-widest leading-none">Editorial Team</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Hishab Perspectives</p>
                 </div>
              </div>
           </div>
        </section>

        <Features />

        {/* CTA Section */}
        <section className="py-40 px-6">
           <div className="max-w-7xl mx-auto">
              <div className="bg-emerald-600 dark:bg-emerald-950 rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/10">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                 
                 <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-200">Ready to transform?</p>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic leading-[0.88] tracking-tighter">
                       Start your journey <br />
                       to financial zen.
                    </h2>
                    <p className="text-lg font-medium text-emerald-100 italic font-serif">
                       Join over 12,000 individuals and groups managing their expenses with absolute precision and local privacy.
                    </p>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="relative z-10 px-16 py-8 bg-white text-emerald-600 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:shadow-2xl transition-all"
                   onClick={() => window.location.href = '/auth'}
                 >
                    Get Exclusive Access
                 </motion.button>

                 {/* Decorative */}
                 <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                 <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
