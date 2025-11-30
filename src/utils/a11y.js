/**
 * Accessibility Utilities
 * Helpers for ARIA attributes, keyboard navigation, and a11y best practices.
 */

/**
 * Generate accessible button attributes
 */
export const getA11yButtonAttrs = (disabled = false, ariaLabel = null) => ({
  'aria-disabled': disabled,
  disabled,
  ...(ariaLabel && { 'aria-label': ariaLabel }),
  role: 'button',
})

/**
 * Generate accessible live region attributes for notifications
 */
export const getA11yLiveRegionAttrs = (politeness = 'polite') => ({
  role: 'status',
  'aria-live': politeness,
  'aria-atomic': 'true',
})

/**
 * Generate accessible modal dialog attributes
 */
export const getA11yModalAttrs = (isOpen, id) => ({
  role: 'dialog',
  'aria-modal': 'true',
  'aria-labelledby': `${id}-title`,
  'aria-describedby': `${id}-description`,
})

/**
 * Generate accessible form field attributes
 */
export const getA11yFormFieldAttrs = (fieldId, errorMessage = null, required = false) => ({
  id: fieldId,
  'aria-invalid': !!errorMessage,
  'aria-describedby': errorMessage ? `${fieldId}-error` : undefined,
  'aria-required': required,
})

/**
 * Skip to main content link for keyboard navigation
 */
export const SkipToMainContent = ({ mainId = 'main-content' }) => (
  <a
    href={`#${mainId}`}
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-2"
  >
    Skip to main content
  </a>
)

/**
 * Screen reader only text
 */
export const SROnly = ({ children }) => (
  <span className="sr-only">{children}</span>
)

/**
 * Close button with proper a11y
 */
export const A11yCloseButton = ({ onClose, label = 'Close' }) => (
  <button
    onClick={onClose}
    aria-label={label}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  >
    ×
  </button>
)

/**
 * Accessible tooltip component
 */
export const A11yTooltip = ({ children, tooltip, id }) => (
  <div className="relative inline-block group">
    <span aria-describedby={`tooltip-${id}`}>{children}</span>
    <div
      id={`tooltip-${id}`}
      role="tooltip"
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded hidden group-hover:block whitespace-nowrap"
    >
      {tooltip}
    </div>
  </div>
)

/**
 * Skip list for keyboard navigation
 */
export const useKeyboardNavigation = (itemCount) => {
  const handleKeyDown = (e, index, onSelect) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        onSelect((index + 1) % itemCount)
        break
      case 'ArrowUp':
        e.preventDefault()
        onSelect((index - 1 + itemCount) % itemCount)
        break
      case 'Home':
        e.preventDefault()
        onSelect(0)
        break
      case 'End':
        e.preventDefault()
        onSelect(itemCount - 1)
        break
      default:
        break
    }
  }
  return { handleKeyDown }
}

/**
 * Color contrast checker (helper for manual review)
 */
export const isContrastAdequate = (foreground, background) => {
  // Simplified checker - for production, use dedicated library
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(Number)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return contrast >= 4.5 // WCAG AA standard
}

export default {
  getA11yButtonAttrs,
  getA11yLiveRegionAttrs,
  getA11yModalAttrs,
  getA11yFormFieldAttrs,
  SkipToMainContent,
  SROnly,
  A11yCloseButton,
  A11yTooltip,
  useKeyboardNavigation,
  isContrastAdequate,
}
