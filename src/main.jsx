import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './index.css';
import './i18n';

// Register Service Worker for offline functionality (production only)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available');
                // Optionally notify user to refresh
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Ensure dev mode is not controlled by an old SW (prevents HMR websocket issues)
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
