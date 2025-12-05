import React from 'react';

export const QualityCard = ({ label, value, unit, safeMax, safeMin = 0, icon: Icon, iconSrc }) => {
  const isSafe = value >= safeMin && value <= safeMax;

  return (
    <div
      className="p-2 md:p-4"
      style={{
        backgroundColor: isSafe ? 'var(--bg-white)' : '#FEE2E2',
        border: isSafe ? '1px solid #86EFAC' : '1px solid #FCA5A5',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      <div className="flex justify-between items-start mb-1 md:mb-2">
        <div className="flex items-center gap-1 md:gap-2">
          <div
            className="p-1 md:p-1.5"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isSafe ? '#D1FAE5' : '#FEE2E2',
              color: isSafe ? '#059669' : '#DC2626',
            }}
          >
            {iconSrc ? (
              <img src={iconSrc} alt={label} className="w-3 h-3 md:w-4 md:h-4 object-contain" />
            ) : Icon ? (
              <Icon size={12} className="md:w-4 md:h-4" />
            ) : null}
          </div>
          <span
            className="text-[10px] md:text-base"
            style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--gray-text-dark)' }}
          >
            {label}
          </span>
        </div>
        <span
          className="px-1 py-0.5 md:px-2 md:py-1 text-[8px] md:text-xs"
          style={{
            fontWeight: 'var(--font-weight-bold)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isSafe ? '#D1FAE5' : '#FEE2E2',
            color: isSafe ? '#059669' : '#DC2626',
          }}
        >
          {isSafe ? 'SAFE' : 'ALERT'}
        </span>
      </div>
      <div
        className="text-sm md:text-2xl"
        style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}
      >
        {value.toFixed(2)}{' '}
        <span
          className="text-[10px] md:text-sm"
          style={{ color: 'var(--gray-text)', fontWeight: 'var(--font-weight-normal)' }}
        >
          {unit}
        </span>
      </div>
      <div
        className="text-[8px] md:text-xs"
        style={{ color: 'var(--gray-text)', marginTop: '4px' }}
      >
        Standard: {safeMin > 0 ? `${safeMin}-` : '<'}
        {safeMax} {unit}
      </div>
    </div>
  );
};
