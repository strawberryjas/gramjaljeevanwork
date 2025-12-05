# Frontend Environment & Security Configuration

## Environment Variables

Create `.env.local` for local development (git-ignored):

```bash
# .env.local

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Backend Feature Flags (set to 'true' when backend ready)
VITE_BACKEND_AUTH=false
VITE_BACKEND_PIPELINE_DATA=false
VITE_BACKEND_SERVICE_REQUESTS=false
VITE_BACKEND_ENERGY_MONITORING=false

# Mock API (for frontend-only development)
VITE_USE_MSW=true

# App Environment
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0

# Debug Mode
VITE_DEBUG_MODE=false

# Sentry Error Monitoring (optional)
VITE_SENTRY_DSN=

# Analytics (optional)
VITE_ANALYTICS_ID=

# Feature Flags
VITE_BETA_ANALYTICS=false
VITE_BETA_ADVANCED_MAPPING=false
```

### Environment Files by Stage

**Development (.env.local - git-ignored)**

```bash
VITE_API_URL=http://localhost:3001/api
VITE_USE_MSW=true
VITE_DEBUG_MODE=true
VITE_APP_ENV=development
```

**Staging (.env.staging)**

```bash
VITE_API_URL=https://api-staging.example.com
VITE_BACKEND_AUTH=true
VITE_BACKEND_PIPELINE_DATA=true
VITE_APP_ENV=staging
VITE_SENTRY_DSN=https://your-staging-sentry-dsn
```

**Production (.env.production)**

```bash
VITE_API_URL=https://api.example.com
VITE_BACKEND_AUTH=true
VITE_BACKEND_PIPELINE_DATA=true
VITE_BACKEND_SERVICE_REQUESTS=true
VITE_BACKEND_ENERGY_MONITORING=true
VITE_APP_ENV=production
VITE_SENTRY_DSN=https://your-production-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
VITE_DEBUG_MODE=false
```

### Using Environment Variables in Code

```javascript
// Access in components
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction = import.meta.env.VITE_APP_ENV === 'production';

// Check feature flags
import { isFeatureEnabled } from './api/featureFlags';
if (isFeatureEnabled('BACKEND_AUTH')) {
  // Use real auth
}

// Conditional rendering
import { isFeatureEnabled } from './api/featureFlags';
export function MyComponent() {
  if (!isFeatureEnabled('BETA_ANALYTICS')) {
    return null;
  }
  return <AnalyticsComponent />;
}
```

## Security Checklist

### 1. Never Commit Secrets

❌ **DO NOT:**

```javascript
const API_TOKEN = 'sk_live_abc123'; // NEVER commit this
const DB_PASSWORD = 'mypassword'; // NEVER commit this
```

✅ **DO:**

```javascript
const API_TOKEN = import.meta.env.VITE_API_TOKEN; // Use env vars
```

### 2. Frontend vs Backend Secrets

| Secret Type       | Storage          | Why                      |
| ----------------- | ---------------- | ------------------------ |
| API Keys (public) | .env             | Frontend uses these      |
| JWT Tokens        | httpOnly cookies | Prevents XSS theft       |
| Passwords         | Backend only     | Never expose to frontend |
| DB Credentials    | Backend only     | Never expose to frontend |
| Private Keys      | Backend only     | Server-side only         |

### 3. Token Management

**Current Implementation (localStorage):**

```javascript
// Good for: Development, non-sensitive tokens
localStorage.setItem('auth_token', token);
```

**When Backend Ready (httpOnly Cookies):**

```javascript
// Better for production: Server sets secure, httpOnly cookie
// Frontend doesn't have direct access
// Protected from XSS attacks
```

**Migration Steps:**

1. Backend returns token in httpOnly cookie
2. Frontend removes localStorage auth storage
3. Fetch automatically includes cookies in requests
4. Update `apiClient` to work with cookies instead of headers

### 4. XSS Prevention

❌ **Vulnerable:**

```javascript
// NEVER use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

✅ **Safe:**

```javascript
// React escapes by default
<div>{userInput}</div>;

// Or use sanitization library
import DOMPurify from 'dompurify';
<div>{DOMPurify.sanitize(userInput)}</div>;
```

### 5. CSRF Protection

✅ **Ensure Backend:**

```javascript
// Backend should validate:
// 1. Origin header matches expected domain
// 2. Referer header is from same site
// 3. CSRF token in request body for state-changing operations
```

### 6. Content Security Policy (CSP)

**Backend sets CSP headers:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  font-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
```

### 7. Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies safely
npm update

# Check for outdated packages
npm outdated
```

**Regular Maintenance:**

- Check security advisories monthly
- Update dependencies before major releases
- Pin dependency versions in package-lock.json
- Test updates in staging before production

### 8. API Security

✅ **Good Practices:**

```javascript
// Rate limiting enforced on backend
// Timeout on requests
const DEFAULT_TIMEOUT = 30000;

// Retry only on safe operations
const isRetryable = error.statusCode >= 500;

// Clear sensitive data from logs
console.log('Token: ' + token); // ❌ Bad
console.log('Logged in'); // ✅ Good
```

### 9. Sensitive Data in Components

❌ **Never store passwords, tokens, or secrets in state:**

```javascript
const [password, setPassword] = useState(''); // Only in controlled input
```

✅ **Correct approach:**

```javascript
// Store token in secure storage (httpOnly cookie)
// Clear immediately after use
const handleLogin = (credentials) => {
  const result = await authService.login(credentials)
  // Token auto-stored by service
  // Clear local password variable
}
```

### 10. Third-Party Scripts

**Libraries used (verify security):**

- `react` - Widely trusted, well-maintained
- `recharts` - Open source, audited
- `lucide-react` - Simple icon library, no external calls
- `msw` - Development only, doesn't ship to production

**Before adding new library:**

1. Check npm security scores
2. Check GitHub stars and maintenance
3. Check `package.json` for suspicious dependencies
4. Scan with `npm audit`
5. Use limited APIs, not entire library

## Monitoring Security

### Error Monitoring

```javascript
import { initSentry } from './utils/sentry';

// Initialize Sentry to track errors in production
initSentry();
```

### Logging Best Practices

```javascript
// ✅ Safe
console.log('User logged in');
console.log('API request to:', endpoint);

// ❌ Dangerous
console.log('Token:', authToken);
console.log('Password:', password);
console.log('User data:', userData); // May contain PII
```

## Deployment Security

### Pre-deployment Checklist

- [ ] `npm audit` shows no critical vulnerabilities
- [ ] No hardcoded secrets in code
- [ ] Environment variables configured for production
- [ ] API endpoints use HTTPS
- [ ] CORS properly configured on backend
- [ ] Rate limiting enabled
- [ ] Error monitoring (Sentry) configured
- [ ] No debug mode enabled in production

### Build Verification

```bash
# Check for exposed secrets
npm run build
grep -r "password\|token\|secret" dist/ || echo "No secrets found"

# Verify no console statements
grep -r "console\." src/ | grep -v ".test\|.spec" || echo "Clean"

# Check bundle size
npm run analyze
```

## Privacy Considerations

### Data Minimization

Only collect what's needed:

- ✅ User login, role, preferences
- ❌ Password history
- ❌ Device information (unless needed)
- ❌ Location tracking (unless needed for map)

### User Consent

```javascript
// For analytics, ask permission first
const consentGiven = localStorage.getItem('analytics_consent');
if (consentGiven) {
  // Initialize analytics
}
```

### GDPR Compliance

- [ ] Privacy policy available
- [ ] Data processing agreement with vendors
- [ ] User can request data export
- [ ] User can request data deletion
- [ ] Clear cookie/consent management

## Security Incident Response

If security issue detected:

1. **Identify** - Determine scope and severity
2. **Contain** - Stop further exposure
3. **Fix** - Patch the issue
4. **Audit** - Check for similar issues
5. **Notify** - Inform users if needed
6. **Learn** - Update processes

### Contact

Security issues: security@example.com (not public issues)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://react.dev/learn#security)
- [npm Security](https://docs.npmjs.com/cli/audit)
- [GDPR Checklist](https://gdpr-info.eu/)

---

**Last Updated:** November 27, 2025
**Status:** Complete
