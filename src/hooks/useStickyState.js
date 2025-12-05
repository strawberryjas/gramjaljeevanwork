import { useState, useEffect } from 'react';

// Custom Hook for Offline Storage (LocalStorage Persistence)
export const useStickyState = (defaultValue, key) => {
  const getInitialValue = () => {
    if (typeof window === 'undefined') return defaultValue;

    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      // Legacy value (e.g., plain string like "en"); auto-heal by re-saving as JSON once
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch {
        // Ignore storage failures silently
      }
      // Return the raw string if it's a string, otherwise use default
      return typeof storedValue === 'string' ? storedValue : defaultValue;
    }
  };

  const [value, setValue] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures silently to avoid crashing the UI
    }
  }, [key, value]);

  return [value, setValue];
};
