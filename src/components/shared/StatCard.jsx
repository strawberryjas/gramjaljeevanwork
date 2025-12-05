import React from 'react';

export const StatCard = ({
  label,
  value,
  unit,
  icon: Icon,
  iconSrc,
  status = 'neutral',
  subLabel,
  onClick,
}) => {
  const statusColors = {
    neutral: { bg: 'var(--bg-white)', border: 'var(--gray-border)' },
    good: { bg: '#F0FDF4', border: '#86EFAC' },
    warning: { bg: '#FEF3C7', border: '#FCD34D' },
    critical: { bg: '#FEE2E2', border: '#FCA5A5' },
    highlight: { bg: 'var(--bg-persona)', border: 'var(--primary-blue)' },
  };

  const colors = statusColors[status];

  return (
    <div
      onClick={onClick}
      className="p-4 transition-all cursor-pointer"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--gray-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </p>
          <h3
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginTop: '4px',
              color: 'var(--gray-text-dark)',
            }}
          >
            {typeof value === 'number'
              ? value.toFixed(typeof value === 'number' && value % 1 !== 0 ? 1 : 0)
              : value}
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--gray-text)',
                marginLeft: '4px',
              }}
            >
              {unit}
            </span>
          </h3>
          {subLabel && (
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--primary-blue)',
                fontWeight: 'var(--font-weight-medium)',
                marginTop: '4px',
              }}
            >
              {subLabel}
            </p>
          )}
        </div>
        <div
          className="p-2"
          style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.5)' }}
        >
          {iconSrc ? (
            <img src={iconSrc} alt={label} className="w-5 h-5 object-contain" />
          ) : Icon ? (
            <Icon size={20} style={{ color: 'var(--gray-text-dark)' }} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
