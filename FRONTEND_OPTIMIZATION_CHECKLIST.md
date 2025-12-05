# Frontend Optimization Checklist & Guidelines

## Performance Optimization

### Bundle Size & Code Splitting

- [x] Configured vite-plugin-visualizer for bundle analysis
- [ ] Run `npm run analyze` to generate bundle report
- [x] Set up manual chunks for vendor libraries (react, recharts, lucide-react)
- [ ] Identify and extract large dynamic imports (dashboards, map, charts)
- [ ] Test bundle size in production build

**Action Items:**

```bash
npm run build
npm run analyze
```

### Lazy Loading

- [x] Created `src/utils/lazyLoading.js` utilities
- [ ] Apply lazy loading to dashboard routes
- [ ] Add lazy loading to heavy components (PipelineMapViewer, GaugeChart)
- [ ] Implement Suspense boundaries with fallbacks
- [ ] Add error boundaries for failed lazy loads

**Example:**

```javascript
import { createLazyComponent } from './utils/lazyLoading';

const LazyTechnicianDashboard = createLazyComponent(
  () => import('./components/dashboards/TechnicianDashboard'),
  'TechnicianDashboard'
);
```

### Image & Asset Optimization

- [ ] Compress images with WebP format support
- [ ] Add responsive images with srcset
- [ ] Lazy load images below the fold
- [ ] Optimize SVG files (remove metadata, minify)
- [ ] Cache static assets with Service Workers

### CSS & Tailwind

- [x] Configured Tailwind purging in vite.config.js
- [ ] Verify no unused Tailwind classes in production
- [ ] Use CSS-in-JS sparingly (rely on Tailwind utilities)
- [ ] Check for duplicate styles across components

**Verify:**

```bash
npm run build
# Check dist/style.*.css file size in build output
```

### Chart & Map Optimization

- [ ] Virtualize large datasets in charts (use windowing)
- [ ] Debounce chart updates for real-time data
- [ ] Use Leaflet layer clustering for many markers
- [ ] Consider vector tiles instead of raster maps
- [ ] Lazy load map only when visible

### JavaScript Performance

- [ ] Use useMemo for expensive computations
- [ ] Use useCallback for event handlers in lists
- [ ] Avoid inline function definitions in JSX
- [ ] Remove console.logs in production
- [ ] Profile with React DevTools Profiler

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation

- [x] Created a11y utilities in `src/utils/a11y.js`
- [ ] Test all interactive elements with keyboard Tab navigation
- [ ] Implement focus trapping in modals
- [ ] Add skip-to-content link
- [ ] Ensure logical tab order

**Check:**

```javascript
import { useKeyboardNavigation } from './utils/a11y';
```

### ARIA & Semantic HTML

- [ ] Use semantic HTML tags (button, nav, main, aside)
- [ ] Add aria-label for icon-only buttons
- [ ] Use aria-live for dynamic content
- [ ] Add aria-describedby for form errors
- [ ] Implement role="status" for notifications

### Color Contrast & Vision

- [ ] Verify 4.5:1 contrast ratio for text (WCAG AA)
- [ ] Verify 3:1 contrast ratio for UI components
- [ ] Test both light and dark themes
- [ ] Don't rely solely on color to convey information
- [ ] Support high contrast mode

### Screen Reader Support

- [ ] Alt text for all images
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Form labels associated with inputs
- [ ] Data tables with proper th/td structure
- [ ] Test with NVDA, JAWS, or VoiceOver

### Testing

- [x] Added axe-core integration
- [ ] Run `npm run a11y:audit` before deployment
- [ ] Manual testing with keyboard only
- [ ] Manual testing with screen reader
- [ ] Test with browser zoom (200%)

## Code Quality & Linting

### ESLint & Formatting

- [x] Configured .eslintrc.json
- [x] Configured .prettierrc.json
- [ ] Run linter: `npm run lint`
- [ ] Fix auto-fixable issues: `npm run lint:fix`
- [ ] Format code: `npm run format`

### Pre-commit Hooks

- [x] Configured husky + lint-staged
- [ ] Initialize husky: `npx husky install`
- [ ] Verify hooks run before commits

### Code Style

- [x] Created CODE_STYLE_GUIDE.md (exists in docs)
- [ ] Enforce component file naming (.jsx for React components)
- [ ] Enforce 2-space indentation
- [ ] Enforce single quotes for strings
- [ ] Limit line length to 100 characters

## Testing

### Unit Tests

- [x] Created vitest configuration
- [x] Created tests for useAuth, useLanguage, useOffline hooks
- [ ] Add tests for API client functions
- [ ] Add tests for utility functions
- [ ] Aim for 80%+ code coverage

**Run:**

```bash
npm run test
npm run test:coverage
```

### Component Tests

- [ ] Test StatCard with different props
- [ ] Test LoginScreen authentication flow
- [ ] Test dashboard navigation
- [ ] Test error boundaries

### Integration Tests

- [ ] Test login → dashboard flow
- [ ] Test language switching
- [ ] Test offline mode toggle
- [ ] Test service request creation

**Add Playwright tests in `src/__tests__/integration/`**

### E2E Tests

- [ ] Complete user flows with Playwright/Cypress
- [ ] API integration with mock server
- [ ] Error scenarios and recovery

## CI/CD Pipeline

### GitHub Actions

- [x] Created `.github/workflows/ci.yml`
- [ ] Test on Node 18.x and 20.x
- [ ] Run linter, formatter check, tests
- [ ] Build and upload artifacts
- [ ] Run accessibility audit
- [ ] Run security audit (npm audit)

**Trigger:**

```bash
git push origin feature-branch
```

## Security

### Frontend Security

- [x] No secrets stored in code (use env variables)
- [x] localStorage not used for sensitive tokens (plan httpOnly cookies)
- [ ] Sanitize user input before rendering
- [ ] Use CSP headers on backend
- [ ] Keep dependencies updated

**Check:**

```bash
npm audit
npm audit fix
```

### XSS Prevention

- [ ] Never use dangerouslySetInnerHTML
- [ ] Sanitize HTML from server with DOMPurify if needed
- [ ] Escape user input in templates
- [ ] Use trusted libraries (recharts, lucide-react are safe)

## Documentation

### Developer Experience

- [x] Created API service layer with JSDoc comments
- [x] Created feature flags documentation
- [x] Created lazy loading utilities with examples
- [ ] Create component story examples with Storybook
- [ ] Document environment variables in .env.example

**Storybook:**

```bash
npm run storybook
```

### API Integration Docs

- [x] Created BACKEND_INTEGRATION_GUIDE.md
- [ ] Create OpenAPI/Swagger spec if applicable
- [ ] Document expected API responses
- [ ] Create postman collection for testing
- [ ] Document error codes and handling

## Monitoring & Analytics

### Error Tracking

- [x] Created Sentry setup in `src/utils/sentry.js`
- [ ] Set VITE_SENTRY_DSN in production .env
- [ ] Test error capture with sample error

**Initialize in main.jsx:**

```javascript
import { initSentry } from './utils/sentry';
initSentry();
```

### User Analytics

- [ ] Track key user actions (login, service request created)
- [ ] Track performance metrics (LCP, FID, CLS)
- [ ] Respect privacy and provide opt-out

## Deployment Readiness

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Linter has no errors
- [ ] Build succeeds without warnings
- [ ] Bundle size acceptable
- [ ] Accessibility audit passed
- [ ] Security audit passed
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Error monitoring configured
- [ ] Performance metrics tracked

### Build Optimization

- [ ] Remove development dependencies from production
- [ ] Enable minification and compression
- [ ] Configure CDN caching for static assets
- [ ] Enable Gzip/Brotli compression on server

```bash
npm run build
ls -lh dist/
```

### Performance Targets

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90

## Ongoing Maintenance

### Dependency Management

- [ ] Update dependencies monthly
- [ ] Use `npm audit` to identify vulnerabilities
- [ ] Test major version upgrades in staging
- [ ] Keep lock file committed

### Monitoring

- [ ] Monitor error rates in Sentry
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Review analytics for usage patterns

### Documentation

- [ ] Keep API docs in sync with backend
- [ ] Update CHANGELOG for releases
- [ ] Maintain README for setup instructions
- [ ] Keep onboarding guides current

## Quick Commands Reference

```bash
# Development
npm run dev
npm run storybook

# Testing
npm run test
npm run test:ui
npm run test:coverage

# Code Quality
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Build & Analysis
npm run build
npm run analyze
npm run preview

# Accessibility
npm run a11y:audit

# Deployment
npm run build
npm run preview
```

---

**Last Updated:** November 27, 2025
**Status:** Ready for Implementation
