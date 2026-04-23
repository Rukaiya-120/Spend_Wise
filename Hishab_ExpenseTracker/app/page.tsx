'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { SelectionHub } from '@/components/dashboard/selection-hub';
import { GroupHub } from '@/components/dashboard/group-hub';
import { PersonalDashboard } from '@/components/dashboard/personal-dashboard';
import { GroupDashboard } from '@/components/dashboard/group-dashboard';
import LandingPage from '@/components/landing/landing-page';
import { AnimatePresence, motion } from 'motion/react';
import { TutorialModal } from '@/components/tutorial-modal';

export default function Home() {
  const { context, activeGroup, user, showTutorial, setShowTutorial } = useApp();

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {context === 'none' && (
          <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SelectionHub />
          </motion.div>
        )}

        {context === 'personal' && (
          <motion.div key="personal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PersonalDashboard />
          </motion.div>
        )}

        {context === 'group' && (
          <motion.div key="group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!activeGroup ? <GroupHub /> : <GroupDashboard />}
          </motion.div>
        )}
      </AnimatePresence>
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
