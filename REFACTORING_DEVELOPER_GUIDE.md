# Refactored App.jsx - Developer Quick Guide

## 🎯 Overview
The App.jsx file has been refactored for better maintainability by extracting reusable components and utilities.

---

## 📁 New File Locations

### Utility Functions
**File:** `src/utils/appUtils.js`

```javascript
import { formatMetric, transformStateToData, toLocalInputString } from './utils/appUtils';

// formatMetric(value, decimals, fallback)
const pressure = formatMetric(3.14159, 2);  // 3.14

// transformStateToData(simulationState)
const uiData = transformStateToData(simulation.state);  // Full data transform

// toLocalInputString(date)
const dateStr = toLocalInputString(new Date());  // "2024-11-30T14:30"
```

### Navigation Component
**File:** `src/components/Navigation.jsx`

```javascript
import { Navigation } from './components/Navigation';

<Navigation
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  user={user}
  mobileMenuOpen={mobileMenuOpen}
  setMobileMenuOpen={setMobileMenuOpen}
  showUserMenu={showUserMenu}
  setShowUserMenu={setShowUserMenu}
  showAccessibility={showAccessibility}
  setShowAccessibility={setShowAccessibility}
  offlineMode={offlineMode}
  lastSync={lastSync}
  handleLogout={handleLogout}
  jalsenseLogoUrl={jalsenseLogoUrl}
/>
```

### Accessibility Panel Component
**File:** `src/components/AccessibilityPanel.jsx`

```javascript
import { AccessibilityPanel } from './components/AccessibilityPanel';

<AccessibilityPanel
  isOpen={showAccessibility}
  onClose={() => setShowAccessibility(false)}
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  textSize={textSize}
  setTextSize={setTextSize}
  highContrast={highContrast}
  setHighContrast={setHighContrast}
  reducedMotion={reducedMotion}
  setReducedMotion={setReducedMotion}
  onReset={handleAccessibilityReset}
/>
```

---

## 🔧 Common Tasks

### Add a New Navigation Item
Edit `src/components/Navigation.jsx`:

```javascript
const PublicNavigation = ({ activeTab, setActiveTab, setMobileMenuOpen, t }) => {
  const navItems = [
    { id: 'overview', label: t('nav.overview'), icon: Activity },
    { id: 'energy', label: t('nav.energy'), icon: Zap },
    // ADD YOUR NEW ITEM HERE:
    { id: 'newTab', label: t('nav.newTab'), icon: YourIcon },
  ];
  // rest of component...
};
```

### Add a New Accessibility Setting
Edit `src/components/AccessibilityPanel.jsx`:

```javascript
// In AccessibilityPanel component, add:
const [fontSize, setFontSize] = useState(16);

// In JSX, add similar to other toggles:
<ToggleControl
  label="New Setting"
  hint="Description"
  isEnabled={newSetting}
  onChange={setNewSetting}
/>
```

### Add a New Utility Function
Edit `src/utils/appUtils.js`:

```javascript
export const myNewFunction = (param1, param2) => {
  // Your logic here
  return result;
};

// In App.jsx, import it:
import { myNewFunction } from './utils/appUtils';
```

---

## 📊 App Component Structure

```javascript
const App = () => {
  // ===== AUTH & CONTEXT =====
  const { user, login, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { offlineMode, lastSync } = useOffline();

  // ===== MAIN APP STATE =====
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ===== ACCESSIBILITY STATE =====
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ===== SIMULATION DATA =====
  const simulation = useSimulationData();
  const data = transformStateToData(simulation.state);

  // ===== HISTORY TRACKING =====
  const [history, setHistory] = useState([]);
  useEffect(() => {
    // Track historical data for charts
  }, [simulation.state?.lastUpdated]);

  // ===== THEME MANAGEMENT =====
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize * 16}px`;
  }, [textSize]);

  // ===== RENDER =====
  return (
    <div>
      <Navigation {...navigationProps} />
      <MainContent />
      <AccessibilityPanel {...accessibilityProps} />
      <VoiceAssistant />
    </div>
  );
};
```

---

## 🧪 Testing Guide

### Test Navigation Component
```javascript
// Test that navigation items render correctly
test('navigation shows correct items for role', () => {
  render(<Navigation user={{ role: 'public' }} />);
  expect(screen.getByText('Overview')).toBeInTheDocument();
});
```

### Test Accessibility Panel
```javascript
// Test text size changes
test('text size slider updates font', () => {
  const { getByRole } = render(<AccessibilityPanel isOpen={true} />);
  const slider = getByRole('slider');
  fireEvent.change(slider, { target: { value: '1.5' } });
  expect(document.documentElement.style.fontSize).toBe('24px');
});
```

### Test Utility Functions
```javascript
// Test formatting
test('formatMetric rounds correctly', () => {
  expect(formatMetric(3.14159, 2)).toBe(3.14);
  expect(formatMetric(123.456, 0)).toBe(123);
});
```

---

## 🚀 Performance Tips

1. **Navigation Component**
   - Already optimized with React.memo
   - Sub-components properly extracted
   - No unnecessary re-renders

2. **AccessibilityPanel Component**
   - Only renders when `isOpen={true}`
   - Modal backdrop prevents clicks below
   - CSS transitions are smooth

3. **Utility Functions**
   - Pure functions (no side effects)
   - Memoized calculations
   - Early returns for edge cases

---

## 🔐 Security Considerations

1. **Navigation**
   - Role-based access (checked in component)
   - Logout properly clears state
   - No sensitive data in URL

2. **Accessibility Panel**
   - Settings stored in localStorage
   - No sensitive data stored
   - XSS protection via React's default escaping

3. **Utilities**
   - Input validation in transformStateToData
   - Safe number parsing with fallbacks
   - No direct eval() or dangerous operations

---

## 📚 Additional Resources

- **App.jsx**: Core application logic
- **Navigation.jsx**: Navigation & menu components
- **AccessibilityPanel.jsx**: Accessibility settings
- **appUtils.js**: Shared utility functions
- **Existing dashboards**: Business logic (unchanged)

---

## ❓ FAQ

**Q: Where do I add new state?**  
A: In App.jsx with other state of the same type (accessibility, main, theme, etc.)

**Q: Where do I add new utility functions?**  
A: In `src/utils/appUtils.js` and export them

**Q: How do I modify navigation?**  
A: Edit `src/components/Navigation.jsx` navItems or sub-components

**Q: Can I use these components elsewhere?**  
A: Yes! They're fully reusable and don't depend on App state

**Q: What if I need to add a new theme setting?**  
A: Add state in App.jsx ACCESSIBILITY STATE section and toggle in AccessibilityPanel

**Q: Is there a limit to accessible features?**  
A: No, you can add as many as needed by extending the components

---

## ✨ Best Practices

1. ✅ Keep App.jsx focused on state & routing
2. ✅ Keep components pure and reusable
3. ✅ Keep utility functions side-effect free
4. ✅ Use proper prop validation
5. ✅ Comment complex logic
6. ✅ Test new features
7. ✅ Follow existing code style

---

**Last Updated:** November 30, 2025  
**Status:** Production Ready  
**Version:** 1.0

