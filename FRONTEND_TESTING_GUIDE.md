# Frontend Testing Strategy & Guide

## Testing Stack

| Layer       | Tool                            | Purpose                                   |
| ----------- | ------------------------------- | ----------------------------------------- |
| Unit        | Vitest                          | Test utilities, hooks, pure functions     |
| Component   | Vitest + @testing-library/react | Test component rendering and interactions |
| Integration | Vitest + MSW                    | Test API interactions and data flows      |
| E2E         | Playwright                      | Test complete user journeys               |
| A11y        | axe-core                        | Test accessibility compliance             |
| Performance | Lighthouse                      | Measure performance metrics               |

## Unit Testing

### Test Setup

```bash
npm run test
npm run test:ui        # Open interactive UI
npm run test:coverage  # Generate coverage report
```

### Hook Tests

Already created tests for:

- `useAuth` - Authentication state and methods
- `useLanguage` - Language switching
- `useOffline` - Offline mode detection

**Add more tests for:**

```javascript
// src/__tests__/hooks.useTheme.test.js
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../hooks/useAppState';

describe('useTheme Hook', () => {
  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });
});
```

### Utility Function Tests

```javascript
// src/__tests__/utils.helpers.test.js
import { describe, it, expect } from 'vitest';
import { getNextDistributionTime } from '../../utils/helpers';

describe('Helper Utilities', () => {
  it('should calculate next distribution time', () => {
    const result = getNextDistributionTime('06:00');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
```

### API Client Tests

```javascript
// src/__tests__/api.apiClient.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient, APIError } from '../../api/apiClient';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set auth token', () => {
    apiClient.setAuthToken('test-token');
    expect(apiClient.getAuthToken()).toBe('test-token');
  });

  it('should throw APIError on 401', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await expect(apiClient.get('/protected')).rejects.toThrow(APIError);
  });
});
```

## Component Testing

### Snapshot Tests

```javascript
// src/__tests__/components.StatCard.test.js
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatCard } from '../../components/shared/StatCard';
import { Activity } from 'lucide-react';

describe('StatCard Component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <StatCard icon={Activity} label="Water Pumped" value="2,458" unit="Liters" status="normal" />
    );
    expect(container).toMatchSnapshot();
  });
});
```

### Behavior Tests

```javascript
// src/__tests__/components.LoginScreen.test.js
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginScreen } from '../../components/auth/LoginScreen';

describe('LoginScreen Component', () => {
  it('should submit login form', async () => {
    const { container } = render(<LoginScreen />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/login/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
```

## Integration Testing

### API Integration with MSW

```javascript
// src/__tests__/integration.auth.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import { worker } from '../../api/mswSetup';
import AuthService from '../../api/authService';

describe('Authentication Integration', () => {
  beforeAll(() => worker.listen());

  it('should login successfully', async () => {
    const response = await AuthService.login('test@example.com', 'password');

    expect(response.data.user).toBeDefined();
    expect(response.data.token).toBeDefined();
  });

  it('should handle login error', async () => {
    // Add error handler to MSW for this test
    expect(() => {
      AuthService.login('invalid', 'invalid');
    }).rejects.toThrow();
  });
});
```

### Data Flow Integration

```javascript
// src/__tests__/integration.dashboardFlow.test.js
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppContextProvider } from '../../context/AppContext';
import { TechnicianDashboard } from '../../components/dashboards';

describe('Dashboard Data Flow', () => {
  it('should load and display dashboard data', async () => {
    const { container } = render(
      <AppContextProvider>
        <TechnicianDashboard sensors={{}} activeView="overview" setActiveView={() => {}} />
      </AppContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/water/i)).toBeInTheDocument();
    });
  });
});
```

## E2E Testing with Playwright

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

### Example Tests

```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.fill('input[type="email"]', 'tech@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  it('should show error on invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:text("Login")');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});

test.describe('Dashboard Navigation', () => {
  test('should switch between tabs', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173');
    // ... login steps ...

    // Switch tabs
    await page.click('button:text("Infrastructure")');
    await expect(page.locator('text=Pipeline Status')).toBeVisible();

    await page.click('button:text("Services")');
    await expect(page.locator('text=Service Requests')).toBeVisible();
  });
});
```

### Run E2E Tests

```bash
npx playwright test
npx playwright test --ui  # Interactive mode
```

## Accessibility Testing

### Automated Testing

```bash
npm run a11y:audit
```

### Manual Checklist

- [ ] Tab navigation covers all interactive elements
- [ ] Focus indicator visible on all focusable elements
- [ ] No keyboard traps (user can't get stuck)
- [ ] Form labels properly associated
- [ ] Color contrast adequate (4.5:1 for text)
- [ ] No information conveyed by color alone
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Headings in proper hierarchy
- [ ] Tables have headers and row scope
- [ ] Modals trap focus

### Screen Reader Testing

Test with:

- NVDA (Windows, free)
- JAWS (Windows, commercial)
- VoiceOver (macOS/iOS, built-in)

## Performance Testing

### Lighthouse

```bash
npm run build
npm run preview
# Open DevTools > Lighthouse > Generate Report
```

### Targets

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Core Web Vitals

Monitor in production with web-vitals library:

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Test Coverage Goals

| Category     | Target | Priority |
| ------------ | ------ | -------- |
| Utilities    | 95%    | High     |
| Hooks        | 90%    | High     |
| Components   | 80%    | High     |
| API Services | 90%    | High     |
| Total        | 85%    | High     |

## Continuous Integration

Tests run automatically on:

- Every push to `develop` or `main`
- Every pull request
- Before deployment

See `.github/workflows/ci.yml` for full pipeline.

## Quick Reference

```bash
# Run all tests
npm run test

# Watch mode (auto-rerun on changes)
npm run test -- --watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage

# Run specific test file
npm run test -- hooks.useAuth.test.js

# Run accessibility audit
npm run a11y:audit

# Run E2E tests
npx playwright test

# Run E2E in UI mode
npx playwright test --ui
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com)
- [Playwright Docs](https://playwright.dev)
- [axe-core Docs](https://github.com/dequelabs/axe-core)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated:** November 27, 2025
