# UI Components Specification - Government Style

## Box & Card Shapes

### Cards & Panels

#### Shape
- **Border Radius**: `rounded-lg` (8px)
- **Border**: `border-2 border-gray-200` (2px solid)
- **Background**: `bg-white`

#### Elevation (Drop Shadow)
- **Default Cards**: `shadow-lg` (prominent shadow)
- **Hover State**: `shadow-xl` (intensified shadow)
- **Modal/Overlay**: `shadow-2xl` (maximum elevation)
- **Small Components**: `shadow-md` (medium shadow)
- **Subtle Elements**: `shadow-sm` (light shadow)

#### Spacing
- **Card Padding**: `p-6` (1.5rem / 24px) for main cards
- **Small Card Padding**: `p-4` (1rem / 16px) for compact cards
- **Card Gap**: `space-y-6` or `gap-6` (1.5rem between cards)
- **Section Spacing**: `space-y-8` (2rem between major sections)

#### Dividers
- **Horizontal Lines**: `border-t-2 border-gray-200`
- **Color Block Dividers**: `border-b border-amber-500` (accent color)
- **Section Separators**: `border-t border-gray-200` with `pt-4` or `pt-6`

### Buttons

#### Primary CTA Buttons (Pill Shape)
```css
rounded-full          /* Fully rounded edges (pill) */
px-6 py-3            /* Generous padding */
shadow-lg            /* Prominent shadow */
hover:shadow-xl      /* Intensified on hover */
transform hover:scale-105  /* Slight scale up */
transition-all       /* Smooth transitions */
```

**Example Classes**:
```jsx
className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all"
```

#### Secondary Buttons (Rounded Rectangle)
```css
rounded-lg           /* Mild rounded corners (8px) */
px-4 py-2           /* Standard padding */
border-2            /* Visible border */
shadow-sm           /* Light shadow */
hover:shadow-md     /* Medium shadow on hover */
```

**Example Classes**:
```jsx
className="border-2 border-green-600 text-green-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:shadow-md hover:bg-green-50 transition-all"
```

#### Navigation Buttons (Sidebar)
```css
rounded-lg           /* 8px corners */
px-4 py-3           /* Comfortable padding */
shadow-sm           /* Subtle elevation */
hover:shadow-md     /* Enhanced on hover */
hover:bg-gray-100   /* Background darkens */
```

**Active State**:
```css
bg-green-50         /* Light green background */
text-green-800      /* Dark green text */
border-l-4 border-green-600  /* Left accent border */
```

### Input Fields

#### Text Inputs (Rounded Rectangle)
```css
rounded-lg           /* Mild rounded (8px) */
border-2 border-gray-300  /* Visible border */
p-3.5              /* Generous padding */
shadow-sm           /* Light shadow */
hover:shadow-md     /* Enhanced on hover */
focus:ring-2 focus:ring-green-600  /* Focus state */
```

**Example Classes**:
```jsx
className="w-full p-3.5 rounded-lg border-2 border-gray-300 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm hover:shadow-md transition-all"
```

#### Select Dropdowns
```css
rounded-lg           /* 8px corners */
border-2            /* Prominent border */
p-3.5              /* Matching input padding */
shadow-sm           /* Light shadow */
hover:shadow-md     /* Enhanced on hover */
```

### Search Bar

#### Specifications
```css
rounded-lg           /* 8px corners */
border-2 border-gray-300  /* Outlined */
shadow-sm           /* Light shadow */
px-4 py-2           /* Comfortable padding */
```

**With Embedded Icon**:
```jsx
<div className="relative">
  <input className="pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md" />
  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
</div>
```

## Hover States

### Shadow Intensification
| Component | Default | Hover |
|-----------|---------|-------|
| Cards | `shadow-lg` | `shadow-xl` |
| Buttons (Primary) | `shadow-lg` | `shadow-xl` |
| Buttons (Secondary) | `shadow-sm` | `shadow-md` |
| Input Fields | `shadow-sm` | `shadow-md` |
| Navigation Items | `shadow-sm` | `shadow-md` |

### Background Color Changes
| Component | Default | Hover |
|-----------|---------|-------|
| Primary Button | `bg-green-600` | `bg-green-700` |
| Secondary Button | `bg-white` | `bg-green-50` |
| Navigation Item | `bg-transparent` | `bg-gray-100` |
| Link | `text-blue-900` | `text-amber-600` |

### Transform Effects
```css
transform hover:scale-105     /* Primary buttons */
transform hover:scale-102     /* Cards (subtle) */
```

### Link Hover States
```css
hover:underline              /* Underline on hover */
transition-colors            /* Smooth color transition */
```

## Implementation Examples

### Main Card
```jsx
<div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6 space-y-4">
  <h2 className="text-xl font-black text-blue-950 uppercase tracking-wide">
    Card Title
  </h2>
  <div className="border-t-2 border-gray-200 pt-4">
    Card Content
  </div>
</div>
```

### Primary CTA Button
```jsx
<button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-4 rounded-full transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 uppercase tracking-widest text-sm">
  Submit
</button>
```

### Secondary Button
```jsx
<button className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-700 font-bold shadow-sm hover:shadow-md hover:bg-green-50 transition-all">
  Cancel
</button>
```

### Input Field
```jsx
<input 
  type="text"
  className="w-full p-3.5 rounded-lg border-2 border-gray-300 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm hover:shadow-md transition-all font-medium"
  placeholder="Enter text"
/>
```

### Navigation Item
```jsx
<button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wide shadow-sm hover:shadow-md ${
  active 
    ? 'bg-green-50 text-green-800 border-l-4 border-green-600' 
    : 'text-gray-700 hover:bg-gray-100'
}`}>
  <Icon size={18} /> Menu Item
</button>
```

### Card with Divider
```jsx
<div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
  <div className="bg-blue-900 p-4 border-b border-amber-500">
    <h3 className="font-bold text-white">Header</h3>
  </div>
  <div className="p-6 space-y-4">
    Content
  </div>
  <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
    Footer
  </div>
</div>
```

## Spacing System

### Card Spacing
- **Internal Padding**: `p-4` to `p-6`
- **Between Elements**: `space-y-4` (1rem)
- **Between Sections**: `space-y-6` (1.5rem)
- **Between Cards**: `gap-6` or `space-y-6`

### Button Spacing
- **Horizontal Padding**: `px-4` to `px-6`
- **Vertical Padding**: `py-2` to `py-4`
- **Icon Gap**: `gap-2` (0.5rem)

### Input Spacing
- **Padding**: `p-3` to `p-3.5`
- **Label Margin**: `mb-2`
- **Field Gap**: `space-y-4` or `space-y-5`

## Border Specifications

### Border Width
- **Cards**: `border-2` (2px)
- **Inputs**: `border-2` (2px)
- **Dividers**: `border-t-2` or `border-b` (1-2px)
- **Accent Borders**: `border-l-4` (4px for active states)

### Border Colors
- **Default**: `border-gray-200` or `border-gray-300`
- **Focus**: `border-green-600`
- **Accent**: `border-amber-500`
- **Active**: `border-green-600`

## Shadow Scale

| Class | Use Case |
|-------|----------|
| `shadow-sm` | Subtle elevation, input fields |
| `shadow-md` | Medium elevation, hover states |
| `shadow-lg` | Prominent elevation, main cards |
| `shadow-xl` | High elevation, hover on cards |
| `shadow-2xl` | Maximum elevation, modals |

## Transition Properties

### Standard Transition
```css
transition-all       /* All properties */
duration-300        /* 300ms (default) */
```

### Specific Transitions
```css
transition-colors    /* Color changes only */
transition-shadow    /* Shadow changes only */
transition-transform /* Transform changes only */
```

## Files Modified

1. `src/components/auth/LoginScreen.jsx`
   - Updated card radius to 8px
   - Changed buttons to pill shape
   - Enhanced shadows
   - Added hover effects

2. `src/App.jsx`
   - Updated all cards to 8px radius
   - Enhanced card shadows
   - Updated button styles
   - Added hover states
   - Improved spacing

## Accessibility Notes

- All interactive elements have visible focus states
- Shadow changes provide visual feedback
- Color changes meet contrast requirements
- Transform effects are subtle to avoid motion sickness
- Reduced motion respected (can be added with `prefers-reduced-motion`)

## Browser Compatibility

- Border radius: All modern browsers
- Box shadow: All modern browsers
- Transform: All modern browsers (IE11+)
- Transitions: All modern browsers (IE10+)

