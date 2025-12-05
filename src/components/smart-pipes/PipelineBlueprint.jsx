import React, { useMemo } from 'react';
import { useLeakLogic } from '../../hooks/useLeakLogic';

/**
 * High-Fidelity Industrial Pipe Segment
 * Visualizes flow, pressure, and leakage with SCADA-style graphics
 */
const SmartPipe = ({ segment, inletSensor, outletSensor }) => {
  const inletVal = inletSensor?.value || 0;
  const outletVal = outletSensor?.value || 0;

  // Logic Engine
  const { isLeaking, lossAmount, colorCode } = useLeakLogic(inletVal, outletVal);

  // Coordinates
  const { x1, y1, x2, y2 } = segment.coordinates;

  // Animation Calculations
  const flowRate = (inletVal + outletVal) / 2;
  const isFlowing = flowRate > 0;
  // Speed: Higher flow = Lower duration (faster). range 0.5s to 5s
  const animDuration = isFlowing ? Math.max(0.8, 4 - flowRate / 30) : 0;

  // Path Definition
  const pathD = `M ${x1} ${y1} L ${x2} ${y2}`;

  // Dynamic IDs for gradients
  const gradId = `leak-grad-${segment.id}`;
  const maskId = `mask-${segment.id}`;

  return (
    <g className="group cursor-pointer">
      <defs>
        {/* Dynamic Gradient for Leak Visualization (Blue -> Red) */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Inlet Blue */}
          <stop offset="100%" stopColor={isLeaking ? '#ef4444' : '#3b82f6'} />{' '}
          {/* Outlet Red if leak */}
        </linearGradient>
      </defs>

      {/* 1. INTERACTION LAYER (Invisible wide path for easy hovering) */}
      <path d={pathD} stroke="transparent" strokeWidth="30" fill="none" />

      {/* 2. PIPE CASING (The wall) */}
      {/* Outer dark stroke for definition */}
      <path
        d={pathD}
        stroke="#1e293b" // Slate-800
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        filter="url(#dropShadow)"
      />
      {/* Inner metallic highlight to simulate cylinder */}
      <path
        d={pathD}
        stroke="#334155" // Slate-700
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. FLUID LAYER (The water) */}
      <path
        d={pathD}
        stroke={`url(#${gradId})`}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        className="transition-all duration-500"
        opacity={isFlowing ? 1 : 0.3}
      />

      {/* 4. FLOW ANIMATION (Particles) */}
      {isFlowing && (
        <>
          {/* Dashed overlay for continuous motion */}
          <path
            d={pathD}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="4 20"
            strokeOpacity="0.3"
            style={{
              animation: `dashAnimation ${animDuration}s linear infinite`,
            }}
          />
          {/* Warning Glow if Leaking */}
          {isLeaking && (
            <path
              d={pathD}
              stroke="#ef4444"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
              filter="url(#glow)"
              style={{ animation: 'pulseAnimation 2s ease-in-out infinite' }}
            />
          )}
        </>
      )}

      {/* 5. SENSOR NODES & LABELS */}
      {/* Inlet Node */}
      <g transform={`translate(${x1}, ${y1})`}>
        <circle r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
        <circle r="4" fill={isFlowing ? '#3b82f6' : '#64748b'} />
        <text
          y="-15"
          textAnchor="middle"
          className="text-[10px] fill-slate-500 font-mono font-bold tracking-tighter"
        >
          IN
        </text>
      </g>

      {/* Outlet Node */}
      <g transform={`translate(${x2}, ${y2})`}>
        <circle r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
        <circle r="4" fill={isLeaking ? '#ef4444' : isFlowing ? '#3b82f6' : '#64748b'} />
        <text
          y="-15"
          textAnchor="middle"
          className="text-[10px] fill-slate-500 font-mono font-bold tracking-tighter"
        >
          OUT
        </text>
      </g>

      {/* 6. TECHNICAL TOOLTIP */}
      <foreignObject
        x={(x1 + x2) / 2 - 100}
        y={(y1 + y2) / 2 + 10}
        width="200"
        height="100"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
      >
        <div className="bg-slate-900/90 backdrop-blur-md text-slate-100 text-xs p-3 rounded-md shadow-2xl border border-slate-700">
          <div className="flex justify-between items-center border-b border-slate-700 pb-1 mb-2">
            <span className="font-mono text-cyan-400 font-bold">{segment.id}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isLeaking ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
            >
              {isLeaking ? 'CRITICAL' : 'NOMINAL'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 font-mono text-[10px]">
            <span className="text-slate-400">INLET FLOW:</span>
            <span className="text-right">{inletVal.toFixed(1)} L/m</span>
            <span className="text-slate-400">OUTLET FLOW:</span>
            <span className="text-right">{outletVal.toFixed(1)} L/m</span>
            <span className="text-slate-400">LOSS:</span>
            <span
              className={`text-right font-bold ${lossAmount > 0.5 ? 'text-amber-400' : 'text-slate-400'}`}
            >
              {lossAmount.toFixed(1)} L
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export const PipelineBlueprint = ({ pipes, sensors }) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
      {/* SCADA Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-2 rounded">
          <h3 className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            System Topology View
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-mono">ACTIVE FLOW</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-[10px] text-slate-400 font-mono">LEAK DETECTED</span>
            </div>
          </div>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 800 400" className="w-full h-full">
        <defs>
          {/* Blueprint Grid Pattern */}
          <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            <path
              d="M 10 0 L 10 40 M 20 0 L 20 40 M 30 0 L 30 40 M 0 10 L 40 10 M 0 20 L 40 20 M 0 30 L 40 30"
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>

          {/* Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="#0f172a" />
        <rect width="100%" height="100%" fill="url(#blueprintGrid)" />

        {/* Render Pipes */}
        {pipes.map((pipe) => (
          <SmartPipe
            key={pipe.id}
            segment={pipe}
            inletSensor={sensors.find((s) => s.id === pipe.inletSensorId)}
            outletSensor={sensors.find((s) => s.id === pipe.outletSensorId)}
          />
        ))}

        {/* Elevated Overhead Tank on Pillars */}
        <g transform="translate(30, 180)">
          {/* Support Pillars */}
          <g>
            {/* Left Pillar */}
            <rect
              x="5"
              y="10"
              width="4"
              height="30"
              rx="1"
              fill="url(#pillarGrad)"
              stroke="#44403c"
              strokeWidth="1.5"
              filter="url(#dropShadow)"
            />
            {/* Pillar Reinforcement Rings */}
            <rect
              x="4"
              y="15"
              width="6"
              height="1.5"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
            />
            <rect
              x="4"
              y="32"
              width="6"
              height="1.5"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
            />

            {/* Right Pillar */}
            <rect
              x="31"
              y="10"
              width="4"
              height="30"
              rx="1"
              fill="url(#pillarGrad)"
              stroke="#44403c"
              strokeWidth="1.5"
              filter="url(#dropShadow)"
            />
            {/* Pillar Reinforcement Rings */}
            <rect
              x="30"
              y="15"
              width="6"
              height="1.5"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
            />
            <rect
              x="30"
              y="32"
              width="6"
              height="1.5"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
            />

            {/* Cross Brace (optional structural element) */}
            <line x1="9" y1="25" x2="31" y2="25" stroke="#57534e" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Elevated Tank Body - Cylindrical Design */}
          <g transform="translate(-5, -10)">
            {/* Tank Main Body */}
            <rect
              x="0"
              y="0"
              width="50"
              height="40"
              rx="4"
              fill="url(#tankGrad)"
              stroke="#44403c"
              strokeWidth="2"
              filter="url(#dropShadow)"
            />

            {/* Metallic Reinforcement Bands */}
            <rect
              x="0"
              y="8"
              width="50"
              height="2"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
              opacity="0.8"
            />
            <rect
              x="0"
              y="20"
              width="50"
              height="2"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
              opacity="0.8"
            />
            <rect
              x="0"
              y="32"
              width="50"
              height="2"
              fill="#57534e"
              stroke="#292524"
              strokeWidth="0.5"
              opacity="0.8"
            />

            {/* Vertical Seam Lines for Cylindrical Effect */}
            <line x1="15" y1="0" x2="15" y2="40" stroke="#57534e" strokeWidth="0.5" opacity="0.4" />
            <line x1="35" y1="0" x2="35" y2="40" stroke="#57534e" strokeWidth="0.5" opacity="0.4" />

            {/* Tank Top Cap */}
            <ellipse
              cx="25"
              cy="0"
              rx="25"
              ry="4"
              fill="#44403c"
              stroke="#292524"
              strokeWidth="1"
            />
            <ellipse cx="25" cy="0" rx="23" ry="3" fill="#57534e" opacity="0.6" />

            {/* Water Level Indicator */}
            <defs>
              <clipPath id="tankClip">
                <rect x="2" y="2" width="46" height="36" rx="3" />
              </clipPath>
            </defs>
            <g clipPath="url(#tankClip)">
              <rect x="2" y="12" width="46" height="26" fill="url(#waterGrad)" opacity="0.7" />
              {/* Water Surface Ripple */}
              <path
                d="M 2 12 Q 14 10 26 12 T 48 12"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1"
                opacity="0.5"
              />
            </g>

            {/* Level Gauge (External) */}
            <rect
              x="-2"
              y="8"
              width="2"
              height="28"
              rx="1"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
            <line x1="-2" y1="15" x2="0" y2="15" stroke="#94a3b8" strokeWidth="0.5" />
            <line x1="-2" y1="22" x2="0" y2="22" stroke="#94a3b8" strokeWidth="0.5" />
            <line x1="-2" y1="29" x2="0" y2="29" stroke="#94a3b8" strokeWidth="0.5" />
          </g>

          {/* Label */}
          <text
            x="20"
            y="-15"
            textAnchor="middle"
            className="text-[10px] fill-slate-500 font-mono font-bold"
          >
            MAIN TANK
          </text>

          {/* Gradients for Tank */}
          <defs>
            <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#57534e" />
              <stop offset="50%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>
            <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#57534e" />
              <stop offset="20%" stopColor="#78716c" />
              <stop offset="50%" stopColor="#a8a29e" />
              <stop offset="80%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </g>
      </svg>

      <style>{`
        @keyframes dashAnimation {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulseAnimation {
          0%, 100% { opacity: 0.2; stroke-width: 14; }
          50% { opacity: 0.6; stroke-width: 18; }
        }
      `}</style>
    </div>
  );
};
