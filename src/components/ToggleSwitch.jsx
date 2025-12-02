import React, { useState } from 'react';

/**
 * Toggle Switch Component - Better UX for boolean states
 */
export const ToggleSwitch = ({
  id,
  checked = false,
  onChange,
  disabled = false,
  label = '',
  className = '',
  size = 'md', // sm, md, lg
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8',
  };

  const toggleClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-8' : 'translate-x-1',
  };

  const dotSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        id={id}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          checked ? 'bg-green-500 focus:ring-green-400' : 'bg-gray-300 focus:ring-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} ${sizeClasses[size]}`}
        aria-checked={checked}
        role="switch"
      >
        {/* Toggle Dot */}
        <span
          className={`${dotSizeClasses[size]} bg-white rounded-full shadow-md absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ${toggleClasses[size]}`}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

/**
 * Valve Toggle Component - Specialized for valve states
 */
export const ValveToggle = ({ isOpen, onToggle, disabled = false, pipelineId = '', className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        className={`relative inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bg-gradient-to-br from-green-400 to-green-600 hover:shadow-green-400/50'
            : 'bg-gradient-to-br from-red-400 to-red-600 hover:shadow-red-400/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'} group`}
        aria-label={`${isOpen ? 'Close' : 'Open'} valve ${pipelineId}`}
        title={`Valve: ${isOpen ? 'Open' : 'Closed'}`}
      >
        {/* Animated Icon */}
        <div
          className={`text-white font-bold text-2xl transition-all duration-300 ${
            isOpen ? 'scale-100 rotate-0' : 'scale-100 rotate-180'
          }`}
        >
          {isOpen ? '🔓' : '🔒'}
        </div>

        {/* Pulse Effect when open */}
        {isOpen && (
          <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-25"></div>
        )}

        {/* Hover Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-300"></div>
      </button>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-600 uppercase">Valve {pipelineId}</span>
        <span
          className={`text-sm font-bold ${
            isOpen ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
    </div>
  );
};

/**
 * Pump Toggle Component - Specialized for pump states
 */
export const PumpToggle = ({ isRunning, onToggle, disabled = false, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-xl ${
          isRunning
            ? 'bg-gradient-to-br from-green-500 to-emerald-700 hover:shadow-green-400/60'
            : 'bg-gradient-to-br from-slate-400 to-slate-600 hover:shadow-slate-400/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl cursor-pointer'} group`}
        aria-label={isRunning ? 'Stop pump' : 'Start pump'}
        title={`Pump: ${isRunning ? 'Running' : 'Stopped'}`}
      >
        {/* Animated Icon */}
        <div
          className={`text-white font-bold text-3xl transition-all duration-300 ${
            isRunning ? 'animate-spin' : ''
          }`}
          style={isRunning ? { animationDuration: '2s' } : {}}
        >
          {isRunning ? '⚙️' : '▶️'}
        </div>

        {/* Pulse Effect when running */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-30"></div>
        )}

        {/* Hover Effect */}
        <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
          isRunning ? 'border-white/40' : 'border-white/20'
        } ${isHovered ? 'border-white/70' : ''}`}></div>
      </button>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-600 uppercase">Main Pump</span>
        <span
          className={`text-sm font-bold transition-colors duration-300 ${
            isRunning ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          {isRunning ? 'RUNNING' : 'STOPPED'}
        </span>
      </div>
    </div>
  );
};

/**
 * Tank Inlet/Outlet Toggle Component
 */
export const TankValveToggle = ({ isOpen, onToggle, disabled = false, type = 'inlet', className = '' }) => {
  const title = type === 'inlet' ? 'Tank Inlet Valve' : 'Tank Outlet Valve';
  const label = type === 'inlet' ? 'Inlet' : 'Outlet';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-md ${
          isOpen
            ? 'bg-gradient-to-br from-cyan-400 to-blue-600 hover:shadow-blue-400/50'
            : 'bg-gradient-to-br from-orange-400 to-red-600 hover:shadow-orange-400/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}`}
        aria-label={`${isOpen ? 'Close' : 'Open'} ${label} valve`}
        title={`${title}: ${isOpen ? 'Open' : 'Closed'}`}
      >
        <span className="text-white font-bold text-xl">
          {type === 'inlet' ? '⬇️' : '⬆️'}
        </span>
      </button>
      <span 
        className="text-xs font-bold"
        style={{ color: isOpen ? 'var(--primary-blue)' : '#DC2626' }}
      >
        {label}
      </span>
    </div>
  );
};
