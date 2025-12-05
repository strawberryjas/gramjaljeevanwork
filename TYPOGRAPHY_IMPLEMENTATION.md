# Government Typography Implementation

## Font Families Applied

### Headings: Montserrat

**Usage**: Bold, modern sans-serif with uppercase and high letter spacing

- **Font Weight**: 700-900 (Bold to Black)
- **Transform**: Uppercase
- **Letter Spacing**: `tracking-wide` to `tracking-widest` (0.025em to 0.1em)

**Applied to**:

- Main navigation items (sidebar)
- Section headings
- Page titles
- Form labels
- Button text (primary actions)
- User names
- Card titles
- Modal headers

### Body: Open Sans & Roboto

**Usage**: Clean, geometric sans-serif for readability

- **Font Weight**: 400-700 (Regular to Bold)
- **Transform**: Normal (sentence case)
- **Letter Spacing**: Normal

**Applied to**:

- Body text
- Paragraphs
- Descriptions
- Input fields
- Helper text
- Metadata
- Timestamps

### Emphasis: Bold & Uppercase

**Usage**: Bold font weights and uppercase for key elements

- **Font Weight**: 700-900 (Bold to Black)
- **Transform**: Uppercase
- **Letter Spacing**: `tracking-wide` to `tracking-widest`

**Applied to**:

- Key labels
- Menu items
- Callouts
- Status badges
- Important notices
- Action buttons

## Implementation Details

### Google Fonts Import (index.html)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;600;700;900&display=swap"
  rel="stylesheet"
/>
```

### Base Font Application

#### Main Application (App.jsx)

```jsx
<div style={{ fontFamily: "'Open Sans', 'Roboto', sans-serif" }}>
```

#### Login Page (LoginScreen.jsx)

```jsx
<div style={{ fontFamily: "'Open Sans', 'Roboto', sans-serif" }}>
```

## Typography Scale

### Headings with Montserrat

| Element         | Size            | Weight           | Transform | Tracking        |
| --------------- | --------------- | ---------------- | --------- | --------------- |
| Page Title      | text-3xl (30px) | font-black (900) | uppercase | tracking-wide   |
| Section Heading | text-2xl (24px) | font-black (900) | uppercase | tracking-wide   |
| Card Header     | text-lg (18px)  | font-black (900) | uppercase | tracking-wide   |
| Form Label      | text-xs (12px)  | font-black (900) | uppercase | tracking-widest |
| Navigation Item | text-sm (14px)  | font-bold (700)  | uppercase | tracking-wide   |
| Button Text     | text-sm (14px)  | font-black (900) | uppercase | tracking-widest |

### Body Text with Open Sans/Roboto

| Element    | Size             | Weight              |
| ---------- | ---------------- | ------------------- |
| Body Text  | text-base (16px) | font-normal (400)   |
| Small Text | text-sm (14px)   | font-medium (500)   |
| Metadata   | text-xs (12px)   | font-semibold (600) |
| Input Text | text-sm (14px)   | font-medium (500)   |

## Specific Component Changes

### Login Page

1. **Mission Title**: Montserrat Black, Uppercase, tracking-wide
2. **Subtitle**: Montserrat Bold, Uppercase, tracking-wider
3. **Welcome Heading**: Montserrat Black, Uppercase, tracking-wide
4. **Form Labels**: Montserrat Black, Uppercase, tracking-widest
5. **Login Button**: Montserrat Black, Uppercase, tracking-widest
6. **Body Text**: Open Sans Regular

### Sidebar Navigation

1. **Panchayat Header**: Montserrat Black, Uppercase, tracking-widest
2. **Location Name**: Montserrat Bold
3. **Menu Items**: Bold, Uppercase, tracking-wide
4. **Language Label**: Montserrat Black, Uppercase, tracking-widest
5. **User Name**: Montserrat Bold
6. **Logout Button**: Bold, Uppercase, tracking-wide

### Dashboard Content

- **Section Headers**: Montserrat with appropriate weights
- **Body Content**: Open Sans/Roboto
- **Data Labels**: Bold, Uppercase for emphasis
- **Statistics**: Montserrat for numbers, Open Sans for labels

## CSS Classes Reference

### Montserrat Heading Classes

```css
font-black uppercase tracking-widest /* Main headings */
font-bold uppercase tracking-wide    /* Sub-headings */
font-black uppercase tracking-wide   /* Emphasis */
```

### Body Text Classes

```css
font-normal    /* Regular body text */
font-medium    /* Slightly emphasized */
font-semibold  /* Metadata/labels */
font-bold      /* Strong emphasis */
```

## Letter Spacing Scale

| Class           | Value   | Usage                     |
| --------------- | ------- | ------------------------- |
| tracking-normal | 0em     | Body text                 |
| tracking-wide   | 0.025em | Navigation, buttons       |
| tracking-wider  | 0.05em  | Subtitles                 |
| tracking-widest | 0.1em   | Form labels, key callouts |

## Font Weight Scale

| Class          | Value | Usage                  |
| -------------- | ----- | ---------------------- |
| font-normal    | 400   | Body text              |
| font-medium    | 500   | Input fields           |
| font-semibold  | 600   | Metadata               |
| font-bold      | 700   | Navigation, emphasis   |
| font-extrabold | 800   | Strong headings        |
| font-black     | 900   | Main headings, buttons |

## Accessibility Considerations

1. **Contrast Ratios**: All text meets WCAG 2.0 AA standards
   - Normal text: 4.5:1 minimum
   - Large text (18pt+): 3:1 minimum

2. **Readability**:
   - Body text uses comfortable line heights
   - Adequate spacing between lines and paragraphs
   - Uppercase used sparingly for navigation/labels only

3. **Font Loading**:
   - Fonts preconnected for faster loading
   - System fallbacks provided
   - Font display swap for better performance

## Browser Compatibility

- **Primary**: Montserrat, Open Sans, Roboto (via Google Fonts)
- **Fallback**: System sans-serif fonts
- **Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## Performance Optimization

1. **Font Subsetting**: Only required weights loaded
2. **Preconnect**: DNS prefetch for Google Fonts
3. **Display Swap**: Prevents invisible text during load
4. **Caching**: Fonts cached by browser

## Files Modified

1. `index.html` - Font imports
2. `src/App.jsx` - Base font and heading styles
3. `src/components/auth/LoginScreen.jsx` - Login page typography

## Notes

- All uppercase text uses `text-transform: uppercase` in CSS
- Letter spacing increased for uppercase text for better readability
- Font weights adjusted for government website authority
- Consistent spacing and sizing throughout application
