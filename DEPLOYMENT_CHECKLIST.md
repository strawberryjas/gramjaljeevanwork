# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Quality

- [x] All backup files removed (`App_clean.jsx`, `App.jsx.backup`)
- [x] No console.log statements in production code
- [x] All components have proper error handling
- [x] Default props for all optional parameters
- [x] Proper TypeScript/JSDoc comments (where applicable)
- [x] Code follows style guide (CODE_STYLE_GUIDE.md)

### Testing

- [ ] Manual testing completed for all user roles
  - [ ] Guest dashboard
  - [ ] Technician dashboard
  - [ ] Researcher dashboard
- [ ] All map views tested (Satellite, Street, Hybrid)
- [ ] Login/logout flow verified
- [ ] Language switching tested
- [ ] Offline mode tested
- [ ] Mobile responsiveness verified

### Performance

- [x] Bundle size optimized (< 500KB gzipped)
- [x] Images optimized
- [x] Lazy loading implemented where needed
- [x] Map performance optimized (useRef, cleanup)
- [ ] Lighthouse score > 90

### Security

- [x] No API keys in code
- [x] Input sanitization implemented
- [x] Role-based access control working
- [ ] HTTPS enabled (production)
- [ ] Security headers configured

### Documentation

- [x] README.md updated
- [x] PROJECT_STRUCTURE.md created
- [x] CODE_STYLE_GUIDE.md created
- [x] OPTIMIZATION_GUIDE.md created
- [x] DEPLOYMENT_CHECKLIST.md created

## 🚀 Deployment Steps

### 1. Environment Setup

```bash
# Create .env.production file
VITE_API_URL=https://api.production.com
VITE_MAP_API_KEY=your_production_key
```

### 2. Build Production Bundle

```bash
# Clean previous builds
rm -rf dist/

# Build for production
npm run build

# Verify build output
ls -lh dist/
```

### 3. Test Production Build Locally

```bash
# Preview production build
npm run preview

# Test in browser at http://localhost:4173
```

### 4. Deploy to Hosting Platform

#### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/gramjaljeevanwork",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### 5. Post-Deployment Verification

- [ ] Website loads correctly
- [ ] All images display properly
- [ ] Login works for all roles
- [ ] Map loads and displays correctly
- [ ] Charts render properly
- [ ] Language switching works
- [ ] Mobile view is responsive
- [ ] No console errors

### 6. Performance Testing

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G connection
- [ ] Verify caching headers
- [ ] Check bundle sizes

### 7. Monitoring Setup

- [ ] Error tracking (Sentry, LogRocket)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Performance monitoring (Web Vitals)

## 📊 Production Configuration

### Vite Build Config

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name gramjaljeevan.gov.in;

    root /var/www/gramjaljeevan/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## 🔐 Security Headers

### Recommended Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📱 Mobile Optimization

- [x] Responsive design implemented
- [x] Touch-friendly buttons (min 44x44px)
- [x] Mobile navigation (hamburger menu ready)
- [x] Viewport meta tag configured
- [ ] PWA manifest added (optional)
- [ ] Service worker for offline (optional)

## 🌐 CDN Configuration

### Recommended CDN Setup

1. **Static Assets** - CloudFlare, AWS CloudFront
2. **Images** - Optimize and serve via CDN
3. **Fonts** - Google Fonts CDN (already configured)
4. **Map Tiles** - Google Maps CDN (already configured)

## 📈 Analytics Setup

### Google Analytics

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🐛 Rollback Plan

### If Deployment Fails

1. **Immediate**: Revert to previous version
2. **Check Logs**: Review error logs
3. **Test Locally**: Reproduce issue in dev environment
4. **Fix**: Apply hotfix
5. **Redeploy**: After thorough testing

### Version Control

```bash
# Tag releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Rollback if needed
git revert HEAD
git push origin main
```

## 📞 Support Contacts

- **Technical Lead**: tech-lead@gramjaljeevan.gov.in
- **DevOps**: devops@gramjaljeevan.gov.in
- **Emergency**: +91-XXXX-XXXXXX

## ✅ Final Sign-off

- [ ] Code reviewed by senior developer
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Stakeholders notified
- [ ] Backup plan in place
- [ ] Monitoring configured
- [ ] Ready for production deployment

---

**Deployment Date**: **\*\***\_**\*\***

**Deployed By**: **\*\***\_**\*\***

**Approved By**: **\*\***\_**\*\***

**Version**: 1.0.0
