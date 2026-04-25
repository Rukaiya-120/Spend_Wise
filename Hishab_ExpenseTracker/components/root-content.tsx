'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { TopNav } from '@/components/top-nav';
import { AddExpenseModal } from '@/components/add-expense-modal';
import { TutorialModal } from '@/components/tutorial-modal';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function RootContent({ children }: { children: React.ReactNode }) {
  const { user, loading, context, showTutorial, setShowTutorial } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/auth', '/landing'];
    if (!loading && !user && !publicPaths.includes(pathname) && pathname !== '/') {
      router.push('/landing');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const isAuthPage = pathname === '/auth';
  const isLandingPage = pathname === '/landing' || (pathname === '/' && !user);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {!isAuthPage && !isLandingPage && context !== 'none' && <TopNav />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && !isLandingPage && context !== 'none' && (
        <>
          <AddExpenseModal />
        </>
      )}
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
