# Code Style Guide

## 📋 General Principles

1. **Keep it Simple** - Write clean, readable code
2. **DRY** - Don't Repeat Yourself
3. **Single Responsibility** - One component, one purpose
4. **Consistent Naming** - Follow conventions throughout

## 🎨 File Naming Conventions

### Components

```
PascalCase.jsx
Examples:
  ✅ LoginScreen.jsx
  ✅ TechnicianDashboard.jsx
  ✅ PipelineMapViewer.jsx
  ❌ loginScreen.jsx
  ❌ technician-dashboard.jsx
```

### Hooks

```
camelCase.js (with 'use' prefix)
Examples:
  ✅ useStickyState.js
  ✅ useIoTSimulation.js
  ❌ UseStickyState.js
  ❌ sticky-state.js
```

### Utilities & Helpers

```
camelCase.js
Examples:
  ✅ helpers.js
  ✅ apiClient.js
  ❌ Helpers.js
  ❌ api-client.js
```

### Constants

```
camelCase.js (file), UPPER_CASE (exports)
Examples:
  ✅ translations.js → export const TRANSLATIONS
  ✅ thresholds.js → export const THRESHOLDS
```

## 📁 Folder Structure Rules

### 1. Components Organization

```
components/
├── auth/           # Authentication related
├── dashboards/     # Role-based dashboards
├── shared/         # Reusable components
└── [feature]/      # Feature-specific components
```

### 2. Group by Feature, Not by Type

```
✅ Good:
components/
  dashboards/
    TechnicianDashboard.jsx
    ResearcherDashboard.jsx
    GuestDashboard.jsx

❌ Bad:
components/
  technician/
  researcher/
  guest/
```

## 🔧 Code Organization

### Component Structure

```jsx
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import { Icon1, Icon2 } from 'lucide-react';
import { CustomComponent } from './components';

// 2. Constants (if any)
const DEFAULT_VALUE = 100;

// 3. Component Definition
export const MyComponent = ({ prop1, prop2 }) => {
  // 4. State declarations
  const [state, setState] = useState(null);

  // 5. Effects
  useEffect(() => {
    // effect logic
  }, []);

  // 6. Event handlers
  const handleClick = () => {
    // handler logic
  };

  // 7. Render helpers (if needed)
  const renderItem = (item) => {
    return <div>{item}</div>;
  };

  // 8. Return JSX
  return <div>{/* Component JSX */}</div>;
};
```

## 🎯 Best Practices

### 1. Props Destructuring

```jsx
✅ Good:
export const MyComponent = ({ name, age, onSubmit }) => {
  return <div>{name}</div>;
};

❌ Bad:
export const MyComponent = (props) => {
  return <div>{props.name}</div>;
};
```

### 2. Default Props

```jsx
✅ Good:
export const MyComponent = ({
  data = [],
  isLoading = false,
  onSubmit = () => {}
}) => {
  // component logic
};
```

### 3. Conditional Rendering

```jsx
✅ Good:
{isLoading && <Spinner />}
{error ? <ErrorMessage /> : <Content />}

❌ Bad:
{isLoading === true && <Spinner />}
{error ? <ErrorMessage /> : null}
```

### 4. Event Handlers

```jsx
✅ Good:
const handleSubmit = (e) => {
  e.preventDefault();
  // logic
};

<button onClick={handleSubmit}>Submit</button>

❌ Bad:
<button onClick={(e) => {
  e.preventDefault();
  // logic
}}>Submit</button>
```

### 5. State Management

```jsx
✅ Good:
const [user, setUser] = useState({ name: '', age: 0 });
const [isLoading, setIsLoading] = useState(false);

❌ Bad:
const [data, setData] = useState(null);
const [loading, setLoading] = useState(null);
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes

```jsx
✅ Good (organized by category):
<div className="
  flex items-center justify-between
  p-4 m-2
  bg-white rounded-lg shadow-md
  border border-gray-200
  hover:shadow-lg transition-all
">
  Content
</div>

❌ Bad (random order):
<div className="flex shadow-md p-4 bg-white items-center border rounded-lg hover:shadow-lg m-2 border-gray-200 justify-between transition-all">
  Content
</div>
```

### Class Order

1. Layout (flex, grid, display)
2. Positioning (relative, absolute)
3. Spacing (padding, margin)
4. Sizing (width, height)
5. Typography (font, text)
6. Colors (bg, text, border)
7. Effects (shadow, opacity)
8. Transitions & Animations

## 📝 Comments

### When to Comment

```jsx
✅ Good:
// Calculate water flow rate based on pressure differential
const flowRate = calculateFlow(pressure1, pressure2);

// Fetch sensor data every 5 seconds
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);

❌ Bad:
// Set state
setState(value);

// Return div
return <div>Content</div>;
```

### Component Documentation

```jsx
/**
 * TechnicianDashboard - Full operational control panel
 *
 * Features:
 * - Real-time sensor monitoring
 * - Maintenance task management
 * - Quick action buttons
 *
 * @param {Object} sensors - Sensor data object
 * @param {string} language - Current language code
 * @param {Object} t - Translation object
 */
export const TechnicianDashboard = ({ sensors, language, t }) => {
  // component logic
};
```

## 🔍 Code Quality Checklist

Before committing code, ensure:

- [ ] No console.log statements (use proper logging)
- [ ] No unused imports
- [ ] No unused variables
- [ ] Proper error handling
- [ ] Default props for optional parameters
- [ ] Meaningful variable names
- [ ] Consistent formatting
- [ ] Comments for complex logic
- [ ] No hardcoded values (use constants)
- [ ] Responsive design considerations

## 🚀 Performance Tips

1. **Memoization**

```jsx
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

2. **Lazy Loading**

```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>;
```

3. **Conditional Imports**

```jsx
// Only import when needed
if (condition) {
  const module = await import('./module');
  module.doSomething();
}
```

## 📦 Export Patterns

### Named Exports (Preferred)

```jsx
// MyComponent.jsx
export const MyComponent = () => { ... };

// index.js
export { MyComponent } from './MyComponent';
```

### Default Exports (Avoid)

```jsx
// Less clear what's being imported
export default MyComponent;
```

## 🔐 Security Best Practices

1. **Never store sensitive data in code**
2. **Use environment variables for API keys**
3. **Sanitize user inputs**
4. **Validate data before use**
5. **Use HTTPS for API calls**

## 📚 Additional Resources

- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
