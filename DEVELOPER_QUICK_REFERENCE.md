# Frontend Developer Quick Reference

## 🚀 Getting Started

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Initialize git hooks
npx husky install

# 3. Create .env.local for your environment
cp .env.example .env.local

# 4. Start development server
npm run dev
```

### Environment Variables
Create `.env.local` in project root:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_USE_MSW=true              # Use mock APIs for frontend-only dev
VITE_DEBUG_MODE=false
VITE_APP_ENV=development
```

---

## 💻 Daily Development Commands

### Start Dev Server
```bash
npm run dev
# Opens http://localhost:5173
# With MSW mock APIs enabled (if VITE_USE_MSW=true)
```

### View Component Stories
```bash
npm run storybook
# Opens http://localhost:6006
# Interactive component library
```

### Run Tests (Watch Mode)
```bash
npm run test
# Press 'a' to run all tests
# Press 'q' to quit
# Press 'w' for help
```

### Run Tests in UI
```bash
npm run test:ui
# Opens interactive test UI
# Better for debugging test failures
```

---

## 🧹 Code Quality

### Format Code
```bash
# Format all files
npm run format

# Check formatting without changing
npm run format:check
```

### Fix Lint Issues
```bash
# Check for issues
npm run lint

# Auto-fix auto-fixable issues
npm run lint:fix
```

### Combined Quality Check
```bash
# Run all checks
npm run lint && npm run format:check && npm run test
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run single test file
npm run test -- hooks.useAuth.test.js

# Run with coverage
npm run test:coverage
```

### Component Tests
```bash
# Run component-specific tests
npm run test -- components

# Run with UI
npm run test:ui
```

### Accessibility Audit
```bash
# Run a11y audit (requires dev server running)
npm run dev &
npm run a11y:audit
```

---

## 🏗️ Building & Deployment

### Development Build
```bash
npm run build
# Creates optimized build in dist/ folder
```

### Analyze Bundle
```bash
npm run analyze
# Generates interactive bundle visualization
# Shows what's taking up space
```

### Preview Production Build
```bash
npm run build
npm run preview
# Opens http://localhost:4173
# Test production build locally
```

### Type Checking (if TypeScript added later)
```bash
npm run type-check
# Currently disabled (no TypeScript)
```

---

## 📚 Documentation

### Available Guides

**Backend Integration:** `BACKEND_INTEGRATION_GUIDE.md`
- API endpoint specs
- Authentication flow
- Environment configuration

**Performance & Optimization:** `FRONTEND_OPTIMIZATION_CHECKLIST.md`
- Performance targets
- Bundle optimization
- Accessibility checklist
- Security best practices

**Testing Strategy:** `FRONTEND_TESTING_GUIDE.md`
- Unit testing examples
- Component testing patterns
- E2E testing setup
- Coverage goals

**Security & Config:** `FRONTEND_SECURITY_CONFIG.md`
- Environment variables
- Secret management
- XSS prevention
- Security checklist

**Implementation Summary:** `FRONTEND_IMPLEMENTATION_SUMMARY.md`
- What was implemented
- Status of all tasks
- Quick start guide

---

## 🛠️ Common Tasks

### Add New Component Story
```bash
# Create MyComponent.stories.js in component folder
# Example: src/components/shared/MyComponent.stories.js

import MyComponent from './MyComponent'

export default {
  title: 'Shared/MyComponent',
  component: MyComponent,
}

export const Default = {
  args: { /* default props */ }
}

export const Variant1 = {
  args: { /* variant props */ }
}
```

### Add New Unit Test
```bash
# Create test file alongside component
# Example: src/__tests__/hooks.useMyHook.test.js

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMyHook } from '../../hooks/useMyHook'

describe('useMyHook', () => {
  it('should do something', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current).toBeDefined()
  })
})
```

### Add Feature Flag
```bash
// In src/api/featureFlags.js
MY_NEW_FEATURE: process.env.VITE_MY_NEW_FEATURE === 'true'

// In component
import { isFeatureEnabled } from './api/featureFlags'
if (isFeatureEnabled('MY_NEW_FEATURE')) {
  // Show new feature
}
```

### Add API Endpoint
```bash
// In src/api/myService.js
export class MyService {
  static async getMyData() {
    const response = await apiClient.get('/my-endpoint')
    return response
  }
}

// In component
import MyService from './api/myService'
const data = await MyService.getMyData()
```

### Use Lazy Loading
```bash
import { createLazyComponent } from './utils/lazyLoading'

const LazyMyComponent = createLazyComponent(
  () => import('./components/MyComponent'),
  'MyComponent'
)

// Use in JSX
<LazyMyComponent {...props} />
```

---

## 🔍 Debugging

### Debug in Browser DevTools
```bash
npm run dev
# Open DevTools (F12)
# Use React DevTools extension
# Use Network tab to inspect API calls
```

### Debug Tests
```bash
npm run test:ui
# Click test to see details
# Check console output
```

### Debug MSW (Mock APIs)
```bash
# Check MSW is intercepting:
# DevTools > Network tab
# Should see requests marked as "from service worker"

# Enable debug mode:
# VITE_DEBUG_MODE=true npm run dev
```

### Check Environment Variables
```bash
# In browser console:
console.log(import.meta.env)
```

---

## 📦 Git Workflow

### Before Committing
```bash
# Hooks run automatically:
# 1. ESLint --fix
# 2. Prettier --write
# 3. Tests must pass

# If hooks fail, fix issues and retry:
git add .
git commit -m "message"
```

### Bypass Hooks (Not Recommended)
```bash
git commit --no-verify
```

### View Git Status
```bash
git status
git diff                    # Show unstaged changes
git diff --cached          # Show staged changes
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Dev server on different port
npm run dev -- --port 3000
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset to Clean State
```bash
npm run format
npm run lint:fix
npm run test
npm run build
```

### Check for Errors
```bash
npm run lint
npm audit
npm run test
```

---

## 🌐 Environment Variable Cheat Sheet

| Variable | Purpose | Dev Value | Prod Value |
|----------|---------|-----------|------------|
| `VITE_API_URL` | API base URL | http://localhost:3001/api | https://api.example.com |
| `VITE_USE_MSW` | Enable mock APIs | true | false |
| `VITE_DEBUG_MODE` | Enable debug logs | true | false |
| `VITE_APP_ENV` | Environment name | development | production |
| `VITE_BACKEND_AUTH` | Enable real auth | false | true |
| `VITE_SENTRY_DSN` | Error tracking | (empty) | https://your-sentry-dsn |

---

## 📞 Getting Help

### Common Issues

**"Module not found" error**
```bash
npm install
# Restart dev server
```

**Tests not running**
```bash
npm run test -- --clearCache
```

**Build fails**
```bash
npm run lint:fix
npm run format
npm run build
```

**Port in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Check Logs
- Browser console (F12)
- Terminal output
- DevTools Network tab
- Sentry dashboard (production errors)

---

## ✅ Pre-Deployment Checklist

Before pushing to production:

```bash
# 1. Format code
npm run format

# 2. Run tests
npm run test:coverage

# 3. Check linting
npm run lint

# 4. Build production
npm run build

# 5. Preview production
npm run preview

# 6. Run accessibility audit
npm run a11y:audit

# 7. Check security
npm audit

# 8. Verify no errors in console
# Open http://localhost:4173 and check browser console
```

---

## 🎯 Performance Tips

### Dev Mode
- Use `npm run dev` with MSW mock APIs
- Enable React DevTools Profiler
- Check Network tab for slow requests
- Monitor bundle size with `npm run analyze`

### Production
- Always run `npm run build` before deployment
- Test with `npm run preview`
- Monitor with Sentry dashboard
- Check Core Web Vitals in production

### Bundle Size
```bash
npm run analyze
# Look for large dependencies
# Consider lazy loading large components
```

---

## 📚 Useful Links

- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [Storybook Documentation](https://storybook.js.org)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MSW Documentation](https://mswjs.io)

---

## 💡 Pro Tips

1. **Use Storybook for UI development** - isolated component development
2. **Run tests in UI mode** - easier debugging
3. **Use `npm run lint:fix`** - auto-fix common issues
4. **Enable pre-commit hooks** - catch issues before commit
5. **Use browser DevTools Profiler** - find performance bottlenecks
6. **Keep feature flags for backend features** - easy toggle when ready
7. **Use mock server for frontend dev** - no backend dependency
8. **Check bundle analyzer** - identify large imports

---

## 📋 Command Cheat Sheet

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Run tests | `npm run test` |
| Fix lint | `npm run lint:fix` |
| Format code | `npm run format` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| View stories | `npm run storybook` |
| Analyze bundle | `npm run analyze` |
| Coverage report | `npm run test:coverage` |
| A11y audit | `npm run a11y:audit` |

---

**Last Updated:** November 27, 2025  
**For Questions:** Refer to documentation guides above
