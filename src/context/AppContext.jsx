import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useStickyState } from '../hooks/useStickyState';
import i18n from '../i18n';
import { LEGACY_LANGUAGE_MAP, SUPPORTED_LANGUAGE_CODES, getLanguageLabel } from '../i18n/languages';

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
  // Changed to regular useState - do NOT persist user in localStorage
  // This ensures login page shows on every app load
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ============ AUTH METHODS ============
  const login = useCallback(
    (userData, lang = 'en') => {
      console.log('🔐 Login called with:', { userData, lang });
      setAuthLoading(true);
      setAuthError(null);

      // Simulate auth API call
      setTimeout(() => {
        console.log('✅ Setting user:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        const nextLang = SUPPORTED_LANGUAGE_CODES.includes(lang) ? lang : 'en';
        setLanguage(nextLang);
        i18n.changeLanguage(nextLang);
        setAuthLoading(false);
        addNotification('Login successful', 'success', 3000);
        console.log('✅ Login complete, user should be set');
      }, 500);
    },
    [setUser, setLanguage, setIsAuthenticated, addNotification]
  );

  const logout = useCallback(() => {
    // Clear all authentication state
    setUser(null);
    setIsAuthenticated(false);
    
    // Optionally clear other localStorage items if needed
    // localStorage.removeItem('gjj_user'); // No longer needed
    // localStorage.removeItem('gjj_authenticated'); // No longer needed
    
    // No need to reload - just clear state
    addNotification('Logged out successfully', 'success', 2000);
  }, [setUser, setIsAuthenticated, addNotification]);

  const updateUser = useCallback(
    (updates) => {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    },
    [setUser]
  );

  const setLoginError = useCallback((error) => {
    setAuthError(error);
  }, []);

  // ============ LANGUAGE METHODS ============
  const changeLanguage = useCallback(
    (newLanguage) => {
      console.log('🌍 Language Change Requested:', newLanguage);
      console.log('📍 Current language:', language);
      console.log('✅ Is supported?', SUPPORTED_LANGUAGE_CODES.includes(newLanguage));

      const nextLanguage = SUPPORTED_LANGUAGE_CODES.includes(newLanguage) ? newLanguage : 'en';
      console.log('🎯 Changing to:', nextLanguage);

      setLanguage(nextLanguage);
      i18n.changeLanguage(nextLanguage).then(() => {
        console.log('✨ i18n language updated to:', i18n.language);
        console.log('🔄 Components using useTranslation() will now re-render');
      });

      const langLabel = getLanguageLabel(nextLanguage);
      addNotification(`🌍 Language changed to ${langLabel}`, 'success', 3000);
    },
    [setLanguage, addNotification, language]
  );

  // ============ THEME METHODS ============
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const setThemedMode = useCallback(
    (mode) => {
      setTheme(mode);
    },
    [setTheme]
  );

  // ============ SIDEBAR METHODS ============
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
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

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
