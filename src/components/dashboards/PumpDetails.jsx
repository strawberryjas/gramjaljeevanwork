import React, { useState, useMemo, useCallback } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Power, Gauge, Zap, Thermometer, Activity, ArrowLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MaintenanceCard from '../shared/MaintenanceCard';

const formatDuration = (ms = 0) => {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  return `${seconds}s`;
};

const toLocalInputValue = (date) => {
  if (!(date instanceof Date)) return '';
  const pad = (num) => `${num}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatStopLabel = (value) => {
  if (!value) return '—';
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Constants
const COLOR_MAP = {
  green: 'text-green-600',
  red: 'text-red-600',
  amber: 'text-amber-600',
  blue: 'text-blue-600',
  cyan: 'text-cyan-600',
  orange: 'text-orange-600',
  emerald: 'text-emerald-600',
  purple: 'text-purple-600',
  gray: 'text-gray-600'
};

const HOUR_LIMITS = {
  day: 24,
  week: 168,
  month: 720
};

export const PumpDetails = ({ onBack }) => {
  const {
    state,
    togglePump,
    isLive,
    schedulePumpTimer,
    schedulePumpStop,
    cancelPumpSchedule
  } = useSimulationData();

  const pump = state?.pumpHouse || {};
  const schedule = state?.pumpSchedule || {};
  
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [scheduledStop, setScheduledStop] = useState(() => toLocalInputValue(new Date(Date.now() + 30 * 60 * 1000)));

  // Memoized derived values
  const isPumpOn = useMemo(() => pump.pumpStatus === 'ON', [pump.pumpStatus]);
  const isTimerActive = useMemo(() => schedule.mode === 'TIMER', [schedule.mode]);
  const isStopScheduled = useMemo(() => schedule.mode === 'SCHEDULED', [schedule.mode]);
  const countdownLabel = useMemo(() => formatDuration(schedule.timerRemainingMs), [schedule.timerRemainingMs]);
  const stopLabel = useMemo(() => formatStopLabel(schedule.timerEnd), [schedule.timerEnd]);

  // Event handlers with useCallback
  const handleTimerStart = useCallback(() => {
    const minutes = Math.max(1, Number(timerMinutes) || 0);
    const result = schedulePumpTimer(minutes);
    if (!result?.success) {
      console.warn('Unable to start pump timer', result?.reason);
    }
  }, [timerMinutes, schedulePumpTimer]);

  const handleScheduleStop = useCallback(() => {
    if (!scheduledStop) return;
    const result = schedulePumpStop(scheduledStop);
    if (!result?.success) {
      console.warn('Unable to schedule pump stop', result?.reason);
    }
  }, [scheduledStop, schedulePumpStop]);

  const handleClearSchedule = useCallback(() => {
    cancelPumpSchedule('USER_CLEAR');
  }, [cancelPumpSchedule]);

  // Memoized history data for charts
  const historyData = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      time: `${i * 5}m`,
      pressure: (pump.pumpPressureOutput || 0) + Math.random() * 0.5,
      flow: (pump.pumpFlowOutput || 0) + Math.random() * 10,
      power: (pump.powerConsumption || 0) + Math.random() * 0.5,
      efficiency: (pump.pumpEfficiency || 0) + Math.random() * 2,
    })), [pump.pumpPressureOutput, pump.pumpFlowOutput, pump.powerConsumption, pump.pumpEfficiency]);

  // Memoized metrics configuration
  const pumpMetrics = useMemo(() => [
    {
      label: 'Status',
      value: pump.pumpStatus || 'OFF',
      icon: Power,
      color: isPumpOn ? 'green' : 'gray',
      unit: ''
    },
    {
      label: 'Flow Rate',
      value: (pump.pumpFlowOutput || 0).toFixed(1),
      icon: Activity,
      color: 'orange',
      unit: 'L/min'
    },
    {
      label: 'Pressure',
      value: (pump.pumpPressureOutput || 0).toFixed(2),
      icon: Gauge,
      color: 'orange',
      unit: 'Bar'
    },
    {
      label: 'Power Consumption',
      value: (pump.powerConsumption || 0).toFixed(2),
      icon: Zap,
      color: 'purple',
      unit: 'kW'
    },
    {
      label: 'Motor Temperature',
      value: (pump.motorTemperature || 25).toFixed(1),
      icon: Thermometer,
      color: pump.motorTemperature > 65 ? 'red' : 'amber',
      unit: '°C'
    },
    {
      label: 'Efficiency',
      value: (pump.pumpEfficiency || 0).toFixed(1),
      icon: CheckCircle,
      color: pump.pumpEfficiency > 70 ? 'green' : 'amber',
      unit: '%'
    }
  ], [pump.pumpStatus, pump.pumpFlowOutput, pump.pumpPressureOutput, pump.powerConsumption, pump.motorTemperature, pump.pumpEfficiency, isPumpOn]);

  // Memoized maintenance metrics
  const maintenanceMetrics = useMemo(() => [
    { label: "Operation Cycles", value: pump.operationCycles?.toLocaleString() || "0", subtext: "Total on/off cycles" },
    { label: "Running Hours", value: `${(pump.pumpRunningHours || 0).toFixed(1)} hrs`, subtext: "Lifetime runtime" },
    { label: "Vibration Level", value: `${pump.vibration?.toFixed(1) || "0"} mm/s`, subtext: pump.vibration > 8 ? "⚠️ High" : "✓ Normal" },
    { label: "Motor Temperature", value: `${pump.motorTemperature?.toFixed(1) || "0"}°C`, subtext: pump.motorTemperature > 65 ? "⚠️ Hot" : "✓ Normal" }
  ], [pump.operationCycles, pump.pumpRunningHours, pump.vibration, pump.motorTemperature]);

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
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Power size={28} className="text-green-600 md:w-9 md:h-9" />
              Pump Station Details
            </h2>
            <p className="text-sm md:text-lg text-slate-500">Complete pump monitoring and control</p>
          </div>
        </div>
        {isLive && (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            LIVE
          </span>
        )}
      </div>

      {/* Ultra-Realistic Centrifugal Pump Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl overflow-hidden shadow-lg border-2 border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left: 3D Pump Visualization */}
          <div className="lg:col-span-3 bg-gradient-to-br from-slate-100 to-slate-50 p-4 md:p-5 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Industrial Floor Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              {/* Header Label */}
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-sm md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isPumpOn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    Pump Unit
                  </h3>
                  <p className="text-[10px] md:text-sm text-slate-500 mt-0.5 md:mt-1">KIRLOSKAR KDS-2050</p>
                </div>
                <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-[10px] md:text-sm border-2 ${isPumpOn 
                  ? 'bg-green-50 text-green-700 border-green-300' 
                  : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                  {isPumpOn ? '● RUNNING' : '○ STOPPED'}
                </div>
              </div>

              {/* Realistic External Pump View */}
              <div className="relative flex items-center justify-center py-4 md:py-8">
                {/* Ambient Effects when Running */}
                {isPumpOn && (
                  <>
                    <div className="absolute inset-0 bg-gradient-radial from-green-100 via-blue-50 to-transparent animate-pulse" style={{animationDuration: '3s'}}></div>
                  </>
                )}
                
                <svg viewBox="0 0 900 450" className="w-full h-auto" style={{ maxHeight: '450px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
                  <defs>
                    {/* Premium Metallic Gradients */}
                    <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#71717a" />
                      <stop offset="50%" stopColor="#a1a1aa" />
                      <stop offset="100%" stopColor="#52525b" />
                    </linearGradient>
                    
                    <linearGradient id="motorBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#27272a" />
                      <stop offset="30%" stopColor="#3f3f46" />
                      <stop offset="70%" stopColor="#27272a" />
                      <stop offset="100%" stopColor="#18181b" />
                    </linearGradient>
                    
                    <linearGradient id="pumpBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="40%" stopColor="#2563eb" />
                      <stop offset="70%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    
                    <radialGradient id="statusGlow">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#22c55e" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                    </radialGradient>
                    
                    <radialGradient id="vibrationGlow">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                    </radialGradient>
                    
                    {/* Shadow Filters */}
                    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                      <feOffset dx="3" dy="6" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    <filter id="insetShadow">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="2" dy="2"/>
                      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                      <feBlend in2="SourceGraphic" mode="multiply"/>
                    </filter>
                  </defs>

                  {/* Concrete Foundation with Mounting */}
                  <g>
                    <rect x="120" y="340" width="660" height="70" fill="#3f3f46" rx="6"/>
                    <rect x="120" y="340" width="660" height="12" fill="#52525b" rx="6"/>
                    <rect x="130" y="348" width="640" height="55" fill="#27272a" rx="4" filter="url(#insetShadow)"/>
                    
                    {/* Anchor Bolts */}
                    {[180, 720].map((x) => (
                      <g key={x}>
                        <rect x={x-10} y="325" width="20" height="35" fill="#52525b" rx="3"/>
                        <circle cx={x} cy="322" r="12" fill="#71717a" stroke="#27272a" strokeWidth="2.5"/>
                        <circle cx={x} cy="322" r="6" fill="#18181b"/>
                        <circle cx={x} cy="322" r="3" fill="#3f3f46"/>
                      </g>
                    ))}
                  </g>

                  {/* Inlet/Suction Pipe */}
                  <g filter="url(#dropShadow)">
                    <rect x="60" y="280" width="170" height="55" fill="url(#pipeGradient)" rx="6"/>
                    <rect x="65" y="285" width="160" height="45" fill="#27272a" rx="5" filter="url(#insetShadow)"/>
                    <line x1="70" y1="292" x2="220" y2="292" stroke="#52525b" strokeWidth="2.5"/>
                    <line x1="70" y1="322" x2="220" y2="322" stroke="#18181b" strokeWidth="2.5"/>
                    
                    {/* Flange Connection */}
                    <ellipse cx="230" cy="307" rx="40" ry="48" fill="#52525b" stroke="#27272a" strokeWidth="3.5"/>
                    <ellipse cx="230" cy="307" rx="28" ry="36" fill="#18181b"/>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <circle 
                        key={`suction-${angle}`}
                        cx={230 + Math.cos(angle * Math.PI / 180) * 32} 
                        cy={307 + Math.sin(angle * Math.PI / 180) * 40}
                        r="5" 
                        fill="#27272a"
                        stroke="#18181b"
                        strokeWidth="1.5"
                      />
                    ))}
                    
                    {/* Water Flow Animation */}
                    {isPumpOn && (
                      <>
                        {[0, 1, 2, 3].map((i) => (
                          <circle 
                            key={`suction-flow-${i}`}
                            cx="80" 
                            cy={295 + (i * 8)} 
                            r={4 + Math.random() * 2} 
                            fill="#3b82f6" 
                            opacity="0.4"
                          >
                            <animate attributeName="cx" from="80" to="220" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.5" to="0" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"/>
                          </circle>
                        ))}
                      </>
                    )}
                  </g>

                  {/* Main Pump Body (Closed Volute Casing) */}
                  <g filter="url(#dropShadow)">
                    {/* Outer Casing Shell */}
                    <ellipse cx="350" cy="240" rx="140" ry="130" fill="url(#pumpBodyGradient)" stroke="#1e3a8a" strokeWidth="5"/>
                    <ellipse cx="350" cy="240" rx="130" ry="120" fill="#1e40af" filter="url(#insetShadow)"/>
                    
                    {/* Metallic Highlights */}
                    <ellipse cx="340" cy="220" rx="60" ry="55" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.3"/>
                    <ellipse cx="360" cy="250" rx="45" ry="40" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2"/>
                    
                    {/* Assembly Bolts */}
                    {[[280, 160], [420, 160], [460, 240], [420, 320], [280, 320], [240, 240]].map(([x, y], i) => (
                      <g key={`bolt-${i}`}>
                        <circle cx={x} cy={y} r="10" fill="#64748b" stroke="#27272a" strokeWidth="2.5"/>
                        <circle cx={x} cy={y} r="5" fill="#27272a"/>
                        <circle cx={x} cy={y} r="2" fill="#18181b"/>
                      </g>
                    ))}
                    
                    {/* Vibration/Running Effect */}
                    {isPumpOn && (
                      <>
                        <ellipse cx="350" cy="240" rx="145" ry="135" fill="url(#vibrationGlow)" opacity="0.4">
                          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse cx="350" cy="240" rx="155" ry="145" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.2">
                          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="1.5s" repeatCount="indefinite"/>
                          <animate attributeName="rx" values="155;160;155" dur="2s" repeatCount="indefinite"/>
                          <animate attributeName="ry" values="145;150;145" dur="2s" repeatCount="indefinite"/>
                        </ellipse>
                      </>
                    )}
                    
                    {/* Brand Nameplate */}
                    <rect x="305" y="280" width="90" height="35" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" rx="4"/>
                    <text x="350" y="297" fontSize="11" fill="#78350f" textAnchor="middle" fontWeight="bold">KIRLOSKAR</text>
                    <text x="350" y="308" fontSize="8" fill="#92400e" textAnchor="middle" fontWeight="600">KDS-2050</text>
                  </g>

                  {/* Outlet/Discharge Pipe */}
                  <g filter="url(#dropShadow)">
                    <rect x="60" y="180" width="170" height="55" fill="url(#pipeGradient)" rx="6"/>
                    <rect x="65" y="185" width="160" height="45" fill="#27272a" rx="5" filter="url(#insetShadow)"/>
                    <line x1="70" y1="192" x2="220" y2="192" stroke="#52525b" strokeWidth="2.5"/>
                    <line x1="70" y1="222" x2="220" y2="222" stroke="#18181b" strokeWidth="2.5"/>
                    
                    {/* Flange Connection */}
                    <ellipse cx="230" cy="207" rx="40" ry="48" fill="#52525b" stroke="#27272a" strokeWidth="3.5"/>
                    <ellipse cx="230" cy="207" rx="28" ry="36" fill="#18181b"/>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <circle 
                        key={`discharge-${angle}`}
                        cx={230 + Math.cos(angle * Math.PI / 180) * 32} 
                        cy={207 + Math.sin(angle * Math.PI / 180) * 40}
                        r="5" 
                        fill="#27272a"
                        stroke="#18181b"
                        strokeWidth="1.5"
                      />
                    ))}
                    
                    {/* Water Flow Animation (Opposite Direction) */}
                    {isPumpOn && (
                      <>
                        {[0, 1, 2, 3].map((i) => (
                          <circle 
                            key={`discharge-flow-${i}`}
                            cx="200" 
                            cy={195 + (i * 8)} 
                            r={5 + Math.random() * 2} 
                            fill="#22c55e" 
                            opacity="0.5"
                          >
                            <animate attributeName="cx" from="200" to="70" dur={`${0.9 + i * 0.2}s`} repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.6" to="0" dur={`${0.9 + i * 0.2}s`} repeatCount="indefinite"/>
                          </circle>
                        ))}
                      </>
                    )}
                  </g>

                  {/* Coupling/Shaft Housing */}
                  <g>
                    <rect x="480" y="220" width="60" height="40" fill="#52525b" rx="4"/>
                    <rect x="485" y="225" width="50" height="30" fill="#3f3f46" rx="2" filter="url(#insetShadow)"/>
                    <line x1="490" y1="235" x2="530" y2="235" stroke="#71717a" strokeWidth="2"/>
                    <line x1="490" y1="245" x2="530" y2="245" stroke="#27272a" strokeWidth="2"/>
                    
                    {/* Coupling Bolts */}
                    {[[495, 230], [525, 230], [495, 250], [525, 250]].map(([x, y], i) => (
                      <circle key={`coupling-${i}`} cx={x} cy={y} r="3" fill="#18181b"/>
                    ))}
                  </g>

                  {/* Electric Motor Assembly */}
                  <g filter="url(#dropShadow)">
                    {/* Motor Housing */}
                    <ellipse cx="600" cy="240" rx="110" ry="130" fill="url(#motorBodyGradient)" stroke="#52525b" strokeWidth="5"/>
                    <ellipse cx="600" cy="240" rx="100" ry="120" fill="#18181b"/>
                    
                    {/* Cooling Fins (External Ribs) */}
                    {[...Array(16)].map((_, i) => (
                      <rect 
                        key={`fin-${i}`}
                        x="540" 
                        y={135 + i * 13} 
                        width="120" 
                        height="6" 
                        fill="#3f3f46"
                        rx="1.5"
                        opacity="0.9"
                      />
                    ))}
                    
                    {/* Terminal Box */}
                    <rect x="670" y="210" width="50" height="50" fill="#3f3f46" stroke="#52525b" strokeWidth="2.5" rx="3"/>
                    <rect x="675" y="215" width="40" height="40" fill="#27272a" rx="2"/>
                    
                    {/* Three-Phase Terminals */}
                    <circle cx="695" cy="230" r="4" fill="#ef4444"/>
                    <circle cx="695" cy="242" r="4" fill="#eab308"/>
                    <circle cx="695" cy="254" r="4" fill="#3b82f6"/>
                    <text x="708" y="233" fontSize="7" fill="#a1a1aa">R</text>
                    <text x="708" y="245" fontSize="7" fill="#a1a1aa">Y</text>
                    <text x="708" y="257" fontSize="7" fill="#a1a1aa">B</text>
                    
                    {/* Motor Nameplate */}
                    <rect x="548" y="285" width="104" height="42" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" rx="4"/>
                    <text x="600" y="301" fontSize="12" fill="#78350f" textAnchor="middle" fontWeight="bold">KIRLOSKAR</text>
                    <text x="600" y="313" fontSize="9" fill="#92400e" textAnchor="middle" fontWeight="600">5.0 HP • 415V</text>
                    <text x="600" y="323" fontSize="7" fill="#92400e" textAnchor="middle">2900 RPM • 50Hz • 3Ph</text>
                    
                    {/* Status Indicator LED */}
                    <circle 
                      cx="690" 
                      cy="175" 
                      r="12" 
                      fill={isPumpOn ? '#22c55e' : '#3f3f46'}
                      stroke={isPumpOn ? '#10b981' : '#27272a'}
                      strokeWidth="2.5"
                    />
                    {isPumpOn && (
                      <circle cx="690" cy="175" r="18" fill="url(#statusGlow)" opacity="0.6">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    )}
                    <circle cx="690" cy="175" r="7" fill={isPumpOn ? '#86efac' : '#52525b'}/>
                    
                    {/* Motor Vibration Effect */}
                    {isPumpOn && (
                      <ellipse cx="600" cy="240" rx="115" ry="135" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.2">
                        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="1s" repeatCount="indefinite"/>
                      </ellipse>
                    )}
                  </g>

                  {/* Pressure Gauge */}
                  <g>
                    <circle cx="130" cy="140" r="32" fill="#27272a" stroke="#52525b" strokeWidth="3.5"/>
                    <circle cx="130" cy="140" r="26" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5"/>
                    
                    {/* Gauge Markings */}
                    {[0, 30, 60, 90, 120, 150, 180].map((angle) => (
                      <line
                        key={`gauge-${angle}`}
                        x1={130 + Math.cos((angle - 90) * Math.PI / 180) * 20}
                        y1={140 + Math.sin((angle - 90) * Math.PI / 180) * 20}
                        x2={130 + Math.cos((angle - 90) * Math.PI / 180) * 24}
                        y2={140 + Math.sin((angle - 90) * Math.PI / 180) * 24}
                        stroke="#71717a"
                        strokeWidth="2"
                      />
                    ))}
                    
                    {/* Gauge Needle with Smooth Animation */}
                    <line
                      x1="130"
                      y1="140"
                      x2={130 + Math.cos((isPumpOn ? (pump.pumpPressureOutput || 3) * 28 - 90 : -90) * Math.PI / 180) * 20}
                      y2={140 + Math.sin((isPumpOn ? (pump.pumpPressureOutput || 3) * 28 - 90 : -90) * Math.PI / 180) * 20}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    <circle cx="130" cy="140" r="4" fill="#ef4444"/>
                  <text x="130" y="172" fontSize="10" fill="#a1a1aa" textAnchor="middle" fontWeight="bold">PRESSURE</text>
                  <text x="130" y="182" fontSize="9" fill="#71717a" textAnchor="middle">BAR</text>
                </g>

                {/* Pipe Labels */}
                <text x="135" y="165" fontSize="11" fill="#71717a" textAnchor="middle">↑ DISCHARGE</text>
                <text x="135" y="350" fontSize="11" fill="#71717a" textAnchor="middle">↓ SUCTION</text>
                <text x="600" y="150" fontSize="11" fill="#71717a" textAnchor="middle">MOTOR</text>
                </svg>
              </div>

              {/* Pump Scheduler - Compact */}
              <div className="mt-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <svg className="w-3 h-3 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xs md:text-xl font-bold text-white">Scheduler</h3>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <span className="px-1.5 md:px-4 py-0.5 md:py-2 rounded-md bg-white/20 border border-white/30 text-[9px] md:text-base font-bold text-white">
                        {schedule.mode || 'MANUAL'}
                      </span>
                      {(schedule.timerRemainingMs > 0 || isStopScheduled) && (
                        <span className={`px-1.5 md:px-4 py-0.5 md:py-2 rounded-md text-[9px] md:text-base font-bold text-white ${isTimerActive ? 'bg-green-500' : 'bg-blue-500'}`}>
                          {isTimerActive ? countdownLabel : stopLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2 md:p-5 space-y-2 md:space-y-4">
                  {/* Timer Controls - Compact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {/* Run Timer */}
                    <div className="bg-white rounded-md border border-cyan-200 p-2 md:p-4 shadow-sm">
                      <label className="flex items-center gap-1 md:gap-2 text-[9px] md:text-base font-semibold text-cyan-700 mb-1.5 md:mb-3">
                        <svg className="w-2.5 h-2.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Run Timer
                      </label>
                      <div className="flex gap-1.5 md:gap-3">
                        <input
                          type="number"
                          min={1}
                          max={240}
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(e.target.value)}
                          placeholder="Min"
                          className="flex-1 bg-cyan-50 border border-cyan-300 rounded px-2 py-1 md:px-4 md:py-3 text-[10px] md:text-base text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <button
                          onClick={handleTimerStart}
                          className="px-2 md:px-6 py-1 md:py-3 rounded bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] md:text-base font-bold hover:from-green-600 hover:to-green-700 transition-all"
                        >
                          Start
                        </button>
                      </div>
                    </div>

                    {/* Schedule Stop */}
                    <div className="bg-white rounded-md border border-cyan-200 p-2 md:p-4 shadow-sm">
                      <label className="flex items-center gap-1 md:gap-2 text-[9px] md:text-base font-semibold text-cyan-700 mb-1.5 md:mb-3">
                        <svg className="w-2.5 h-2.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Stop Time
                      </label>
                      <div className="flex gap-1.5 md:gap-3">
                        <input
                          type="datetime-local"
                          value={scheduledStop || ''}
                          onChange={(e) => setScheduledStop(e.target.value)}
                          className="flex-1 bg-cyan-50 border border-cyan-300 rounded px-2 py-1 md:px-4 md:py-3 text-[10px] md:text-base text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <button
                          onClick={handleScheduleStop}
                          className="px-2 md:px-6 py-1 md:py-3 rounded bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] md:text-base font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status - Compact */}
                  {(schedule.timerRemainingMs > 0 || isStopScheduled) && (
                    <div className="flex items-center justify-between gap-2 bg-white rounded-md p-2 border border-cyan-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] md:text-xs text-cyan-600 font-medium">Next Stop</p>
                        <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{isTimerActive ? countdownLabel : stopLabel}</p>
                      </div>
                      <button
                        onClick={handleClearSchedule}
                        className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[9px] md:text-xs font-semibold transition-colors shrink-0"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Control Panel */}
          <div className="lg:col-span-2 bg-white p-4 md:p-6">
            <div className="space-y-4 md:space-y-5">
              {/* Status Display */}
              <div>
                <label className="text-[10px] md:text-base font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                  Operational Status
                </label>
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 md:p-6 border-2 border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`relative w-12 h-12 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isPumpOn 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20 border-green-400' 
                        : 'bg-gradient-to-br from-slate-200 to-slate-300 border-slate-400'
                    }`}>
                      <Power size={24} className="text-white md:w-12 md:h-12" />
                      {isPumpOn && (
                        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-green-400 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xl md:text-[2.5rem] md:leading-tight font-black text-slate-800 mb-0.5 md:mb-2">
                        {pump.pumpStatus || 'OFF'}
                      </p>
                      <p className="text-[10px] md:text-lg text-slate-500 flex items-center gap-1.5 md:gap-2">
                        {isPumpOn ? (
                          <>
                            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2">
                              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-600"></span>
                            </span>
                            Active Operation
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-400"></span>
                            Standby Mode
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Metrics */}
              <div>
                <label className="text-[10px] md:text-base font-semibold text-slate-600 uppercase tracking-wider mb-2 md:mb-3 block">
                  Live Parameters
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-cyan-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Activity size={14} className="text-cyan-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-cyan-700 font-semibold">Flow Rate</p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-cyan-700">
                      {(pump.pumpFlowOutput || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-cyan-600 mt-0.5 md:mt-1">L/min</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Gauge size={14} className="text-blue-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-blue-700 font-semibold">Pressure</p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-blue-700">
                      {(pump.pumpPressureOutput || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] md:text-base text-blue-600 mt-0.5 md:mt-1">bar</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-yellow-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Zap size={14} className="text-yellow-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-yellow-700 font-semibold">Power</p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-yellow-700">
                      {(pump.powerConsumption || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-yellow-600 mt-0.5 md:mt-1">kW</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Thermometer size={14} className="text-orange-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-orange-700 font-semibold">Temperature</p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-orange-700">
                      {(pump.motorTemperature || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-orange-600 mt-0.5 md:mt-1">°C</p>
                  </div>
                </div>
              </div>

              {/* Performance Monitoring */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Activity size={16} className="text-slate-600 md:w-7 md:h-7" />
                  <h4 className="text-xs md:text-xl font-bold text-slate-700">Performance Monitoring</h4>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {/* Efficiency Monitoring */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-base font-semibold text-slate-600 flex items-center gap-1">
                        <Activity size={12} className="md:w-5 md:h-5" /> Pump Efficiency
                      </span>
                      <span className={`text-sm md:text-[1.75rem] md:leading-tight font-black ${pump.pumpEfficiency < 70 ? 'text-amber-600' : 'text-green-600'}`}>
                        {(pump.pumpEfficiency || 85).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                      <div className={`h-2 md:h-3 rounded-full transition-all ${pump.pumpEfficiency < 70 ? 'bg-amber-600' : 'bg-green-600'}`} style={{width: `${pump.pumpEfficiency || 85}%`}}></div>
                    </div>
                    <p className="text-[9px] md:text-sm text-slate-500">{pump.pumpEfficiency < 70 ? '⚠ Check impeller' : '✓ Optimal'}</p>
                  </div>

                  {/* Pressure Monitoring */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-base font-semibold text-slate-600 flex items-center gap-1">
                        <Gauge size={12} className="md:w-5 md:h-5" /> Output Pressure
                      </span>
                      <span className={`text-sm md:text-[1.75rem] md:leading-tight font-black ${pump.pumpPressureOutput < 2.5 ? 'text-red-600' : 'text-green-600'}`}>
                        {(pump.pumpPressureOutput || 0).toFixed(2)} bar
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                      <div className={`h-2 md:h-3 rounded-full transition-all ${pump.pumpPressureOutput < 2.5 ? 'bg-red-600' : 'bg-green-600'}`} style={{width: `${Math.min(100, (pump.pumpPressureOutput || 3.5) / 5 * 100)}%`}}></div>
                    </div>
                    <p className="text-[9px] md:text-sm text-slate-500">{pump.pumpPressureOutput < 2.5 ? '⚠ Low pressure' : '✓ Normal'}</p>
                  </div>
                </div>
              </div>

              {/* Control Button */}
              <button
                onClick={togglePump}
                className={`w-full px-4 md:px-6 py-3 md:py-5 rounded-lg md:rounded-xl font-bold text-base md:text-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                  isPumpOn
                    ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-red-500/30'
                    : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white shadow-green-500/30'
                }`}
              >
                <span className="flex items-center justify-center gap-3">
                  {isPumpOn ? (
                    <>
                      <Power size={24} />
                      STOP PUMP
                    </>
                  ) : (
                    <>
                      <Power size={24} />
                      START PUMP
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {pumpMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = COLOR_MAP[metric.color] || COLOR_MAP.gray;

          return (
            <div key={idx} className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-2 md:border-l-4 border-slate-300">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-1 md:mb-3">
                <Icon size={20} className={`${statusColor} md:w-12 md:h-12`} />
                {metric.color === 'red' && (
                  <AlertTriangle size={16} className="text-red-600 md:w-6 md:h-6" />
                )}
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold leading-tight">{metric.label}</p>
              <p className="text-sm md:text-[2rem] md:leading-tight font-black text-black mt-1 md:mt-2">
                {metric.value} <span className="text-[10px] md:text-2xl text-gray-500">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-2xl p-4 md:p-6 border-2 border-slate-200">
        <h3 className="text-xl md:text-3xl font-black text-slate-800 mb-6 md:mb-5 flex items-center gap-3">
          <Clock size={24} className="text-slate-600 md:w-9 md:h-9" />
          Pump Information
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-500 rounded-full"></span>
              Basic Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Pump ID</span>
                <span className="text-base md:text-xl font-black text-slate-900">PUMP-001</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Voltage</span>
                <span className="text-base md:text-xl font-black text-slate-900">{(pump.voltage || 220).toFixed(1)} V</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Power Factor</span>
                <span className="text-base md:text-xl font-black text-slate-900">{(pump.powerFactor || 0.95).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg text-gray-600">Discharge Rate</span>
                <span className="text-base md:text-xl font-black text-slate-900">{(pump.pumpDischargeRate || 0).toFixed(1)} L/min</span>
              </div>
            </div>
          </div>

          {/* Running Hours */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border-2 border-emerald-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-emerald-700 font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Running Hours Analysis
            </h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Total Runtime</span>
                <p className="text-2xl md:text-4xl font-black text-emerald-600 mt-1">{(pump.pumpRunningHours || 0).toFixed(1)} hrs</p>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm md:text-lg text-gray-600">Today</span>
                <span className="text-base md:text-xl font-bold text-slate-900">{Math.min((pump.pumpRunningHours || 0), HOUR_LIMITS.day).toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm md:text-lg text-gray-600">This Week</span>
                <span className="text-base md:text-xl font-bold text-slate-900">{Math.min((pump.pumpRunningHours || 0), HOUR_LIMITS.week).toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg text-gray-600">This Month</span>
                <span className="text-base md:text-xl font-bold text-slate-900">{Math.min((pump.pumpRunningHours || 0), HOUR_LIMITS.month).toFixed(1)} hrs</span>
              </div>
            </div>
          </div>

          {/* Maintenance & Health */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border-2 border-amber-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-amber-700 font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Maintenance & Health
            </h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Last Maintenance</span>
                <p className="text-xl md:text-3xl font-black text-amber-600 mt-1">7 days ago</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Next Scheduled</span>
                <p className="text-xl md:text-3xl font-black text-slate-900 mt-1">23 days</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600 md:w-6 md:h-6" />
                  <span className="text-sm md:text-lg font-bold text-green-700">System Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};



