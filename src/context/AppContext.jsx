import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useStickyState } from '../hooks/useStickyState';
import i18n from '../i18n';
import {
  LEGACY_LANGUAGE_MAP,
  SUPPORTED_LANGUAGE_CODES,
  getLanguageLabel,
} from '../i18n/languages';

/**
 * AppContext - Global State Management
 * Manages: Language, Theme, Authentication, User, Offline Mode, Global Settings
 * Replaces props drilling and provides centralized state access
 */
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // ============ LANGUAGE STATE ============
  // Force English as default on first load
  // Check localStorage first, if empty or invalid, use English
  const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('gjj_language');
    // Only use stored value if it's a valid supported language (not Tamil by default)
    if (stored && SUPPORTED_LANGUAGE_CODES.includes(stored)) {
      return stored;
    }
    // Default to English
    localStorage.setItem('gjj_language', 'en');
    return 'en';
  };
  
  const [language, setLanguage] = useStickyState(getInitialLanguage(), 'gjj_language');
  
  // Ensure language is always valid - this runs after initial render
  useEffect(() => {
    const stored = localStorage.getItem('gjj_language');
    if (!stored || !SUPPORTED_LANGUAGE_CODES.includes(stored)) {
      setLanguage('en');
      localStorage.setItem('gjj_language', 'en');
      i18n.changeLanguage('en');
    }
  }, [setLanguage]);

  // ============ THEME STATE ============
  const [theme, setTheme] = useStickyState('light', 'gjj_theme');

  // ============ AUTHENTICATION STATE ============
  const [user, setUser] = useStickyState(null, 'gjj_user');
  const [isAuthenticated, setIsAuthenticated] = useStickyState(false, 'gjj_authenticated');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // ============ OFFLINE MODE STATE ============
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const [lastSync, setLastSync] = useStickyState('Just now', 'gjj_last_sync');

  // ============ GLOBAL NOTIFICATIONS ============
  const [notifications, setNotifications] = useState([]);

  // ============ SIDEBAR STATE ============
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============ NETWORK STATUS LISTENER ============
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false);
      setLastSync(new Date().toLocaleTimeString());
    };
    const handleOffline = () => setOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setLastSync]);

  useEffect(() => {
    if (SUPPORTED_LANGUAGE_CODES.includes(language)) return;
    const normalized = LEGACY_LANGUAGE_MAP[language] || 'en';
    setLanguage(normalized);
  }, [language, setLanguage]);

  useEffect(() => {
    if (SUPPORTED_LANGUAGE_CODES.includes(language) && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // ============ NOTIFICATION METHODS ============
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ============ AUTH METHODS ============
  const login = useCallback((userData, lang = 'en') => {
    setAuthLoading(true);
    setAuthError(null);
    
    // Simulate auth API call
    setTimeout(() => {
      setUser(userData);
      setIsAuthenticated(true);
      const nextLang = SUPPORTED_LANGUAGE_CODES.includes(lang) ? lang : 'en';
      setLanguage(nextLang);
      i18n.changeLanguage(nextLang);
      setAuthLoading(false);
      addNotification('Login successful', 'success', 3000);
    }, 500);
  }, [setUser, setLanguage]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    setNotifications([]);
    addNotification('Logged out successfully', 'info', 2000);
  }, [setUser]);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, [setUser]);

  const setLoginError = useCallback((error) => {
    setAuthError(error);
  }, []);

  // ============ LANGUAGE METHODS ============
  const changeLanguage = useCallback((newLanguage) => {
    const nextLanguage = SUPPORTED_LANGUAGE_CODES.includes(newLanguage) ? newLanguage : 'en';
    setLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    addNotification(`Language changed to ${getLanguageLabel(nextLanguage)}`, 'info', 2000);
  }, [setLanguage, addNotification]);

  // ============ THEME METHODS ============
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setThemedMode = useCallback((mode) => {
    setTheme(mode);
  }, [setTheme]);

  // ============ SIDEBAR METHODS ============
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // ============ CONTEXT VALUE ============
  const contextValue = {
    // Language
    language,
    changeLanguage,

    // Theme
    theme,
    toggleTheme,
    setThemedMode,

    // Authentication
    user,
    isAuthenticated,
    authLoading,
    authError,
    login,
    logout,
    updateUser,
    setLoginError,

    // Offline Mode
    offlineMode,
    lastSync,
    setLastSync,

    // Notifications
    notifications,
    addNotification,
    removeNotification,

    // Sidebar
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
