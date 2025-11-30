# Global State Management Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React App Root                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AppContextProvider                             │
│  (Wraps entire application with global state)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │    App       │ │ Sidebar  │ │  LoginScreen │
        └──────────────┘ └──────────┘ └──────────────┘
                │
                ├─────────────────────────────────┐
                ▼                                 ▼
        ┌──────────────┐              ┌─────────────────────┐
        │ MainDashboard│              │ MainDashboard Tabs  │
        └──────────────┘              │                     │
                │                     ├─ Infrastructure   │
                ├──────────────────┐  ├─ Daily Ops        │
                ▼                  ▼  ├─ Water Quality    │
        ┌────────────────┐ ┌───────────────────────────┐
        │ Guest Dashboard│ │ Technician Dashboard      │
        │ (uses hooks)   │ │ (uses hooks)              │
        └────────────────┘ └───────────────────────────┘
                │                  │
                └──────────┬───────┘
                           ▼
                ┌─────────────────────┐
                │ Custom Hooks System │
                │ (useAuth, etc)      │
                └─────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        ┌────────┐  ┌─────────────┐  ┌──────────┐
        │ State  │  │  Network    │  │localStorage
        │ Logic  │  │  Listeners  │  │ Persistence
        └────────┘  └─────────────┘  └──────────┘
```

## State Flow Diagram

```
AppContext (Single Source of Truth)
│
├─── Language State ────────────────┐
│    └─ changeLanguage()            │
│                                   │
├─── Authentication State ──────────┤
│    ├─ user                        │
│    ├─ isAuthenticated             │
│    ├─ login()                     │
│    └─ logout()                    │
│                                   │
├─── Offline Mode State ────────────┤ ──→ All Components
│    ├─ offlineMode                 │     Can Access
│    ├─ lastSync                    │     Via Hooks
│    └─ setLastSync()               │
│                                   │
├─── Theme State ───────────────────┤
│    └─ toggleTheme()               │
│                                   │
├─── Notifications State ───────────┤
│    ├─ addNotification()           │
│    └─ removeNotification()        │
│                                   │
└─── Sidebar State ─────────────────┘
     └─ toggleSidebar()
```

## Hook Dependency Graph

```
useAppState()
│
├─→ useAuth()
│   ├─ user
│   ├─ login()
│   ├─ logout()
│   └─ updateUser()
│
├─→ useLanguage()
│   ├─ language
│   └─ changeLanguage()
│
├─→ useTheme()
│   ├─ theme
│   └─ toggleTheme()
│
├─→ useOffline()
│   ├─ offlineMode
│   └─ lastSync
│
├─→ useNotifications()
│   ├─ addNotification()
│   └─ removeNotification()
│
└─→ useSidebar()
    ├─ sidebarOpen
    └─ toggleSidebar()
```

## Component Tree with Hook Usage

```
App
│
├─ Wrapped with AppContextProvider
│
└─ AppContent (uses useAuth, useLanguage)
   │
   ├─ Sidebar
   │  └─ uses: useLanguage, useSidebar
   │
   ├─ MainDashboard (uses useLanguage)
   │  │
   │  ├─ InfrastructureDashboard
   │  │
   │  ├─ DailyOperationDashboard
   │  │
   │  ├─ WaterQualityDashboard
   │  │
   │  ├─ GuestDashboard (uses useLanguage, useOffline)
   │  │  ├─ StatCard
   │  │  ├─ GaugeChart
   │  │  └─ QualityCard
   │  │
   │  ├─ TechnicianDashboard (uses useLanguage, useOffline)
   │  │  ├─ StatCard
   │  │  ├─ GaugeChart
   │  │  └─ PipelineMapViewer
   │  │
   │  ├─ ResearcherDashboard (uses useLanguage)
   │  │  ├─ BarChart
   │  │  └─ LineChart
   │  │
   │  └─ ServiceRequestDashboard (uses useLanguage)
   │     └─ ServiceRequestCard
   │
   └─ LoginScreen (uses useAuth, useLanguage)
      └─ Uses context for login flow
```

## Data Flow: Login Example

```
User fills login form
        │
        ▼
LoginScreen component
        │
        ▼
calls: login(userData, language)
        │
        ▼
AppContext.login() method
        │
        ├─→ Set user state
        ├─→ Set isAuthenticated = true
        ├─→ Set language
        └─→ Save to localStorage
        │
        ▼
All components subscribed to useAuth()
re-render with new user data
        │
        ▼
App automatically shows MainDashboard
instead of LoginScreen
```

## Data Flow: Language Switching Example

```
User selects language from dropdown
        │
        ▼
changeLanguage('Hindi')
        │
        ▼
AppContext updates language state
        │
        ├─→ Set language = 'Hindi'
        └─→ Save to localStorage
        │
        ▼
All components using useLanguage()
are notified of change
        │
        ├─→ GuestDashboard re-renders
        ├─→ TechnicianDashboard re-renders
        ├─→ Sidebar re-renders
        └─→ All other components re-render
        │
        ▼
App UI updates instantly
All text changes to Hindi
```

## Data Persistence Flow

```
On App Load:
  localStorage → useStickyState → AppContext → Components

On State Change:
  Component → changeLanguage() → AppContext → useStickyState → localStorage

On Page Refresh:
  localStorage → useStickyState → AppContext → Components (restored)
```

## Network Status Monitoring

```
Window 'online' event
        │
        ▼
AppContext listener triggered
        │
        ├─→ setOfflineMode(false)
        └─→ setLastSync(new Date())
        │
        ▼
Components using useOffline()
are notified
        │
        ▼
UI updates: show "Online" status
```

## Component Re-render Optimization

```
Without Context (Props Drilling):
App state change
        │
        ▼
App re-renders
        │
        ▼
MainDashboard re-renders
        │
        ▼
GuestDashboard re-renders
        │
        └─→ All child components re-render
                        (WASTEFUL)

With Context (Hooks):
App state change
        │
        ▼
Context updates
        │
        ├─→ Components using useLanguage() re-render
        └─→ Components not using hooks stay unchanged
                        (EFFICIENT)
```

## Authentication Flow

```
┌─────────────────────────────────┐
│      Login Screen Shown          │
│  (User not authenticated)        │
└─────────────────────────────────┘
              │
              │ User submits form
              ▼
┌─────────────────────────────────┐
│  Validate credentials            │
│  (tech/admin or research/admin)  │
└─────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │ Success            │ Failure
    ▼                    ▼
┌──────────┐      ┌──────────────────┐
│call login()      │set authError     │
│with userData     │show error message│
│and language      │keep login screen │
└──────────┘      └──────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ AppContext.login() executes:     │
│ - setUser(userData)              │
│ - setIsAuthenticated(true)       │
│ - setLanguage(lang)              │
│ - Save to localStorage           │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Components re-render             │
│ useAuth() returns new user       │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│      Main Dashboard Shown         │
│  (User authenticated)            │
└──────────────────────────────────┘
```

## Language Switching Architecture

```
┌──────────────────────┐
│  TRANSLATIONS Object │
│  (constants)         │
│                      │
│  English: {...}      │
│  Hindi: {...}        │
│  Kannada: {...}      │
│  Marathi: {...}      │
│  Telugu: {...}       │
└──────────────────────┘
          │
          │ useLanguage hook
          │ returns current language
          ▼
┌──────────────────────┐
│   Component Renders  │
│   t = TRANSLATIONS   │
│   [language]         │
└──────────────────────┘
          │
          │ Display correct text
          ▼
┌──────────────────────┐
│   User Interface     │
│   (in selected lang) │
└──────────────────────┘
```

## Performance Optimization Strategy

```
AppContext (Large)
        │
        ├─ useAuth() ──────→ Only auth-related components re-render
        │
        ├─ useLanguage() ──→ Only i18n components re-render
        │
        ├─ useOffline() ───→ Only status-aware components re-render
        │
        └─ etc.
        
Result: Selective re-renders instead of app-wide re-renders
```

## File Structure

```
src/
│
├─ context/
│  └─ AppContext.jsx
│     ├─ Create context
│     ├─ Provider component
│     ├─ State initialization
│     ├─ useCallback methods
│     └─ Network listeners
│
├─ hooks/
│  ├─ useAppState.js
│  │  ├─ useAppState()
│  │  ├─ useAuth()
│  │  ├─ useLanguage()
│  │  ├─ useTheme()
│  │  ├─ useOffline()
│  │  ├─ useNotifications()
│  │  └─ useSidebar()
│  │
│  ├─ useIoTSimulation.js (existing)
│  └─ useStickyState.js (existing)
│
├─ components/
│  ├─ auth/
│  │  └─ LoginScreen.jsx (updated)
│  │
│  ├─ dashboards/
│  │  ├─ GuestDashboard.jsx (updated)
│  │  ├─ TechnicianDashboard.jsx (updated)
│  │  ├─ ResearcherDashboard.jsx (updated)
│  │  └─ ServiceRequestDashboard.jsx (updated)
│  │
│  └─ shared/
│     ├─ StatCard.jsx
│     ├─ GaugeChart.jsx
│     ├─ QualityCard.jsx
│     └─ CountdownCard.jsx
│
├─ App.jsx (updated)
│  └─ Wrapped with AppContextProvider
│
└─ main.jsx
   └─ Entry point
```

## Decision Flow Chart

```
Need global state?
        │
        ├─ Yes → Use AppContext
        │        Create custom hook in useAppState.js
        │        Use hook in component
        │
        └─ No → Use local useState
                Keep component simple

Component needs global state?
        │
        ├─ Yes → Import specific hook
        │        (useAuth, useLanguage, etc)
        │        Don't import useAppState
        │
        └─ No → Use props for component data

Multiple components need same state?
        │
        ├─ Yes → Already in AppContext
        │        Use hook from any component
        │        No prop drilling needed
        │
        └─ No → Can use local state if small
```

## State Synchronization Guarantee

```
Component A uses useLanguage()
        │
        │ Reads: language = 'English'
        ▼
User changes to Hindi

        │
        ▼
AppContext.changeLanguage('Hindi')
        │
        ├─→ language = 'Hindi' (in context)
        └─→ Save to localStorage
        │
        ▼
Component A is notified
        │
        │ Reads: language = 'Hindi' (fresh)
        ▼
Component A re-renders with Hindi text

AND

Component B uses useLanguage()
        │
        │ Also re-renders with Hindi text
        │ WITHOUT Component A passing props
        │
        ▼
Perfect sync, zero latency
```

## Testing Architecture

```
Test LoginScreen with useAuth():
├─ Wrap in AppContextProvider mock
├─ Call login() from hook
└─ Verify user state updated

Test language switching:
├─ Wrap in AppContextProvider mock
├─ Change language via hook
└─ Verify all components re-render

Test offline mode:
├─ Mock window.addEventListener
├─ Trigger 'offline' event
└─ Verify offlineMode state changed

Test persistence:
├─ Mock localStorage
├─ Update state
└─ Verify localStorage.setItem called
```

---

This architecture ensures:
✅ Single source of truth
✅ No props drilling
✅ Automatic synchronization
✅ Easy testing
✅ Performance optimized
✅ Scalable to 100+ components
