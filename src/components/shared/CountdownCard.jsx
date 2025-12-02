import React from 'react';

export const CountdownCard = ({ title, targetDate, icon: Icon, iconSrc }) => {
  const daysLeft = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft < 3;

  return (
    <div className={`p-4 rounded-xl border flex items-center gap-4 ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
      <div className={`p-3 rounded-full ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
        {iconSrc ? (
          <img src={iconSrc} alt={title} className="w-5 h-5 object-contain" />
        ) : Icon ? (
          <Icon size={20} />
        ) : null}
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase">{title}</div>
        <div className="text-xl font-bold text-gray-800">
          {daysLeft} <span className="text-sm font-normal">days left</span>
        </div>
      </div>
    </div>
  );
};

