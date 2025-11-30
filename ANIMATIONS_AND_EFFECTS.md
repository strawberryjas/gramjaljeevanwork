# Animations & Effects Implementation

## Overview
This document details all animations, transitions, and interactive effects implemented throughout the website following government design standards.

## Transition System

### Standard Transition Duration
```css
transition-all duration-300  /* 300ms for most interactions */
transition-all duration-500  /* 500ms for page-level animations */
```

### Transition Properties
- **All Properties**: `transition-all` (background, shadow, transform, etc.)
- **Specific**: `transition-colors`, `transition-shadow`, `transition-transform`

## Button Animations

### Primary CTA Buttons
```jsx
className="
  transition-all duration-300
  shadow-lg hover:shadow-2xl
  transform hover:scale-105 active:scale-95
  hover:bg-green-700
"
```

**Effects**:
1. **Hover**: 
   - Shadow intensifies (`shadow-lg` → `shadow-2xl`)
   - Background darkens
   - Scale up 5% (`scale-105`)
2. **Active/Click**: 
   - Scale down 5% (`scale-95`)
   - Provides tactile feedback

### Secondary Buttons
```jsx
className="
  transition-all duration-300
  shadow-sm hover:shadow-md
  hover:bg-green-50
"
```

**Effects**:
1. Background color change
2. Shadow elevation increase

### Navigation Buttons
```jsx
className="
  transition-all duration-300
  shadow-sm hover:shadow-md
  hover:bg-gray-100
"
```

**Effects**:
1. Background color fade-in
2. Shadow increase
3. Smooth color transition

### Icon Buttons
```jsx
className="
  transition-all duration-300
  transform hover:scale-110
"
```

**Effects**:
- Scale up 10% on hover
- Smooth transformation

## Card Animations

### Main Cards
```jsx
className="
  transition-all duration-300
  hover:shadow-xl
"
```

**Effects**:
1. **Default**: `shadow-lg`
2. **Hover**: `shadow-xl` (elevated appearance)
3. **Smooth transition**: 300ms

### Interactive Cards
```jsx
className="
  transition-all duration-300
  transform hover:scale-105
  cursor-pointer
  hover:shadow-xl
"
```

**Effects**:
1. Shadow intensifies
2. Slight scale up (5%)
3. Cursor changes to pointer
4. Smooth 300ms transition

### Small Cards/Tiles
```jsx
className="
  transition-all duration-300
  transform hover:scale-102
  hover:shadow-xl
"
```

**Effects**:
- Subtle scale (2%) for smaller elements
- Shadow elevation

## Input Field Animations

### Text Inputs
```jsx
className="
  transition-all duration-300
  shadow-sm hover:shadow-md
  focus:scale-105
  focus:ring-2 focus:ring-green-600
"
```

**Effects**:
1. **Hover**: Shadow increases
2. **Focus**: 
   - Ring appears (2px green)
   - Slight scale up (5%)
   - Border color changes

### Select Dropdowns
```jsx
className="
  transition-all duration-300
  shadow-sm hover:shadow-md
"
```

**Effects**:
- Shadow elevation on hover
- Smooth transition

## Loading Animations

### Spinner
```jsx
<div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
```

**Properties**:
- Continuous rotation
- Transparent top border creates spinning effect
- Used in loading buttons

### Button Loading State
```jsx
{loading ? (
  <>
    <div className="animate-spin ..."></div>
    Verifying...
  </>
) : (
  <>Access Dashboard</>
)}
```

## Icon Animations

### Chevron/Arrow Icons
```jsx
<ChevronRight className="transition-transform group-hover:translate-x-1" />
```

**Effects**:
- Slides right 0.25rem on parent hover
- Indicates forward action

### Download Icon
```jsx
<Download className="transition-transform group-hover:translate-y-1" />
```

**Effects**:
- Moves down on hover
- Reinforces download action

### File Icon
```jsx
<File className="transition-transform group-hover:rotate-12" />
```

**Effects**:
- Rotates 12 degrees on hover
- Adds playful interaction

### Eye Icon (Password Toggle)
```jsx
className="transition-all duration-300 transform hover:scale-110"
```

**Effects**:
- Scales up 10% on hover
- Smooth transformation

## Page-Level Animations

### Login Page Entry
```jsx
className="
  transition-all duration-500
  animate-in fade-in slide-in-from-bottom-4
"
```

**Effects**:
1. Fades in from 0 to 100% opacity
2. Slides up from bottom (1rem)
3. 500ms duration for smooth entry

### Modal/Overlay Animations
```jsx
className="animate-in fade-in slide-in-from-right-4"
```

**Effects**:
- Fades in
- Slides from right
- Smooth appearance

## Hover State Specifications

### Shadow Intensification
| Element | Default | Hover | Duration |
|---------|---------|-------|----------|
| Primary Button | `shadow-lg` | `shadow-2xl` | 300ms |
| Card | `shadow-lg` | `shadow-xl` | 300ms |
| Input | `shadow-sm` | `shadow-md` | 300ms |
| Navigation | `shadow-sm` | `shadow-md` | 300ms |

### Background Color Transitions
| Element | Default | Hover | Duration |
|---------|---------|-------|----------|
| Primary Button | `bg-green-600` | `bg-green-700` | 300ms |
| Secondary Button | `bg-white` | `bg-green-50` | 300ms |
| Navigation | `transparent` | `bg-gray-100` | 300ms |
| Link | - | `text-amber-600` | 300ms |

### Transform Effects
| Element | Hover | Active | Duration |
|---------|-------|--------|----------|
| Primary Button | `scale-105` | `scale-95` | 300ms |
| Card (Large) | `scale-105` | - | 300ms |
| Card (Small) | `scale-102` | - | 300ms |
| Icon | `scale-110` | - | 300ms |

## Focus States

### Input Focus
```css
focus:ring-2 focus:ring-green-600
focus:border-green-600
focus:scale-105
transition-all duration-300
```

**Visual Feedback**:
1. Green ring appears (2px)
2. Border color changes to green
3. Slight scale increase
4. Smooth 300ms transition

### Button Focus
```css
focus:outline-none
focus:ring-2 focus:ring-green-600
focus:ring-offset-2
```

**Accessibility**:
- Clear focus indicator
- Meets WCAG standards
- Visible keyboard navigation

## Active States

### Button Press
```css
active:scale-95
```

**Effect**:
- Scales down to 95%
- Provides tactile feedback
- Immediate response (no delay)

### Link Press
```css
active:text-green-800
```

**Effect**:
- Color darkens on click
- Visual confirmation

## Easing Functions

### Default Easing
- **Tailwind Default**: `ease-in-out`
- Smooth acceleration and deceleration

### Custom Timing
```css
transition-all duration-300  /* Standard */
transition-all duration-500  /* Page-level */
```

## Animation Classes Used

### Tailwind Animate Classes
- `animate-spin` - Continuous rotation (loading spinners)
- `animate-in` - Entry animation
- `fade-in` - Opacity 0 to 100%
- `slide-in-from-bottom-4` - Slide up 1rem
- `slide-in-from-right-4` - Slide left 1rem

### Transform Classes
- `hover:scale-105` - Scale up 5%
- `hover:scale-102` - Scale up 2%
- `hover:scale-110` - Scale up 10%
- `active:scale-95` - Scale down 5%
- `hover:translate-x-1` - Move right 0.25rem
- `hover:translate-y-1` - Move down 0.25rem
- `hover:rotate-12` - Rotate 12 degrees

## Performance Considerations

### Hardware Acceleration
All transforms use GPU acceleration:
```css
transform: scale(1.05);        /* GPU accelerated */
transform: translateX(0.25rem); /* GPU accelerated */
```

### Will-Change (for complex animations)
```css
will-change: transform, opacity;
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Examples

### Animated Button
```jsx
<button className="
  bg-green-600 text-white
  px-6 py-3 rounded-full
  shadow-lg hover:shadow-2xl
  transition-all duration-300
  transform hover:scale-105 active:scale-95
  hover:bg-green-700
">
  Submit
</button>
```

### Animated Card
```jsx
<div className="
  bg-white rounded-lg
  border-2 border-gray-200
  shadow-lg hover:shadow-xl
  transition-all duration-300
  transform hover:scale-102
  cursor-pointer
">
  Card Content
</div>
```

### Animated Input
```jsx
<input className="
  w-full p-3.5 rounded-lg
  border-2 border-gray-300
  shadow-sm hover:shadow-md
  focus:ring-2 focus:ring-green-600
  focus:scale-105
  transition-all duration-300
" />
```

### Animated Icon Button
```jsx
<button className="
  text-gray-500 hover:text-blue-950
  transition-all duration-300
  transform hover:scale-110
">
  <Eye size={20} />
</button>
```

## Carousel/Slider Animations (Future Implementation)

### Slide Transition
```jsx
<div className="
  transition-transform duration-500
  ease-in-out
">
  {/* Slide content */}
</div>
```

### Arrow Buttons
```jsx
<button className="
  transition-all duration-300
  transform hover:scale-110
  hover:bg-gray-100
">
  <ChevronLeft />
</button>
```

### Indicators
```jsx
<div className={`
  w-2 h-2 rounded-full
  transition-all duration-300
  ${active ? 'bg-green-600 w-8' : 'bg-gray-300'}
`} />
```

## Best Practices

1. **Consistent Duration**: Use 300ms for most interactions
2. **Subtle Transforms**: Keep scale changes between 2-10%
3. **Shadow Progression**: Follow the shadow scale (sm → md → lg → xl → 2xl)
4. **Active States**: Always provide feedback on click/press
5. **Focus Indicators**: Ensure keyboard navigation is visible
6. **Performance**: Use transform and opacity for animations
7. **Accessibility**: Respect `prefers-reduced-motion`

## Files Modified

1. `src/App.jsx`
   - Added `duration-300` to all transitions
   - Added `active:scale-95` to buttons
   - Added hover shadow effects to cards
   - Added transform effects

2. `src/components/auth/LoginScreen.jsx`
   - Added page entry animation
   - Added button press feedback
   - Added icon micro-animations
   - Added loading spinner
   - Added input focus effects

## Browser Support

- **Transitions**: All modern browsers
- **Transforms**: All modern browsers (IE11+)
- **Animations**: All modern browsers
- **Will-change**: Chrome 36+, Firefox 36+, Safari 9.1+

## Accessibility

- All animations respect `prefers-reduced-motion`
- Focus states are clearly visible
- Active states provide feedback
- Keyboard navigation supported
- Screen reader friendly (animations don't interfere)

