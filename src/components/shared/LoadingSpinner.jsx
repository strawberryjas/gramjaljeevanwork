import React from 'react';

/**
 * Loading Spinner Component
 * Shows a loading indicator
 *
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} message - Optional loading message
 */
export const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          borderColor: 'var(--gray-border)',
          borderTopColor: 'var(--primary-blue)',
        }}
        aria-hidden="true"
      />
      {message && (
        <p
          className="mt-4"
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--gray-text)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Skeleton Loader Component
 * Shows a placeholder while content loads
 */
export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div
      className={`${width} ${height} animate-pulse ${className}`}
      style={{
        backgroundColor: 'var(--gray-light)',
        borderRadius: 'var(--radius-sm)',
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Card Skeleton
 * Skeleton for card-based layouts
 */
export const CardSkeleton = () => {
  return (
    <div
      className="p-6"
      style={{
        backgroundColor: 'var(--bg-white)',
        border: '1px solid var(--gray-border)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start gap-4">
        <Skeleton width="w-12" height="h-12" />
        <div className="flex-1 space-y-3">
          <Skeleton width="w-3/4" height="h-4" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
