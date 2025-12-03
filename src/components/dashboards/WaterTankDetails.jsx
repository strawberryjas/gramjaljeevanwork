import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Droplet, Gauge, Thermometer, ArrowLeft, Settings, FlaskConical, Activity, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MaintenanceCard from '../shared/MaintenanceCard';

export const WaterTankDetails = ({ onBack }) => {
  const { state, toggleTankInlet, toggleTankOutlet, isLive } = useSimulationData();
  const tank = state?.overheadTank || {};
  const quality = tank.waterQuality || {};

  // Create history data for charts
  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    level: (tank.tankLevel || 0) + Math.random() * 5,
    volume: (tank.currentVolume || 0) + Math.random() * 100,
    temperature: (tank.temperature || 26) + Math.random() * 2,
    pH: (quality.pH || 7) + Math.random() * 0.2,
  }));

  const qualityData = [
    { parameter: 'pH', value: (quality.pH || 7).toFixed(2), min: 6.5, max: 8.5, status: (quality.pH || 7) >= 6.5 && (quality.pH || 7) <= 8.5 ? 'Good' : 'Out of Range' },
    { parameter: 'Turbidity', value: (quality.turbidity || 0).toFixed(2), min: 0, max: 5, status: (quality.turbidity || 0) <= 5 ? 'Excellent' : 'High', unit: 'NTU' },
    { parameter: 'Chlorine', value: (quality.chlorine || 0).toFixed(2), min: 0.2, max: 1.0, status: (quality.chlorine || 0) >= 0.2 && (quality.chlorine || 0) <= 1 ? 'Good' : 'Adjust', unit: 'mg/L' },
    { parameter: 'TDS', value: (quality.TDS || 0).toFixed(0), min: 0, max: 500, status: (quality.TDS || 0) <= 500 ? 'Good' : 'High', unit: 'ppm' },
    { parameter: 'Temperature', value: (tank.temperature || 26).toFixed(1), min: 15, max: 35, status: (tank.temperature || 26) >= 15 && (tank.temperature || 26) <= 35 ? 'Good' : 'Alert', unit: '°C' },
    { parameter: 'Hardness', value: (quality.hardness || 180).toFixed(0), min: 0, max: 300, status: (quality.hardness || 180) <= 300 ? 'Good' : 'High', unit: 'mg/L' },
    { parameter: 'EC', value: (quality.EC || 450).toFixed(0), min: 0, max: 750, status: (quality.EC || 450) <= 750 ? 'Good' : 'High', unit: 'µS/cm' },
  ];

  const tankMetrics = [
    {
      label: 'Tank Level',
      value: (tank.tankLevel || 0).toFixed(1),
      icon: Droplet,
      color: tank.tankLevel > 60 ? 'green' : tank.tankLevel > 30 ? 'amber' : 'red',
      unit: '%'
    },
    {
      label: 'Current Volume',
      value: (tank.currentVolume || 0).toLocaleString(),
      icon: Activity,
      color: 'blue',
      unit: 'L'
    },
    {
      label: 'Capacity',
      value: (tank.tankCapacity || 10000).toLocaleString(),
      icon: Gauge,
      color: 'emerald',
      unit: 'L'
    },
    {
      label: 'Temperature',
      value: (tank.temperature || 26).toFixed(1),
      icon: Thermometer,
      color: 'blue',
      unit: '°C'
    },
    {
      label: 'Inlet Valve',
      value: tank.inletValveStatus || 'CLOSED',
      icon: Settings,
      color: tank.inletValveStatus === 'OPEN' ? 'green' : 'red',
      unit: ''
    },
    {
      label: 'Outlet Valve',
      value: tank.outletValveStatus || 'CLOSED',
      icon: Settings,
      color: tank.outletValveStatus === 'OPEN' ? 'green' : 'red',
      unit: ''
    }
  ];

  const isWaterSafe = (quality.pH || 7) >= 6.5 && (quality.pH || 7) <= 8.5 && 
                      (quality.turbidity || 0) < 5 && 
                      (quality.chlorine || 0) >= 0.2 && (quality.chlorine || 0) <= 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Droplet className="text-blue-600" size={28} />
              Water Tank Details
            </h2>
            <p className="text-sm text-slate-500">Main Overhead Tank - Complete monitoring and control</p>
          </div>
        </div>
        {isLive && (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            LIVE
          </span>
        )}
      </div>

      {/* Realistic Rural India Overhead Tank */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-0">
          {/* Left: 3D Tank Visualization */}
          <div className="xl:col-span-3 bg-gradient-to-br from-slate-50 to-white p-8 relative overflow-hidden">
            {/* Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white opacity-50"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between gap-6 mb-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tank.isFilling ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    Overhead Water Tank - Elevated Structure
                  </h3>
                  <p className="text-xs text-slate-600">Capacity: {(tank.tankCapacity || 10000).toLocaleString()} Liters • Height: 15m</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg font-bold text-xs flex-shrink-0 ${tank.isFilling
                  ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30' 
                  : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                  {tank.isFilling ? '● FILLING' : tank.tankLevel > 80 ? '● FULL' : tank.tankLevel > 30 ? '● NORMAL' : '● LOW'}
                </div>
              </div>

              {/* Realistic Overhead Tank SVG */}
              <div className="relative flex items-center justify-center py-6">
                {/* Ambient Water Glow */}
                {tank.isFilling && (
                  <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-cyan-500/5 to-transparent animate-pulse" style={{animationDuration: '3s'}}></div>
                )}
                
                <svg viewBox="0 0 800 550" className="w-full h-auto" style={{ maxHeight: '500px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="tankBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#52525b" />
                      <stop offset="50%" stopColor="#71717a" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>
                    
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#0891b2" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#0e7490" stopOpacity="1"/>
                    </linearGradient>
                    
                    <linearGradient id="pillarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3f3f46" />
                      <stop offset="50%" stopColor="#52525b" />
                      <stop offset="100%" stopColor="#27272a" />
                    </linearGradient>
                    
                    <radialGradient id="waterSurfaceGlow">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                    </radialGradient>
                    
                    {/* Shadows */}
                    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                      <feOffset dx="3" dy="6"/>
                      <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ground/Base Platform */}
                  <g>
                    <rect x="100" y="480" width="600" height="60" fill="#27272a" rx="4"/>
                    <rect x="100" y="480" width="600" height="8" fill="#3f3f46" rx="4"/>
                    <rect x="110" y="488" width="580" height="48" fill="#18181b" rx="2"/>
                  </g>

                  {/* Supporting Pillars (4 columns) */}
                  {[180, 340, 460, 620].map((x, i) => (
                    <g key={i} filter="url(#dropShadow)">
                      {/* Main Pillar */}
                      <rect x={x-20} y="220" width="40" height="260" fill="url(#pillarGradient)" rx="3"/>
                      <rect x={x-18} y="222" width="36" height="256" fill="#3f3f46"/>
                      
                      {/* Pillar Rings/Bands */}
                      {[250, 320, 390, 460].map((y, j) => (
                        <rect key={j} x={x-22} y={y} width="44" height="8" fill="#52525b" rx="1"/>
                      ))}
                      
                      {/* Pillar Base */}
                      <rect x={x-28} y="465" width="56" height="20" fill="#52525b" rx="2"/>
                      <rect x={x-25} y="468" width="50" height="14" fill="#3f3f46"/>
                    </g>
                  ))}

                  {/* Support Beams (Horizontal) */}
                  <g>
                    <rect x="140" y="215" width="520" height="15" fill="#52525b" rx="2"/>
                    <rect x="145" y="218" width="510" height="9" fill="#3f3f46"/>
                  </g>

                  {/* Main Water Tank Body (Cylindrical) */}
                  <g filter="url(#dropShadow)">
                    {/* Tank Bottom (Ellipse for 3D effect) */}
                    <ellipse cx="400" cy="220" rx="220" ry="60" fill="#3f3f46" stroke="#52525b" strokeWidth="4"/>
                    
                    {/* Tank Side Walls */}
                    <rect x="180" y="80" width="440" height="140" fill="url(#tankBodyGradient)"/>
                    <rect x="185" y="85" width="430" height="135" fill="#52525b"/>
                    
                    {/* Vertical Bands/Reinforcements */}
                    {[220, 300, 380, 460, 540, 580].map((x, i) => (
                      <rect key={i} x={x} y="80" width="8" height="140" fill="#3f3f46" opacity="0.6"/>
                    ))}
                    
                    {/* Horizontal Bands */}
                    {[100, 140, 180].map((y, i) => (
                      <g key={i}>
                        <rect x="180" y={y} width="440" height="6" fill="#3f3f46"/>
                        <line x1="180" y1={y+3} x2="620" y2={y+3} stroke="#18181b" strokeWidth="1.5"/>
                      </g>
                    ))}
                    
                    {/* Water Inside Tank */}
                    <g clipPath="url(#tankClip)">
                      <defs>
                        <clipPath id="tankClip">
                          <rect x="185" y="85" width="430" height="135"/>
                        </clipPath>
                      </defs>
                      
                      {tank.tankLevel > 0 && (
                        <>
                          {/* Water Body */}
                          <rect 
                            x="185" 
                            y={220 - (tank.tankLevel / 100 * 135)} 
                            width="430" 
                            height={(tank.tankLevel / 100 * 135)} 
                            fill="url(#waterGradient)"
                          >
                            {tank.isFilling && (
                              <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite"/>
                            )}
                          </rect>
                          
                          {/* Water Surface with Wave Effect */}
                          {tank.isFilling && (
                            <>
                              <ellipse 
                                cx="400" 
                                cy={220 - (tank.tankLevel / 100 * 135)} 
                                rx="215" 
                                ry="8" 
                                fill="#22d3ee" 
                                opacity="0.4"
                              >
                                <animate attributeName="ry" values="8;12;8" dur="2.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2.5s" repeatCount="indefinite"/>
                              </ellipse>
                              
                              <ellipse 
                                cx="400" 
                                cy={220 - (tank.tankLevel / 100 * 135)} 
                                rx="200" 
                                ry="6" 
                                fill="#06b6d4" 
                                opacity="0.3"
                              >
                                <animate attributeName="ry" values="6;10;6" dur="3s" repeatCount="indefinite"/>
                              </ellipse>
                            </>
                          )}
                          
                          {/* Water Level Indicator */}
                          <text 
                            x="400" 
                            y={Math.max(100, 215 - (tank.tankLevel / 100 * 135))} 
                            fontSize="32" 
                            fill="#fff" 
                            textAnchor="middle" 
                            fontWeight="bold"
                            opacity="1"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                          >
                            {(tank.tankLevel || 0).toFixed(0)}%
                          </text>
                          {/* Background for better text visibility */}
                          <rect
                            x="330"
                            y={Math.max(123, 238 - (tank.tankLevel / 100 * 135))}
                            width="140"
                            height="22"
                            fill="rgba(0,0,0,0.3)"
                            rx="4"
                          />
                          <text 
                            x="400" 
                            y={Math.max(138, 253 - (tank.tankLevel / 100 * 135))} 
                            fontSize="16" 
                            fill="#fff" 
                            textAnchor="middle"
                            fontWeight="600"
                            opacity="1"
                          >
                            {(tank.currentVolume || 0).toLocaleString()} L
                          </text>
                        </>
                      )}
                    </g>
                    
                    {/* Tank Top (Ellipse for 3D effect) */}
                    <ellipse cx="400" cy="80" rx="220" ry="60" fill="#52525b" stroke="#3f3f46" strokeWidth="4"/>
                    <ellipse cx="400" cy="80" rx="210" ry="55" fill="#3f3f46"/>
                    
                    {/* Manhole/Access Hatch on Top */}
                    <ellipse cx="400" cy="80" rx="35" ry="15" fill="#27272a" stroke="#18181b" strokeWidth="2"/>
                    <ellipse cx="400" cy="80" rx="28" ry="12" fill="#18181b"/>
                    
                    {/* Ladder on Side */}
                    <g>
                      <rect x="630" y="90" width="12" height="130" fill="#52525b" rx="2"/>
                      {[100, 120, 140, 160, 180, 200].map((y, i) => (
                        <rect key={i} x="625" y={y} width="22" height="4" fill="#52525b" rx="1"/>
                      ))}
                    </g>
                  </g>

                  {/* Inlet Pipe (From Bottom) */}
                  <g filter="url(#dropShadow)">
                    <rect x="360" y="220" width="20" height="80" fill="#52525b" rx="2"/>
                    <rect x="362" y="222" width="16" height="76" fill="#3f3f46"/>
                    
                    {/* Valve on Inlet */}
                    <rect x="350" y="280" width="40" height="30" fill="#52525b" rx="3"/>
                    <rect x="355" y="285" width="30" height="20" fill="#3f3f46" rx="2"/>
                    <circle 
                      cx="370" 
                      cy="295" 
                      r="8" 
                      fill={tank.inletValveStatus === 'OPEN' ? '#22c55e' : '#ef4444'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    {tank.inletValveStatus === 'OPEN' && tank.isFilling && (
                      <>
                        <circle cx="370" cy="295" r="12" fill="#22c55e" opacity="0.4">
                          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                        {/* Water flowing animation */}
                        {[0, 1, 2].map((i) => (
                          <circle key={i} cx="370" cy="250" r="3" fill="#06b6d4" opacity="0.6">
                            <animate attributeName="cy" from="300" to="220" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.7" to="0" dur="2s" begin={`${i * 0.7}s`} repeatCount="indefinite"/>
                          </circle>
                        ))}
                      </>
                    )}
                  </g>

                  {/* Outlet Pipe (To Distribution) */}
                  <g filter="url(#dropShadow)">
                    <rect x="420" y="220" width="20" height="80" fill="#52525b" rx="2"/>
                    <rect x="422" y="222" width="16" height="76" fill="#3f3f46"/>
                    
                    {/* Valve on Outlet */}
                    <rect x="410" y="280" width="40" height="30" fill="#52525b" rx="3"/>
                    <rect x="415" y="285" width="30" height="20" fill="#3f3f46" rx="2"/>
                    <circle 
                      cx="430" 
                      cy="295" 
                      r="8" 
                      fill={tank.outletValveStatus === 'OPEN' ? '#22c55e' : '#ef4444'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    {tank.outletValveStatus === 'OPEN' && (
                      <circle cx="430" cy="295" r="12" fill="#22c55e" opacity="0.4">
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                    )}
                  </g>

                  {/* Nameplate */}
                  <rect x="300" y="160" width="200" height="45" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" rx="4"/>
                  <text x="400" y="178" fontSize="14" fill="#78350f" textAnchor="middle" fontWeight="bold">GRAM PANCHAYAT</text>
                  <text x="400" y="193" fontSize="11" fill="#92400e" textAnchor="middle" fontWeight="600">Water Supply Tank</text>
                  <text x="400" y="205" fontSize="8" fill="#92400e" textAnchor="middle">{(tank.tankCapacity || 10000).toLocaleString()}L Capacity</text>

                  {/* Labels */}
                  <text x="370" y="325" fontSize="9" fill="#a1a1aa" textAnchor="middle">INLET</text>
                  <text x="430" y="325" fontSize="9" fill="#a1a1aa" textAnchor="middle">OUTLET</text>
                </svg>
              </div>

            </div>
          </div>

          {/* Right: Control Panel */}
          <div className="xl:col-span-2 bg-gradient-to-br from-white to-slate-50 p-8 border-l-2 border-slate-200">
            <div className="space-y-6">
              {/* Status Display */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 block">
                  Tank Status
                </label>
                <div className="bg-white rounded-xl p-3 md:p-6 border border-slate-200 shadow-lg">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-3 md:mb-4">
                    <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      tank.isFilling
                        ? 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/30' 
                        : tank.tankLevel > 80
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                        : tank.tankLevel > 30
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30'
                        : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30'
                    }`}>
                      <Droplet size={28} className="text-white md:w-9 md:h-9" />
                      {tank.isFilling && (
                        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-slate-400 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-xl md:text-3xl font-black text-black mb-0.5 md:mb-1">
                        {tank.isFilling ? 'FILLING' : tank.tankLevel > 80 ? 'FULL' : tank.tankLevel > 30 ? 'NORMAL' : 'LOW'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2">
                        {tank.isFilling ? (
                          <>
                            <span className="flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-slate-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-600"></span>
                            </span>
                            <span className="hidden md:inline">Water Filling Active</span>
                            <span className="md:hidden">Filling</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span className="hidden md:inline">{tank.tankLevel > 80 ? 'At Capacity' : tank.tankLevel > 30 ? 'Operational' : 'Refill Required'}</span>
                            <span className="md:hidden">{tank.tankLevel > 80 ? 'Full' : tank.tankLevel > 30 ? 'OK' : 'Low'}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Level Indicator */}
                  <div className="w-full bg-slate-200 rounded-full h-2 md:h-3 overflow-hidden">
                    <div 
                      className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                        tank.tankLevel > 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        tank.tankLevel > 30 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                        'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                      style={{ width: `${tank.tankLevel || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Valve Controls */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 block">
                  Valve Controls
                </label>
                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={toggleTankInlet}
                    className={`w-full px-3 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                      tank.inletValveStatus === 'OPEN'
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-red-500/30'
                        : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white shadow-green-500/30'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2 md:gap-3">
                      <Settings size={18} className="md:w-6 md:h-6" />
                      <span className="hidden md:inline">Inlet Valve: {tank.inletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}</span>
                      <span className="md:hidden">Inlet: {tank.inletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}</span>
                    </span>
                  </button>
                  
                  <button
                    onClick={toggleTankOutlet}
                    className={`w-full px-3 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                      tank.outletValveStatus === 'OPEN'
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-red-500/30'
                        : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white shadow-green-500/30'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2 md:gap-3">
                      <Settings size={18} className="md:w-6 md:h-6" />
                      <span className="hidden md:inline">Outlet Valve: {tank.outletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}</span>
                      <span className="md:hidden">Outlet: {tank.outletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Quality Alert */}
      {!isWaterSafe && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-600" />
          <div>
            <p className="font-bold text-red-800">Water Quality Alert</p>
            <p className="text-sm text-red-700">
              One or more quality parameters are outside safe limits. Please review quality metrics below.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {tankMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = metric.color === 'green' ? 'text-green-600' :
                            metric.color === 'red' ? 'text-red-600' :
                            metric.color === 'amber' ? 'text-amber-600' :
                            metric.color === 'blue' ? 'text-blue-600' :
                            'text-emerald-600';
          
          return (
            <div key={idx} className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-4 border-slate-300">
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <Icon size={16} className={`${statusColor} md:w-8 md:h-8`} />
                {metric.color === 'red' && (
                  <AlertTriangle size={14} className="text-red-600 md:w-5 md:h-5" />
                )}
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold">{metric.label}</p>
              <p className="text-xs md:text-3xl font-black text-black mt-1 md:mt-2">
                {metric.value} <span className="text-[10px] md:text-2xl text-gray-500">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Early Fault Detection for Water Tank */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-5">
          <h3 className="font-black text-white flex items-center gap-3 text-xl">
            <AlertTriangle size={24} /> Tank Health & Early Fault Detection
          </h3>
          <p className="text-slate-200 text-sm mt-1">Real-time monitoring and quality analysis</p>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Water Level Monitoring */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-semibold text-slate-600 flex items-center gap-2">
                <Droplet size={16} className="md:w-5 md:h-5" /> Water Level Status
              </span>
              <span className={`text-lg md:text-3xl font-black ${tank.tankLevel < 20 ? 'text-red-600' : tank.tankLevel > 90 ? 'text-amber-600' : 'text-green-600'}`}>
                {(tank.tankLevel || 65).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all ${tank.tankLevel < 20 ? 'bg-red-600' : tank.tankLevel > 90 ? 'bg-amber-600' : 'bg-green-600'}`} style={{width: `${tank.tankLevel || 65}%`}}></div>
            </div>
            <p className="text-xs text-slate-500">{tank.tankLevel < 20 ? '⚠ Critical low level - Initiate refill' : tank.tankLevel > 90 ? '⚠ Near capacity - Monitor overflow' : '✓ Optimal water level'}</p>
          </div>

          {/* Flow Rate Analysis */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-semibold text-slate-600 flex items-center gap-2">
                <Activity size={16} className="md:w-5 md:h-5" /> Inlet Flow Rate
              </span>
              <span className={`text-lg md:text-3xl font-black ${(tank.inletFlowRate || 450) < 300 ? 'text-red-600' : 'text-green-600'}`}>
                {(tank.inletFlowRate || 450).toFixed(0)} L/min
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all ${(tank.inletFlowRate || 450) < 300 ? 'bg-red-600' : 'bg-green-600'}`} style={{width: `${Math.min(100, (tank.inletFlowRate || 450) / 600 * 100)}%`}}></div>
            </div>
            <p className="text-xs text-slate-500">{(tank.inletFlowRate || 450) < 300 ? '⚠ Low flow detected - Check inlet valve or pump' : '✓ Normal inlet flow'}</p>
          </div>

          {/* Temperature Monitoring */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-semibold text-slate-600 flex items-center gap-2">
                <Thermometer size={16} className="md:w-5 md:h-5" /> Water Temperature
              </span>
              <span className="text-lg md:text-3xl font-black text-blue-600">
                {(tank.temperature || 26).toFixed(1)}°C
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="h-3 rounded-full transition-all bg-blue-600" style={{width: `${Math.min(100, (tank.temperature || 26) / 40 * 100)}%`}}></div>
            </div>
            <p className="text-xs text-slate-500">Temperature monitoring (informational only)</p>
          </div>

          {/* Valve Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">Inlet Valve</span>
                <div className={`w-3 h-3 rounded-full ${tank.inletValveStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
              </div>
              <p className="text-lg font-black text-slate-900">{tank.inletValveStatus || 'CLOSED'}</p>
              <p className="text-2xs text-blue-600">{tank.inletValveStatus === 'OPEN' ? '✓ Filling active' : '— Standby'}</p>
            </div>
            
            <div className="space-y-2 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">Outlet Valve</span>
                <div className={`w-3 h-3 rounded-full ${tank.outletValveStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
              </div>
              <p className="text-lg font-black text-slate-900">{tank.outletValveStatus || 'CLOSED'}</p>
              <p className="text-2xs text-blue-600">{tank.outletValveStatus === 'OPEN' ? '✓ Distribution active' : '— Standby'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Water Quality Early Detection */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border-2 border-cyan-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-5 flex items-center justify-between">
          <div>
            <h3 className="font-black text-white flex items-center gap-3 text-xl">
              <FlaskConical size={24} /> Water Quality Monitoring
            </h3>
            <p className="text-cyan-100 text-sm mt-1">Continuous quality assurance and compliance tracking</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-xs font-black ${isWaterSafe ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
            {isWaterSafe ? '✓ SAFE FOR USE' : '⚠ REQUIRES ATTENTION'}
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {qualityData.map((param, idx) => {
            const isGood = param.status === 'Good' || param.status === 'Excellent';
            const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;
            
            return (
              <div key={idx} className="bg-white rounded-xl p-4 border-2 border-cyan-100 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">{param.parameter}</h3>
                  <span className={`px-2 py-1 rounded-full text-2xs font-bold ${
                    param.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                    param.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {param.status}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-2">
                  {param.value} <span className="text-base text-gray-500">{param.unit || ''}</span>
                </p>
                <div className="text-xs text-gray-600 mb-3">
                  Safe: {param.min} - {param.max} {param.unit || ''}
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      isGood ? 'bg-green-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  ></div>
                </div>
                <p className="text-2xs mt-2 text-slate-600">
                  {isGood ? '✓ Within acceptable limits' : '⚠ Corrective action needed'}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Overall Quality Status */}
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          isWaterSafe ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center gap-3">
            {isWaterSafe ? (
              <CheckCircle size={24} className="text-green-600" />
            ) : (
              <AlertTriangle size={24} className="text-red-600" />
            )}
            <div>
              <p className={`font-bold ${isWaterSafe ? 'text-green-800' : 'text-red-800'}`}>
                Overall Water Quality: {isWaterSafe ? 'SAFE FOR CONSUMPTION' : 'REQUIRES ATTENTION'}
              </p>
              <p className={`text-sm ${isWaterSafe ? 'text-green-700' : 'text-red-700'}`}>
                {isWaterSafe 
                  ? 'All parameters are within safe limits as per Bureau of Indian Standards.'
                  : 'One or more parameters need adjustment. Please review and take corrective action.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tank Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Radio size={20} className="text-blue-600" />
          Tank Information & Sensors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Tank ID</span>
              <span className="text-sm font-bold text-black">TANK-001</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Location</span>
              <span className="text-sm font-bold text-black">Village Centre</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Installation Date</span>
              <span className="text-sm font-bold text-black">2023-01-15</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Last Inspection</span>
              <span className="text-sm font-bold text-black">7 days ago</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Level Sensor</span>
              <span className="text-sm font-bold text-green-600">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Quality Sensor</span>
              <span className="text-sm font-bold text-green-600">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Temperature Sensor</span>
              <span className="text-sm font-bold text-green-600">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Battery Level</span>
              <span className="text-sm font-bold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};



