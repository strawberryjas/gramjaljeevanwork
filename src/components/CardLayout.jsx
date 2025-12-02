import React, { useState } from 'react';

/**
 * TabbedPanel Component
 * - Organized tab-based content switching
 * - Icon support for each tab
 * - Clean, modern tab design
 * - Mobile responsive
 */
export const TabbedPanel = ({
  tabs,
  defaultTab = 0,
  onTabChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    onTabChange?.(index, tabs[index].id);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(index)}
              className={`flex-1 min-w-max px-4 lg:px-6 py-4 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200 relative group whitespace-nowrap ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {Icon && <Icon size={18} className="flex-shrink-0" />}
              <span>{tab.label}</span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-lg" />
              )}

              {/* Hover effect for inactive tabs */}
              {!isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-600 group-hover:bg-amber-300 dark:group-hover:bg-amber-600 transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-8 animate-fadeIn">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

/**
 * CardSection Component
 * - Container for grouped related information
 * - Header with optional icon and description
 * - Footer for actions
 * - Clear visual hierarchy
 */
export const CardSection = ({
  title,
  icon: Icon,
  description,
  children,
  footer,
  className = '',
  headerClassName = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-400/50 ${className}`}
    >
      {/* Header */}
      {title && (
        <div className={`px-6 lg:px-8 py-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-750 dark:to-slate-800 ${headerClassName}`}>
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                <Icon size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 lg:px-8 py-6">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 lg:px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * MetricCard Component
 * - Display key metrics with emphasis
 * - Large, bold typography
 * - Optional trend indicator
 * - Support for unit and formatted values
 */
export const MetricCard = ({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendDirection = 'up', // 'up' or 'down'
  color = 'blue',
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
}) => {
  const sizeClasses = {
    small: { container: 'p-4', title: 'text-sm', value: 'text-2xl', unit: 'text-xs' },
    medium: { container: 'p-6', title: 'text-base', value: 'text-4xl', unit: 'text-sm' },
    large: { container: 'p-8', title: 'text-lg', value: 'text-6xl', unit: 'text-base' },
  };

  const colorClasses = {
    blue: { icon: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    amber: { icon: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    green: { icon: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
    red: { icon: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    purple: { icon: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  };

  const colors = colorClasses[color] || colorClasses.blue;
  const sizes = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 ${sizes.container} transition-all hover:shadow-xl hover:border-amber-500/30 dark:hover:border-amber-400/30 ${className}`}
    >
      {/* Header with icon and label */}
      <div className="flex items-start justify-between mb-4">
        <h4 className={`${sizes.title} font-semibold text-slate-600 dark:text-slate-400 flex-1`}>
          {label}
        </h4>
        {Icon && (
          <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0`}>
            <Icon size={24} className={colors.icon} />
          </div>
        )}
      </div>

      {/* Value section */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className={`${sizes.value} font-black text-slate-900 dark:text-white leading-tight`}>
          {value}
        </span>
        {unit && (
          <span className={`${sizes.unit} text-slate-500 dark:text-slate-400 font-semibold`}>
            {unit}
          </span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          trendDirection === 'up'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          <span>{trendDirection === 'up' ? '↑' : '↓'}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
