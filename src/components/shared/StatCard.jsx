import React from 'react';

export const StatCard = ({ label, value, unit, icon: Icon, status = 'neutral', subLabel, onClick }) => {
  const statusColors = {
    neutral: 'bg-white border-gray-200',
    good: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    critical: 'bg-red-50 border-red-200',
    highlight: 'bg-blue-50 border-blue-200'
  };
  
  return (
    <div onClick={onClick} className={`p-4 rounded-[14px] border shadow-sm ${statusColors[status]} transition-all cursor-pointer hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800">
            {typeof value === 'number' ? value.toFixed(typeof value === 'number' && value % 1 !== 0 ? 1 : 0) : value} 
            <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </h3>
          {subLabel && <p className="text-xs text-blue-600 font-medium mt-1">{subLabel}</p>}
        </div>
        <div className="p-2 rounded-md bg-white/50">
          <Icon size={20} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

