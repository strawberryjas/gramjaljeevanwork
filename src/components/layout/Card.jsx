import React from 'react';

/**
 * Card Component
 * Consistent card wrapper for dashboard sections
 */
export const Card = ({
  title,
  icon: Icon,
  children,
  className = '',
  headerAction,
  noPadding = false,
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {Icon && <Icon size={20} className="text-gray-600" />}
            {title}
          </h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default Card;
