import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * useAppState - Access entire app context
 * Usage: const appState = useAppState();
 */
export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppContextProvider');
  }
  return context;
};

/**
 * useAuth - Access authentication state and methods
 * Usage: const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useAppState();
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    authLoading: context.authLoading,
    authError: context.authError,
    login: context.login,
    logout: context.logout,
    updateUser: context.updateUser,
    setLoginError: context.setLoginError,
  };
};

/**
 * useLanguage - Access language state and methods
 * Usage: const { language, changeLanguage } = useLanguage();
 */
export const useLanguage = () => {
  const context = useAppState();
  return {
    language: context.language,
    changeLanguage: context.changeLanguage,
  };
};

/**
 * useTheme - Access theme state and methods
 * Usage: const { theme, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const context = useAppState();
  return {
    theme: context.theme,
    toggleTheme: context.toggleTheme,
    setThemedMode: context.setThemedMode,
  };
};

/**
 * useOffline - Access offline mode state
 * Usage: const { offlineMode, lastSync } = useOffline();
 */
export const useOffline = () => {
  const context = useAppState();
  return {
    offlineMode: context.offlineMode,
    lastSync: context.lastSync,
    setLastSync: context.setLastSync,
  };
};

/**
 * useNotifications - Access notification system
 * Usage: const { addNotification, removeNotification } = useNotifications();
 */
export const useNotifications = () => {
  const context = useAppState();
  return {
    notifications: context.notifications,
    addNotification: context.addNotification,
    removeNotification: context.removeNotification,
  };
};

/**
 * useSidebar - Access sidebar state
 * Usage: const { sidebarOpen, toggleSidebar } = useSidebar();
 */
export const useSidebar = () => {
  const context = useAppState();
  return {
    sidebarOpen: context.sidebarOpen,
    toggleSidebar: context.toggleSidebar,
    closeSidebar: context.closeSidebar,
  };
};
