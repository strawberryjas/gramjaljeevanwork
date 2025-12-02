import React from 'react';
import IconImage from './IconImage';
import { useTranslation } from 'react-i18next';

/**
 * BreadcrumbNavigation Component
 * - Shows navigation path to current page
 * - Interactive breadcrumbs for quick navigation
 * - Mobile responsive
 */
export const BreadcrumbNavigation = ({ activeTab, onNavigate }) => {
  const { t } = useTranslation();

  // Map tab IDs to breadcrumb paths
  const breadcrumbMap = {
    'network-map': [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'network-map', label: 'Network Map' },
    ],
    'pump-station': [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'pump-station', label: 'Pump Station' },
    ],
    'water-tank': [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'water-tank', label: 'Water Tank' },
    ],
    pipeline: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'pipeline', label: 'Pipeline' },
    ],
    valves: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'valves', label: 'Valves' },
    ],
    overview: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'overview', label: 'Infrastructure Overview' },
    ],
    daily: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'daily', label: 'Daily Operations' },
    ],
    quality: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'quality', label: 'Water Quality' },
    ],
    forecasting: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'forecasting', label: 'Forecasting' },
    ],
    reports: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'reports', label: 'Reports' },
    ],
    accountability: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'accountability', label: 'Accountability' },
    ],
    energy: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'energy', label: 'Energy Metrics' },
    ],
    tickets: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'tickets', label: 'Service Requests' },
    ],
    analytics: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'analytics', label: t('nav.analytics') },
    ],
    gis: [
      { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
      { id: 'gis', label: 'GIS Mapping' },
    ],
  };

  const breadcrumbs = breadcrumbMap[activeTab] || [
    { id: 'home', label: 'Dashboard', icon: 'home-icon.svg' },
    { id: activeTab, label: activeTab },
  ];

  return (
    <div 
      className="px-4 lg:px-8 py-3 overflow-x-auto"
      style={{
        backgroundColor: 'var(--gray-light)',
        borderBottom: '1px solid var(--gray-border)'
      }}
    >
      <div className="flex items-center gap-2 min-w-min">
        {breadcrumbs.map((crumb, index) => {
          const Icon = crumb.icon || null;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={crumb.id} className="flex items-center gap-2">
              {index > 0 && (
                <IconImage name="chevron-right.svg" className="h-9 w-9 flex-shrink-0" aria-hidden="true" />
              )}
              <button
                onClick={() => onNavigate?.(crumb.id)}
                disabled={isLast}
                className="flex items-center gap-1 px-2 py-1 transition-all duration-200 whitespace-nowrap"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: isLast ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                  color: isLast ? 'var(--gray-text-dark)' : 'var(--gray-text)',
                  cursor: isLast ? 'default' : 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: isLast ? 'none' : 'underline'
                }}
                onMouseEnter={(e) => {
                  if (!isLast) {
                    e.currentTarget.style.color = 'var(--primary-blue)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLast) {
                    e.currentTarget.style.color = 'var(--gray-text)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {Icon && <IconImage name={Icon} className="h-8 w-8 flex-shrink-0" aria-hidden="true" />}
                <span>{crumb.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
