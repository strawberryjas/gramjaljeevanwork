import React from 'react';

export const QualityCard = ({ label, value, unit, safeMax, safeMin = 0, icon: Icon }) => {
  const isSafe = value >= safeMin && value <= safeMax;
  
  return (
    <div className={`p-4 rounded-xl border ${isSafe ? 'bg-white border-emerald-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            <Icon size={16} />
          </div>
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isSafe ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isSafe ? 'SAFE' : 'ALERT'}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value.toFixed(2)} <span className="text-sm text-gray-500 font-normal">{unit}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Standard: {safeMin > 0 ? `${safeMin}-` : '<'}{safeMax} {unit}
      </div>
    </div>
  );
};

