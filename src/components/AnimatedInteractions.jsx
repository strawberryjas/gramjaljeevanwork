import React from 'react';

/**
 * Interactive Card with Hover Effects and Animations
 */
export const InteractiveCard = ({
  children,
  onClick = null,
  className = '',
  hoverEffect = 'lift', // lift, glow, scale, border
  animated = true,
  disabled = false,
}) => {
  const baseClasses = 'transition-all duration-300 rounded-xl';

  const hoverClasses = {
    lift: 'hover:shadow-2xl hover:-translate-y-2',
    glow: 'hover:shadow-lg hover:shadow-blue-300',
    scale: 'hover:scale-105',
    border: 'hover:border-blue-400 hover:border-2',
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${hoverClasses[hoverEffect] || hoverClasses.lift} ${
        onClick ? 'cursor-pointer' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className} ${
        animated ? 'animate-fadeIn' : ''
      }`}
    >
      {children}
    </div>
  );
};

/**
 * Button with Multiple Hover Animations
 */
export const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary', // primary, success, danger, warning, secondary
  size = 'md', // sm, md, lg
  hoverEffect = 'lift', // lift, glow, shine, pulse
  disabled = false,
  className = '',
  icon: Icon = null,
  iconPosition = 'left', // left, right
  isLoading = false,
  loadingText = 'Loading...',
}) => {
  const baseClasses =
    'font-semibold transition-all duration-300 rounded-lg inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const hoverClasses = {
    lift: 'hover:shadow-lg hover:-translate-y-0.5',
    glow: 'hover:shadow-xl hover:shadow-current/50',
    shine: 'hover:brightness-110',
    pulse: 'hover:animate-pulse',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses[hoverEffect]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className} active:scale-95`}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} />}
        </>
      )}
    </button>
  );
};

/**
 * Status Badge with Animation
 */
export const StatusBadge = ({
  status = 'active', // active, inactive, warning, critical, pending
  label = '',
  animated = true,
  size = 'md', // sm, md, lg
  className = '',
}) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-500',
      pulse: 'animate-pulse',
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      dot: 'bg-gray-500',
      pulse: '',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      pulse: 'animate-pulse',
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-500',
      pulse: 'animate-pulse',
    },
    pending: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      dot: 'bg-blue-500',
      pulse: 'animate-pulse',
    },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-300 ${config.bg} ${config.text} ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`${dotSizeClasses[size]} rounded-full ${config.dot} ${
          animated ? config.pulse : ''
        }`}
      />
      {label}
    </span>
  );
};

/**
 * Animated Progress Bar
 */
export const AnimatedProgressBar = ({
  value = 0,
  max = 100,
  color = 'blue', // blue, green, red, amber
  animated = true,
  showLabel = true,
  className = '',
  height = 'h-2',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className={`${className}`}>
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClasses[color]} transition-all duration-500 ${
            animated ? 'animate-slideRight' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-gray-600 mt-1">{Math.round(percentage)}%</p>}
    </div>
  );
};

/**
 * Floating Action Button
 */
export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  label = '',
  color = 'blue', // blue, green, red
  size = 'md', // sm, md, lg
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-400/50',
    green: 'bg-green-600 hover:bg-green-700 shadow-green-400/50',
    red: 'bg-red-600 hover:bg-red-700 shadow-red-400/50',
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} ${colorClasses[color]} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center`}
        aria-label={label}
        title={label}
      >
        <Icon size={iconSizes[size]} />
      </button>
      {label && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {label}
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton Loader Animation
 */
export const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-12 animate-pulse" />
      ))}
    </div>
  );
};

/**
 * Attention Pulse Animation
 */
export const PulseAttention = ({
  children,
  active = true,
  intensity = 'medium', // light, medium, heavy
  className = '',
}) => {
  const intensityClasses = {
    light: 'animate-pulse',
    medium: 'animate-pulse shadow-lg shadow-blue-500/50',
    heavy: 'animate-bounce shadow-xl shadow-red-500/75',
  };

  return (
    <div
      className={`transition-all duration-300 ${active ? intensityClasses[intensity] : ''} ${className}`}
    >
      {children}
    </div>
  );
};
