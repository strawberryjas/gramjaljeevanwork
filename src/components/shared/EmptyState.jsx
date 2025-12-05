import React from 'react';

/**
 * Empty State Component
 * Shows when there's no data to display
 *
 * @param {string} title - Main heading
 * @param {string} description - Descriptive text
 * @param {ReactNode} icon - Icon component
 * @param {ReactNode} action - Optional CTA button
 */
export const EmptyState = ({ title, description, icon: Icon, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      {Icon && (
        <div className="mb-4" style={{ color: 'var(--gray-text)' }}>
          <Icon size={64} strokeWidth={1.5} />
        </div>
      )}
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--gray-text-dark)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>
      <p className="max-w-md" style={{ color: 'var(--gray-text)', marginBottom: '24px' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
