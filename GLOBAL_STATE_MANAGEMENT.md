# Global State Management Implementation

## Overview

This document describes the new centralized global state management system for the Gram Jal Jeevan application, replacing props drilling and local state fragmentation with a Context API-based solution.

## Problem Solved

### Before (Props Drilling)

```jsx
// App.jsx
<MainDashboard
  language={language}
  onLanguageChange={setLanguage}
  offlineMode={offlineMode}
  lastSync={lastSync}
  user={user}
  // ... 20+ more props
/>

// MainDashboard passes to GuestDashboard
<GuestDashboard language={language} t={t} offlineMode={offlineMode} lastSync={lastSync} />

// GuestDashboard receives all props even if it only needs some
export const GuestDashboard = ({ language, t, offlineMode, lastSync }) => { ... }
```

### After (Context API)

```jsx
// GuestDashboard uses hooks directly, no prop drilling
export const GuestDashboard = () => {
  const { language } = useLanguage();
  const { offlineMode, lastSync } = useOffline();
  // ... clean component
};
```

## Architecture

### 1. AppContext (`src/context/AppContext.jsx`)

Central context provider managing global state:

```jsx
<AppContextProvider>
  <App />
</AppContextProvider>
```

**State Managed:**

- **Language**: Current language selection (English, Hindi, Kannada, etc.)
- **Theme**: Light/Dark mode (extensible)
- **Authentication**: User data, login status, auth errors
- **Offline Mode**: Network status, last sync time
- **Notifications**: Toast/alert messages
- **Sidebar**: Mobile menu state

### 2. Custom Hooks (`src/hooks/useAppState.js`)

Easy-to-use hooks for consuming global state:

#### `useAppState()`

Access entire context (rarely needed):

```jsx
const appState = useAppState();
// All context values available
```

#### `useAuth()`

Authentication state & methods:

```jsx
const { user, isAuthenticated, authLoading, authError, login, logout, updateUser } = useAuth();

// Usage
const handleLogin = () => {
  login({ name: 'John Doe', role: 'technician' }, 'English');
};

const handleLogout = () => {
  logout();
};
```

#### `useLanguage()`

Language management:

```jsx
const { language, changeLanguage } = useLanguage();

// Usage
<select value={language} onChange={(e) => changeLanguage(e.target.value)}>
  <option value="English">English</option>
  <option value="Hindi">हिंदी</option>
</select>;
```

#### `useTheme()`

Theme management (extensible):

```jsx
const { theme, toggleTheme, setThemedMode } = useTheme();

// Usage
<button onClick={toggleTheme}>Toggle Dark Mode</button>;
```

#### `useOffline()`

Offline mode & sync status:

```jsx
const { offlineMode, lastSync, setLastSync } = useOffline();

// Usage
{
  offlineMode ? <span>Offline Mode</span> : <span>Online</span>;
}
```

#### `useNotifications()`

Notification system:

```jsx
const { notifications, addNotification, removeNotification } = useNotifications();

// Usage
<button onClick={() => addNotification('Saved!', 'success', 3000)}>Save</button>;
```

#### `useSidebar()`

Mobile sidebar state:

```jsx
const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
```

## Implementation Guide

### Step 1: Wrap App with Provider

**File: `src/main.jsx`** (Already done)

```jsx
import { AppContextProvider } from './context/AppContext';

const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};
```

### Step 2: Use Hooks in Components

**Before:**

```jsx
export const LoginScreen = ({ onLogin, language, onLanguageChange }) => {
  const handleLogin = (userData, selectedLanguage) => {
    onLogin(userData, selectedLanguage);
  };

  return (
    <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
      ...
    </select>
  );
};
```

**After:**

```jsx
import { useAuth, useLanguage } from '../../hooks/useAppState';

export const LoginScreen = () => {
  const { login, authLoading, authError } = useAuth();
  const { language, changeLanguage } = useLanguage();

  const handleLogin = (userData, selectedLanguage) => {
    login(userData, selectedLanguage);
  };

  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      ...
    </select>
  );
};
```

### Step 3: Remove Props from Component Signatures

**Before:**

```jsx
function MainDashboard({ language, t, offlineMode, lastSync, ...otherProps }) {
  // Props passed down further
}
```

**After:**

```jsx
function MainDashboard({ ...otherProps }) {
  // Get what you need from hooks
  const { language } = useLanguage();
  const { offlineMode, lastSync } = useOffline();
}
```

## Benefits

| Aspect              | Before                                       | After                               |
| ------------------- | -------------------------------------------- | ----------------------------------- |
| **Props Passed**    | 20+ props through multiple levels            | Only necessary data props           |
| **Code Repetition** | Props repeated at each component level       | Single hook import                  |
| **Refactoring**     | Breaking changes cascade                     | Local changes only                  |
| **Scalability**     | Hard to add new global state                 | Easy to extend in context           |
| **Testing**         | Complex prop setup needed                    | Simple context mocking              |
| **Performance**     | All components re-render on any state change | Selective re-renders via hook usage |

## Files Updated

### New Files Created

- ✅ `src/context/AppContext.jsx` - Main context provider
- ✅ `src/hooks/useAppState.js` - Custom hooks collection

### Components Refactored

- ✅ `src/App.jsx` - Wrapped with AppContextProvider, uses hooks
- ✅ `src/components/auth/LoginScreen.jsx` - Uses useAuth, useLanguage
- ✅ `src/components/dashboards/GuestDashboard.jsx` - Uses useLanguage, useOffline
- ✅ `src/components/dashboards/TechnicianDashboard.jsx` - Uses useLanguage, useOffline
- ✅ `src/components/dashboards/ResearcherDashboard.jsx` - Uses useLanguage
- ✅ `src/components/dashboards/ServiceRequestDashboard.jsx` - Uses useLanguage

## Extending State Management

### Adding New Global State

1. **Update AppContext.jsx:**

```jsx
// Add state
const [myNewState, setMyNewState] = useStickyState(initialValue, 'storage_key');

// Add method
const updateMyState = useCallback(
  (newValue) => {
    setMyNewState(newValue);
  },
  [setMyNewState]
);

// Add to context value
const contextValue = {
  // ... existing
  myNewState,
  updateMyState,
};
```

2. **Create custom hook in useAppState.js:**

```jsx
export const useMyNewState = () => {
  const context = useAppState();
  return {
    myNewState: context.myNewState,
    updateMyState: context.updateMyState,
  };
};
```

3. **Use in components:**

```jsx
import { useMyNewState } from '../../hooks/useAppState';

function MyComponent() {
  const { myNewState, updateMyState } = useMyNewState();
}
```

## Error Handling

### Missing Provider Error

If you see: `useAppState must be used within AppContextProvider`

**Solution:** Ensure component is rendered inside `<AppContextProvider>` tree.

### Hook Outside Component Error

```jsx
// ❌ WRONG
const { user } = useAuth(); // Called outside component

// ✅ CORRECT
function MyComponent() {
  const { user } = useAuth(); // Called inside component
}
```

## Performance Optimization

The context is optimized to prevent unnecessary re-renders:

1. **useCallback hooks**: Memoized methods
2. **useStickyState**: Automatic localStorage persistence
3. **Selective imports**: Only import the hooks you need

For finer control, consider wrapping sub-contexts:

```jsx
// Advanced: Split contexts by concern
<AuthProvider>
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
</AuthProvider>
```

## Testing with Context

### Mock Provider for Tests

```jsx
import { render } from '@testing-library/react';
import { AppContextProvider } from '../context/AppContext';

function renderWithContext(component) {
  return render(<AppContextProvider>{component}</AppContextProvider>);
}

test('LoginScreen uses useAuth hook', () => {
  renderWithContext(<LoginScreen />);
  // Test component...
});
```

## Migration Checklist

- [x] Create AppContext.jsx
- [x] Create useAppState.js hooks
- [x] Wrap App with AppContextProvider
- [x] Update LoginScreen
- [x] Update GuestDashboard
- [x] Update TechnicianDashboard
- [x] Update ResearcherDashboard
- [x] Update ServiceRequestDashboard
- [ ] Remove language/offlineMode from all prop signatures
- [ ] Update remaining dashboards (InfrastructureDashboard, etc.)
- [ ] Test language switching
- [ ] Test offline mode
- [ ] Test login/logout flow
- [ ] Performance profiling

## Future Enhancements

1. **Redux-like DevTools**: Add Redux DevTools integration for debugging
2. **Persist Manager**: More sophisticated persistence with encryption
3. **Sub-contexts**: Split into AuthContext, ThemeContext, etc. as app grows
4. **Middleware**: Add logging, analytics, error tracking middleware
5. **Rehydration**: Advanced state rehydration from backend on app startup

## References

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
