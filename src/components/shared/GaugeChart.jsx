import React from 'react';

export const GaugeChart = ({ value, max, label, color }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle 
            cx="50%" 
            cy="50%" 
            r="40" 
            stroke={color} 
            strokeWidth="8" 
            fill="none" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 - (251.2 * percentage) / 100} 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute text-lg font-bold text-gray-700">{value.toFixed(0)}%</div>
      </div>
      <div className="mt-1 text-xs text-gray-500 font-medium text-center">{label}</div>
    </div>
  );
};

