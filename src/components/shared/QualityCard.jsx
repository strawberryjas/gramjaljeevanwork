import React from 'react';

export const QualityCard = ({ label, value, unit, safeMax, safeMin = 0, icon: Icon, iconSrc }) => {
  const isSafe = value >= safeMin && value <= safeMax;

  return (
    <div 
      className="p-4"
      style={{
        backgroundColor: isSafe ? 'var(--bg-white)' : '#FEE2E2',
        border: isSafe ? '1px solid #86EFAC' : '1px solid #FCA5A5',
        borderRadius: 'var(--radius-sm)'
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="p-1.5"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isSafe ? '#D1FAE5' : '#FEE2E2',
              color: isSafe ? '#059669' : '#DC2626'
            }}
          >
            {iconSrc ? (
              <img src={iconSrc} alt={label} className="w-4 h-4 object-contain" />
            ) : Icon ? (
              <Icon size={16} />
            ) : null}
          </div>
          <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--gray-text-dark)' }}>{label}</span>
        </div>
        <span 
          className="px-2 py-1"
          style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isSafe ? '#D1FAE5' : '#FEE2E2',
            color: isSafe ? '#059669' : '#DC2626'
          }}
        >
          {isSafe ? 'SAFE' : 'ALERT'}
        </span>
      </div>
      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}>
        {value.toFixed(2)} <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-text)', fontWeight: 'var(--font-weight-normal)' }}>{unit}</span>
      </div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-text)', marginTop: '4px' }}>
        Standard: {safeMin > 0 ? `${safeMin}-` : '<'}{safeMax} {unit}
      </div>
    </div>
  );
};

