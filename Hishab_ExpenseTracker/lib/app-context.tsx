'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAuth, storageDB, StorageUser } from './storage';

export type AppContextType = 'none' | 'personal' | 'group';

interface AppState {
  context: AppContextType;
  setContext: (context: AppContextType) => void;
  currency: string;
  user: StorageUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: any | null;
  setUserProfile: (profile: any) => void;
  activeGroup: any | null;
  setActiveGroup: (group: any) => void;
  refreshCount: number;
  triggerRefresh: () => void;
  setCurrency: (currency: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  refreshAuth: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [context, setContextState] = useState<AppContextType>('none');
  const [user, setUser] = useState<StorageUser | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [activeGroup, setActiveGroupState] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [currency, setCurrencyState] = useState('BDT');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTutorial, setShowTutorialState] = useState(false);
  const setShowTutorial = (show: boolean) => {
    setShowTutorialState(show);
    if (!show) {
      localStorage.setItem('hishab_tutorial_viewed', 'true');
    }
  };

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  const refreshAuth = () => {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (accessToken && userData) {
      const user = JSON.parse(userData);
      setUser({
        uid: user.id?.toString() || user.uid,
        email: user.email,
        displayName: user.name || user.displayName
      });
      setUserProfile(user);
      if (user.currency) setCurrencyState(user.currency);
    } else {
      const currentUser = storageAuth.getCurrentUser();
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
        setUserProfile(currentUser);
        if (currentUser.currency) setCurrencyState(currentUser.currency);
      } else {
        setUser(null);
        setUserProfile(null);
        setContextState('none');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('hishab_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    if (user?.uid) {
      storageDB.users.update(user.uid, { currency: curr });
    }
  };

  // Persistence wrappers
  const setContext = (c: AppContextType) => {
    setContextState(c);
    localStorage.setItem('hishab_context', c);
  };

  const setActiveGroup = (g: any) => {
    setActiveGroupState(g);
    if (g) {
      localStorage.setItem('hishab_active_group', JSON.stringify(g));
    } else {
      localStorage.removeItem('hishab_active_group');
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for API auth tokens
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (accessToken && userData) {
          const user = JSON.parse(userData);
          setUser({
            uid: user.id?.toString() || user.uid,
            email: user.email,
            displayName: user.name || user.displayName
          });
          setUserProfile(user);
          if (user.currency) setCurrencyState(user.currency);

          // Restore persisted state
          const savedContext = localStorage.getItem('hishab_context') as AppContextType;
          if (savedContext) setContextState(savedContext);

          const savedGroup = localStorage.getItem('hishab_active_group');
          if (savedGroup) setActiveGroupState(JSON.parse(savedGroup));
        } else {
          // Fallback to old local storage auth for backward compatibility
          const currentUser = storageAuth.getCurrentUser();
          
          if (currentUser) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName
            });
            setUserProfile(currentUser);
            if (currentUser.currency) setCurrencyState(currentUser.currency);

            // Restore persisted state
            const savedContext = localStorage.getItem('hishab_context') as AppContextType;
            if (savedContext) setContextState(savedContext);

            const savedGroup = localStorage.getItem('hishab_active_group');
            if (savedGroup) setActiveGroupState(JSON.parse(savedGroup));
          } else {
            setUser(null);
            setUserProfile(null);
            setContextState('none');
          }
        }

        // Restore theme
        const savedTheme = localStorage.getItem('hishab_theme') as 'light' | 'dark';
        if (savedTheme) {
          setTheme(savedTheme);
          if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        }

        // Restore tutorial preference
        const tutorialViewed = localStorage.getItem('hishab_tutorial_viewed');
        if (!tutorialViewed && (accessToken || storageAuth.getCurrentUser())) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    // Clear API auth tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Clear old local storage auth for backward compatibility
    storageAuth.logout();
    
    setUser(null);
    setUserProfile(null);
    setContextState('none');
    setActiveGroupState(null);
    setCurrencyState('BDT');
    localStorage.removeItem('hishab_context');
    localStorage.removeItem('hishab_active_group');
  };

  return (
    <AppContext.Provider value={{ 
      context, 
      setContext, 
      currency, 
      user, 
      loading, 
      signOut,
      userProfile,
      setUserProfile,
      activeGroup,
      setActiveGroup,
      refreshCount,
      triggerRefresh,
      setCurrency,
      theme,
      toggleTheme,
      showTutorial,
      setShowTutorial,
      refreshAuth
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
