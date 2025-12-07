import React, { useState, useMemo, useCallback } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import {
  Power,
  Gauge,
  Zap,
  Thermometer,
  Activity,
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
  gray: 'text-gray-600',
};

const HOUR_LIMITS = {
  day: 24,
  week: 168,
  month: 720,
};

export const PumpDetails = ({ onBack }) => {
  const { state, togglePump, isLive, schedulePumpTimer, schedulePumpStop, cancelPumpSchedule } =
    useSimulationData();

  const pump = state?.pumpHouse || {};
  const schedule = state?.pumpSchedule || {};

  const [timerMinutes, setTimerMinutes] = useState(15);
  const [scheduledStop, setScheduledStop] = useState(() =>
    toLocalInputValue(new Date(Date.now() + 30 * 60 * 1000))
  );
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);

  // Memoized derived values
  const isPumpOn = useMemo(() => pump.pumpStatus === 'ON', [pump.pumpStatus]);

  // Track accumulated running hours
  const [dailyRunningHours, setDailyRunningHours] = useState(0);
  const [weeklyRunningHours, setWeeklyRunningHours] = useState(0);
  const [monthlyRunningHours, setMonthlyRunningHours] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Real-time flow rate graph data with multiple granularity levels
  const [heartbeatData, setHeartbeatData] = useState(() => 
    Array.from({ length: 300 }, (_, i) => ({
      index: i,
      time: '',
      flow: 0,
    }))
  );
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = hours, 2 = minutes, 3 = seconds
  
  // Reset data when zoom level changes
  React.useEffect(() => {
    setHeartbeatData(Array.from({ length: 300 }, (_, i) => ({
      index: i,
      time: '',
      flow: 0,
    })));
  }, [zoomLevel]);

  // Update running hours when pump is on
  React.useEffect(() => {
    if (isPumpOn) {
      const interval = setInterval(() => {
        const now = Date.now();
        const hoursPassed = (now - lastUpdateTime) / (1000 * 60 * 60);
        
        setDailyRunningHours(prev => Math.min(prev + hoursPassed, 24));
        setWeeklyRunningHours(prev => Math.min(prev + hoursPassed, 168));
        setMonthlyRunningHours(prev => Math.min(prev + hoursPassed, 720));
        setLastUpdateTime(now);
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [isPumpOn, lastUpdateTime]);

  // Real-time flow rate visualization with scrolling data
  React.useEffect(() => {
    const updateInterval = zoomLevel === 3 ? 100 : zoomLevel === 2 ? 1000 : 5000;
    
    const interval = setInterval(() => {
      const now = new Date();
      const flowRate = pump.pumpFlowOutput || 150;
      
      // Current flow rate based on pump status
      let flow = 0;
      if (isPumpOn) {
        // Add small variation to simulate real-time fluctuation (±5%)
        const variation = (Math.random() - 0.5) * 0.1;
        flow = flowRate * (1 + variation);
      } else {
        flow = 0; // Zero when pump is off
      }
      
      // Format time based on zoom level
      let timeLabel = '';
      if (zoomLevel === 1) {
        timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      } else if (zoomLevel === 2) {
        timeLabel = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      } else {
        timeLabel = `${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100)}`;
      }
      
      setHeartbeatData(prevData => {
        // Shift data left and add new point on the right
        const newData = [...prevData.slice(1), {
          index: prevData[prevData.length - 1]?.index ? prevData[prevData.length - 1].index + 1 : 0,
          time: timeLabel,
          flow: flow,
        }];
        
        return newData;
      });
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [isPumpOn, pump.pumpFlowOutput]);
  const isTimerActive = useMemo(() => schedule.mode === 'TIMER', [schedule.mode]);
  const isStopScheduled = useMemo(() => schedule.mode === 'SCHEDULED', [schedule.mode]);
  const countdownLabel = useMemo(
    () => formatDuration(schedule.timerRemainingMs),
    [schedule.timerRemainingMs]
  );
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
  const historyData = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        time: `${i * 5}m`,
        pressure: (pump.pumpPressureOutput || 0) + Math.random() * 0.5,
        flow: (pump.pumpFlowOutput || 0) + Math.random() * 10,
        power: (pump.powerConsumption || 0) + Math.random() * 0.5,
        efficiency: (pump.pumpEfficiency || 0) + Math.random() * 2,
      })),
    [pump.pumpPressureOutput, pump.pumpFlowOutput, pump.powerConsumption, pump.pumpEfficiency]
  );

  // Memoized metrics configuration
  const pumpMetrics = useMemo(
    () => [
      {
        label: 'Status',
        value: pump.pumpStatus || 'OFF',
        icon: Power,
        color: isPumpOn ? 'green' : 'gray',
        unit: '',
      },
      {
        label: 'Flow Rate',
        value: (pump.pumpFlowOutput || 0).toFixed(1),
        icon: Activity,
        color: 'orange',
        unit: 'L/min',
      },
      {
        label: 'Pressure',
        value: (pump.pumpPressureOutput || 0).toFixed(2),
        icon: Gauge,
        color: 'orange',
        unit: 'Bar',
      },
      {
        label: 'Power Consumption',
        value: (pump.powerConsumption || 0).toFixed(2),
        icon: Zap,
        color: 'purple',
        unit: 'kW',
      },
      {
        label: 'Motor Temperature',
        value: (pump.motorTemperature || 25).toFixed(1),
        icon: Thermometer,
        color: pump.motorTemperature > 65 ? 'red' : 'amber',
        unit: '°C',
      },
      {
        label: 'Efficiency',
        value: (pump.pumpEfficiency || 0).toFixed(1),
        icon: CheckCircle,
        color: pump.pumpEfficiency > 70 ? 'green' : 'amber',
        unit: '%',
      },
    ],
    [
      pump.pumpStatus,
      pump.pumpFlowOutput,
      pump.pumpPressureOutput,
      pump.powerConsumption,
      pump.motorTemperature,
      pump.pumpEfficiency,
      isPumpOn,
    ]
  );

  // Memoized maintenance metrics
  const maintenanceMetrics = useMemo(
    () => [
      {
        label: 'Operation Cycles',
        value: pump.operationCycles?.toLocaleString() || '0',
        subtext: 'Total on/off cycles',
      },
      {
        label: 'Running Hours',
        value: `${(pump.pumpRunningHours || 0).toFixed(1)} hrs`,
        subtext: 'Lifetime runtime',
      },
      {
        label: 'Vibration Level',
        value: `${pump.vibration?.toFixed(1) || '0'} mm/s`,
        subtext: pump.vibration > 8 ? '⚠️ High' : '✓ Normal',
      },
      {
        label: 'Motor Temperature',
        value: `${pump.motorTemperature?.toFixed(1) || '0'}°C`,
        subtext: pump.motorTemperature > 65 ? '⚠️ Hot' : '✓ Normal',
      },
    ],
    [pump.operationCycles, pump.pumpRunningHours, pump.vibration, pump.motorTemperature]
  );

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Power size={28} className="text-green-600 md:w-9 md:h-9" />
              Pump Station Details
            </h2>
            <p className="text-sm md:text-lg text-slate-500">
              Complete pump monitoring and control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              LIVE
            </span>
          )}
          {/* ON/OFF Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => !isPumpOn && togglePump()}
              disabled={isPumpOn}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                isPumpOn
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              }`}
            >
              ON
            </button>
            <button
              onClick={() => isPumpOn && togglePump()}
              disabled={!isPumpOn}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                !isPumpOn
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
              }`}
            >
              OFF
            </button>
          </div>
        </div>
      </div>

      {/* Ultra-Realistic Centrifugal Pump Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl overflow-hidden shadow-lg border-2 border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left: 3D Pump Visualization */}
          <div className="lg:col-span-3 bg-gradient-to-br from-slate-100 to-slate-50 p-2 md:p-3 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Industrial Floor Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              {/* Header Label */}
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <div>
                  <h3 className="text-sm md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${isPumpOn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
                    ></span>
                    Pump Unit
                  </h3>
                  <p className="text-[10px] md:text-sm text-slate-500 mt-0.5 md:mt-1">
                    KIRLOSKAR KDS-2050
                  </p>
                </div>
                <div
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-[10px] md:text-sm border-2 ${
                    isPumpOn
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {isPumpOn ? '● RUNNING' : '○ STOPPED'}
                </div>
              </div>

              {/* Realistic External Pump View */}
              <div className="relative flex items-center justify-center py-1 md:py-2">
                {/* Ambient Effects when Running */}
                {isPumpOn && (
                  <>
                    <div
                      className="absolute inset-0 bg-gradient-radial from-green-100 via-blue-50 to-transparent animate-pulse"
                      style={{ animationDuration: '3s' }}
                    ></div>
                  </>
                )}

                <svg
                  viewBox="0 0 800 500"
                  className="w-full h-auto"
                  style={{ maxHeight: '450px', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' }}
                >
                  <defs>
                    {/* Enhanced 3D Gradients for Realistic Centrifugal Pump */}
                    <radialGradient id="pumpBodyGradient" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="20%" stopColor="#60a5fa" />
                      <stop offset="40%" stopColor="#3b82f6" />
                      <stop offset="60%" stopColor="#2563eb" />
                      <stop offset="80%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </radialGradient>

                    <radialGradient id="motorBodyGradient" cx="30%" cy="25%">
                      <stop offset="0%" stopColor="#71717a" />
                      <stop offset="25%" stopColor="#52525b" />
                      <stop offset="50%" stopColor="#3f3f46" />
                      <stop offset="75%" stopColor="#27272a" />
                      <stop offset="100%" stopColor="#18181b" />
                    </radialGradient>

                    <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#52525b" />
                      <stop offset="15%" stopColor="#71717a" />
                      <stop offset="30%" stopColor="#9ca3af" />
                      <stop offset="50%" stopColor="#d1d5db" />
                      <stop offset="70%" stopColor="#9ca3af" />
                      <stop offset="85%" stopColor="#71717a" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>

                    <radialGradient id="metalShine" cx="35%" cy="25%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="30%" stopColor="#e0e7ff" stopOpacity="0.6" />
                      <stop offset="60%" stopColor="#bfdbfe" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="vibrationGlow" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="statusGlow" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#16a34a" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
                    </radialGradient>

                    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                      <feOffset dx="4" dy="8" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.65" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="insetShadow">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                      <feOffset dx="-3" dy="-3" />
                      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                    </filter>

                    <filter id="bevelEdge">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                      <feOffset dx="2" dy="2" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Concrete Foundation Base */}
                  <g>
                    <ellipse cx="400" cy="460" rx="300" ry="20" fill="#000000" opacity="0.3" />
                    <rect x="150" y="420" width="500" height="50" fill="#52525b" rx="6" />
                    <rect x="150" y="420" width="500" height="8" fill="#71717a" rx="6" />
                    <rect x="160" y="428" width="480" height="38" fill="#3f3f46" rx="4" />
                  </g>

                  {/* Inlet Suction Pipe */}
                  <g filter="url(#dropShadow)">
                    <rect x="50" y="320" width="150" height="45" fill="url(#pipeGradient)" rx="8" />
                    <rect
                      x="50"
                      y="320"
                      width="150"
                      height="8"
                      fill="#d4d4d8"
                      opacity="0.6"
                      rx="8"
                    />
                    <rect x="55" y="328" width="140" height="32" fill="#52525b" rx="6" />

                    {/* Flange */}
                    <ellipse
                      cx="200"
                      cy="342"
                      rx="30"
                      ry="35"
                      fill="#71717a"
                      stroke="#3f3f46"
                      strokeWidth="3"
                    />
                    <ellipse cx="200" cy="342" rx="22" ry="27" fill="#52525b" />

                    {/* Flange bolts */}
                    {[0, 90, 180, 270].map((angle) => (
                      <circle
                        key={`in-bolt-${angle}`}
                        cx={200 + Math.cos((angle * Math.PI) / 180) * 24}
                        cy={342 + Math.sin((angle * Math.PI) / 180) * 29}
                        r="4"
                        fill="#3f3f46"
                        stroke="#18181b"
                        strokeWidth="1.5"
                      />
                    ))}

                    {isPumpOn && (
                      <>
                        {[0, 1, 2].map((i) => (
                          <circle
                            key={`in-flow-${i}`}
                            cx="80"
                            cy={335 + i * 10}
                            r="4"
                            fill="#3b82f6"
                            opacity="0.6"
                          >
                            <animate
                              attributeName="cx"
                              from="80"
                              to="190"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.7"
                              to="0"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        ))}
                      </>
                    )}
                  </g>

                  {/* Enhanced 3D Centrifugal Pump Body (Volute Casing) */}
                  <g filter="url(#dropShadow)">
                    {/* Base shadow for depth */}
                    <ellipse cx="355" cy="250" rx="148" ry="138" fill="#000000" opacity="0.2" />

                    {/* Outer Casing Shell with 3D gradient */}
                    <ellipse
                      cx="350"
                      cy="240"
                      rx="145"
                      ry="135"
                      fill="url(#pumpBodyGradient)"
                      stroke="#1e3a8a"
                      strokeWidth="6"
                    />
                    <ellipse
                      cx="350"
                      cy="240"
                      rx="137"
                      ry="127"
                      fill="#1e40af"
                      filter="url(#insetShadow)"
                    />

                    {/* Metallic shine overlay */}
                    <ellipse
                      cx="320"
                      cy="210"
                      rx="80"
                      ry="70"
                      fill="url(#metalShine)"
                      opacity="0.6"
                    />

                    {/* Volute spiral chamber outline (3D depth) */}
                    <path
                      d="M 350 240 Q 380 200, 420 210 Q 450 220, 460 250 Q 465 280, 440 310 Q 410 340, 370 340 Q 330 340, 300 320 Q 270 300, 260 270 Q 255 240, 270 210 Q 290 180, 320 170"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="3"
                      opacity="0.4"
                      filter="url(#bevelEdge)"
                    />

                    {/* Inner volute detail */}
                    <ellipse
                      cx="350"
                      cy="240"
                      rx="100"
                      ry="92"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      opacity="0.3"
                    />
                    <ellipse
                      cx="360"
                      cy="248"
                      rx="70"
                      ry="65"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      opacity="0.25"
                    />

                    {/* Impeller housing indication (center) */}
                    <circle
                      cx="350"
                      cy="240"
                      r="55"
                      fill="#1e3a8a"
                      stroke="#1e293b"
                      strokeWidth="3"
                    />
                    <circle cx="350" cy="240" r="50" fill="#0f172a" filter="url(#insetShadow)" />

                    {/* Impeller eye (water inlet) */}
                    <circle
                      cx="350"
                      cy="240"
                      r="25"
                      fill="#1e40af"
                      stroke="#1e3a8a"
                      strokeWidth="2"
                    />
                    <circle cx="350" cy="240" r="20" fill="#0c1e3f" />

                    {/* Assembly Bolts with 3D effect */}
                    {[
                      [275, 155],
                      [425, 155],
                      [470, 240],
                      [425, 325],
                      [275, 325],
                      [230, 240],
                    ].map(([x, y], i) => (
                      <g key={`bolt-${i}`} filter="url(#dropShadow)">
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          fill="#71717a"
                          stroke="#1f2937"
                          strokeWidth="3"
                        />
                        <circle cx={x} cy={y} r="9" fill="#52525b" />
                        <circle cx={x} cy={y} r="6" fill="#27272a" />
                        <circle cx={x} cy={y} r="3" fill="#1f2937" />
                        {/* Bolt shine */}
                        <ellipse cx={x - 3} cy={y - 3} rx="4" ry="3" fill="#94a3b8" opacity="0.6" />
                      </g>
                    ))}

                    {/* Drain plug at bottom */}
                    <g>
                      <circle
                        cx="350"
                        cy="360"
                        r="10"
                        fill="#64748b"
                        stroke="#27272a"
                        strokeWidth="2"
                      />
                      <circle cx="350" cy="360" r="6" fill="#3f3f46" />
                      <path
                        d="M 348 360 L 352 360 M 350 358 L 350 362"
                        stroke="#1f2937"
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* Casing ribs for strength */}
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <line
                        key={`rib-${angle}`}
                        x1={350 + Math.cos((angle * Math.PI) / 180) * 130}
                        y1={240 + Math.sin((angle * Math.PI) / 180) * 120}
                        x2={350 + Math.cos((angle * Math.PI) / 180) * 138}
                        y2={240 + Math.sin((angle * Math.PI) / 180) * 128}
                        stroke="#1e3a8a"
                        strokeWidth="4"
                        opacity="0.6"
                      />
                    ))}

                    {/* Vibration/Running Effect */}
                    {isPumpOn && (
                      <>
                        <ellipse
                          cx="350"
                          cy="240"
                          rx="150"
                          ry="140"
                          fill="url(#vibrationGlow)"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.3;0.7;0.3"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                        </ellipse>
                        <ellipse
                          cx="350"
                          cy="240"
                          rx="160"
                          ry="150"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.1;0.4;0.1"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="rx"
                            values="160;165;160"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="ry"
                            values="150;155;150"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </ellipse>

                        {/* Rotating impeller effect */}
                        <g opacity="0.3">
                          <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            from="0 350 240"
                            to="360 350 240"
                            dur="0.8s"
                            repeatCount="indefinite"
                          />
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <line
                              key={`impeller-${angle}`}
                              x1="350"
                              y1="240"
                              x2={350 + Math.cos((angle * Math.PI) / 180) * 45}
                              y2={240 + Math.sin((angle * Math.PI) / 180) * 42}
                              stroke="#22d3ee"
                              strokeWidth="3"
                            />
                          ))}
                        </g>
                      </>
                    )}

                    {/* Brand Nameplate with 3D effect */}
                    <g filter="url(#dropShadow)">
                      <rect
                        x="300"
                        y="278"
                        width="100"
                        height="40"
                        fill="#fcd34d"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        rx="5"
                      />
                      <rect x="300" y="278" width="100" height="5" fill="#fef3c7" rx="5" />
                      <text
                        x="350"
                        y="296"
                        fontSize="12"
                        fill="#78350f"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        KIRLOSKAR
                      </text>
                      <text
                        x="350"
                        y="308"
                        fontSize="9"
                        fill="#92400e"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        KDS-2050
                      </text>
                      <text x="350" y="316" fontSize="7" fill="#92400e" textAnchor="middle">
                        5HP MONO
                      </text>
                    </g>
                  </g>

                  {/* Enhanced 3D Outlet/Discharge Pipe */}
                  <g filter="url(#dropShadow)">
                    {/* Pipe shadow */}
                    <rect
                      x="60"
                      y="188"
                      width="175"
                      height="60"
                      fill="#000000"
                      opacity="0.15"
                      rx="6"
                    />

                    {/* Outer pipe casing */}
                    <rect x="55" y="175" width="180" height="65" fill="url(#pipeGradient)" rx="8" />
                    <rect x="55" y="175" width="180" height="10" fill="#cbd5e1" rx="8" />

                    {/* Inner pipe bore */}
                    <rect
                      x="62"
                      y="183"
                      width="166"
                      height="49"
                      fill="#1f2937"
                      rx="6"
                      filter="url(#insetShadow)"
                    />

                    {/* Pipe highlights and shadows for 3D */}
                    <line
                      x1="65"
                      y1="185"
                      x2="225"
                      y2="185"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                    <line
                      x1="65"
                      y1="228"
                      x2="225"
                      y2="228"
                      stroke="#0f172a"
                      strokeWidth="3"
                      opacity="0.7"
                    />

                    {/* Pipe ribs/reinforcement */}
                    {[85, 135, 185].map((x) => (
                      <rect
                        key={`rib-dis-${x}`}
                        x={x}
                        y="178"
                        width="8"
                        height="59"
                        fill="#64748b"
                        opacity="0.5"
                        rx="2"
                      />
                    ))}

                    {/* Enhanced Flange Connection with 3D depth */}
                    <ellipse
                      cx="235"
                      cy="207"
                      rx="45"
                      ry="53"
                      fill="#64748b"
                      stroke="#1f2937"
                      strokeWidth="4"
                    />
                    <ellipse cx="235" cy="207" rx="35" ry="43" fill="#475569" />
                    <ellipse
                      cx="235"
                      cy="207"
                      rx="30"
                      ry="38"
                      fill="#1f2937"
                      filter="url(#insetShadow)"
                    />

                    {/* Flange shine */}
                    <ellipse cx="225" cy="195" rx="18" ry="22" fill="#cbd5e1" opacity="0.4" />

                    {/* Flange bolts with 3D */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <g key={`discharge-${angle}`}>
                        <circle
                          cx={235 + Math.cos((angle * Math.PI) / 180) * 37}
                          cy={207 + Math.sin((angle * Math.PI) / 180) * 45}
                          r="6"
                          fill="#71717a"
                          stroke="#1f2937"
                          strokeWidth="2"
                        />
                        <circle
                          cx={235 + Math.cos((angle * Math.PI) / 180) * 37}
                          cy={207 + Math.sin((angle * Math.PI) / 180) * 45}
                          r="3"
                          fill="#27272a"
                        />
                      </g>
                    ))}

                    {/* Water Flow Animation (Opposite Direction - Discharge) */}
                    {isPumpOn && (
                      <>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <circle
                            key={`discharge-flow-${i}`}
                            cx="210"
                            cy={192 + i * 9}
                            r={6 + Math.random() * 3}
                            fill="#22d3ee"
                            opacity="0.6"
                          >
                            <animate
                              attributeName="cx"
                              from="210"
                              to="70"
                              dur={`${0.8 + i * 0.2}s`}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.7"
                              to="0"
                              dur={`${0.8 + i * 0.2}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        ))}
                        {/* High pressure flow effect */}
                        <circle
                          cx="140"
                          cy="207"
                          r="12"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          opacity="0.4"
                        >
                          <animate
                            attributeName="r"
                            from="8"
                            to="18"
                            dur="1.2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.5"
                            to="0"
                            dur="1.2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}

                    {/* Pressure gauge mounting */}
                    <g>
                      <circle
                        cx="145"
                        cy="175"
                        r="18"
                        fill="#e2e8f0"
                        stroke="#475569"
                        strokeWidth="3"
                      />
                      <circle
                        cx="145"
                        cy="175"
                        r="14"
                        fill="#f8fafc"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <text
                        x="145"
                        y="180"
                        fontSize="10"
                        fill="#1e293b"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        PSI
                      </text>
                    </g>
                  </g>

                  {/* Enhanced 3D Coupling/Shaft Housing */}
                  <g filter="url(#dropShadow)">
                    {/* Coupling guard cover */}
                    <rect
                      x="475"
                      y="210"
                      width="75"
                      height="60"
                      fill="#4b5563"
                      rx="6"
                      stroke="#1f2937"
                      strokeWidth="3"
                    />
                    <rect x="475" y="210" width="75" height="8" fill="#6b7280" rx="6" />
                    <rect
                      x="480"
                      y="218"
                      width="65"
                      height="47"
                      fill="#374151"
                      rx="4"
                      filter="url(#insetShadow)"
                    />

                    {/* Ventilation slots */}
                    {[225, 240, 255].map((y) => (
                      <g key={`vent-${y}`}>
                        <rect
                          x="485"
                          y={y}
                          width="55"
                          height="3"
                          fill="#1f2937"
                          rx="1"
                          opacity="0.8"
                        />
                        <rect x="485" y={y} width="55" height="1" fill="#0f172a" rx="1" />
                      </g>
                    ))}

                    {/* Flexible coupling (visible through design) */}
                    <ellipse
                      cx="512"
                      cy="240"
                      rx="22"
                      ry="20"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <ellipse cx="512" cy="240" rx="18" ry="16" fill="#f59e0b" />

                    {/* Coupling rubber elements */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <rect
                        key={`rubber-${angle}`}
                        x={512 + Math.cos((angle * Math.PI) / 180) * 14 - 2}
                        y={240 + Math.sin((angle * Math.PI) / 180) * 12 - 4}
                        width="4"
                        height="8"
                        fill="#27272a"
                        rx="1"
                      />
                    ))}

                    {/* Guard mounting bolts */}
                    {[
                      [480, 215],
                      [545, 215],
                      [480, 265],
                      [545, 265],
                    ].map(([x, y], i) => (
                      <g key={`coupling-bolt-${i}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#71717a"
                          stroke="#1f2937"
                          strokeWidth="1.5"
                        />
                        <circle cx={x} cy={y} r="2" fill="#27272a" />
                      </g>
                    ))}

                    {/* Alignment indicator */}
                    <line
                      x1="512"
                      y1="215"
                      x2="512"
                      y2="223"
                      stroke="#22c55e"
                      strokeWidth="2"
                      opacity={isPumpOn ? '0.8' : '0.3'}
                    />
                  </g>

                  {/* Enhanced 3D Electric Motor Assembly */}
                  <g filter="url(#dropShadow)">
                    {/* Motor shadow */}
                    <ellipse cx="605" cy="250" rx="115" ry="138" fill="#000000" opacity="0.2" />

                    {/* Motor Housing with enhanced gradient */}
                    <ellipse
                      cx="600"
                      cy="240"
                      rx="115"
                      ry="135"
                      fill="url(#motorBodyGradient)"
                      stroke="#1f2937"
                      strokeWidth="6"
                    />
                    <ellipse
                      cx="600"
                      cy="240"
                      rx="107"
                      ry="127"
                      fill="#111827"
                      filter="url(#insetShadow)"
                    />

                    {/* Metallic shine on motor */}
                    <ellipse
                      cx="570"
                      cy="200"
                      rx="60"
                      ry="70"
                      fill="url(#metalShine)"
                      opacity="0.4"
                    />

                    {/* Enhanced Cooling Fins (External Ribs) with 3D depth */}
                    {[...Array(18)].map((_, i) => (
                      <g key={`fin-${i}`}>
                        <rect
                          x="535"
                          y={130 + i * 12}
                          width="130"
                          height="7"
                          fill="#4b5563"
                          rx="2"
                          opacity="0.95"
                        />
                        <rect
                          x="535"
                          y={130 + i * 12}
                          width="130"
                          height="2"
                          fill="#6b7280"
                          rx="2"
                          opacity="0.7"
                        />
                        <rect
                          x="537"
                          y={135 + i * 12}
                          width="126"
                          height="2"
                          fill="#1f2937"
                          rx="1"
                          opacity="0.6"
                        />
                      </g>
                    ))}

                    {/* Motor end covers */}
                    <ellipse
                      cx="600"
                      cy="125"
                      rx="108"
                      ry="25"
                      fill="#374151"
                      stroke="#1f2937"
                      strokeWidth="3"
                    />
                    <ellipse
                      cx="600"
                      cy="355"
                      rx="108"
                      ry="25"
                      fill="#374151"
                      stroke="#1f2937"
                      strokeWidth="3"
                    />
                    <ellipse cx="600" cy="125" rx="100" ry="20" fill="#1f2937" />
                    <ellipse cx="600" cy="355" rx="100" ry="20" fill="#1f2937" />

                    {/* Shaft outlet */}
                    <circle
                      cx="600"
                      cy="125"
                      r="18"
                      fill="#52525b"
                      stroke="#27272a"
                      strokeWidth="2"
                    />
                    <circle cx="600" cy="125" r="12" fill="#3f3f46" />

                    {/* Enhanced Terminal Box with 3D */}
                    <g filter="url(#dropShadow)">
                      <rect
                        x="668"
                        y="205"
                        width="58"
                        height="58"
                        fill="#4b5563"
                        stroke="#1f2937"
                        strokeWidth="3"
                        rx="4"
                      />
                      <rect x="668" y="205" width="58" height="8" fill="#6b7280" rx="4" />
                      <rect
                        x="673"
                        y="213"
                        width="48"
                        height="45"
                        fill="#1f2937"
                        rx="3"
                        filter="url(#insetShadow)"
                      />

                      {/* Terminal cover screws */}
                      {[
                        [678, 210],
                        [718, 210],
                        [678, 253],
                        [718, 253],
                      ].map(([x, y], i) => (
                        <g key={`screw-${i}`}>
                          <circle
                            cx={x}
                            cy={y}
                            r="3"
                            fill="#52525b"
                            stroke="#27272a"
                            strokeWidth="1"
                          />
                          <line
                            x1={x - 2}
                            y1={y}
                            x2={x + 2}
                            y2={y}
                            stroke="#1f2937"
                            strokeWidth="0.5"
                          />
                        </g>
                      ))}

                      {/* Three-Phase Terminals with realistic connectors */}
                      <circle
                        cx="697"
                        cy="228"
                        r="5"
                        fill="#dc2626"
                        stroke="#7f1d1d"
                        strokeWidth="2"
                      />
                      <circle
                        cx="697"
                        cy="242"
                        r="5"
                        fill="#facc15"
                        stroke="#a16207"
                        strokeWidth="2"
                      />
                      <circle
                        cx="697"
                        cy="256"
                        r="5"
                        fill="#2563eb"
                        stroke="#1e3a8a"
                        strokeWidth="2"
                      />

                      {/* Terminal labels */}
                      <text x="711" y="231" fontSize="8" fill="#d1d5db" fontWeight="bold">
                        R
                      </text>
                      <text x="711" y="245" fontSize="8" fill="#d1d5db" fontWeight="bold">
                        Y
                      </text>
                      <text x="711" y="259" fontSize="8" fill="#d1d5db" fontWeight="bold">
                        B
                      </text>

                      {/* Earth terminal */}
                      <circle
                        cx="697"
                        cy="218"
                        r="4"
                        fill="#10b981"
                        stroke="#065f46"
                        strokeWidth="1.5"
                      />
                      <text x="711" y="221" fontSize="7" fill="#d1d5db">
                        ⏚
                      </text>
                    </g>

                    {/* Enhanced Motor Nameplate with 3D */}
                    <g filter="url(#dropShadow)">
                      <rect
                        x="543"
                        y="282"
                        width="114"
                        height="48"
                        fill="#fcd34d"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        rx="5"
                      />
                      <rect x="543" y="282" width="114" height="6" fill="#fef3c7" rx="5" />
                      <text
                        x="600"
                        y="300"
                        fontSize="13"
                        fill="#78350f"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        KIRLOSKAR
                      </text>
                      <text
                        x="600"
                        y="313"
                        fontSize="10"
                        fill="#92400e"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        5.0 HP • 3.7kW
                      </text>
                      <text x="600" y="323" fontSize="8" fill="#92400e" textAnchor="middle">
                        415V • 2900RPM
                      </text>
                      <text x="600" y="330" fontSize="7" fill="#92400e" textAnchor="middle">
                        50Hz • 3Ph • IP55
                      </text>
                    </g>

                    {/* Enhanced Status Indicator LED with 3D */}
                    <g filter="url(#dropShadow)">
                      <circle
                        cx="693"
                        cy="170"
                        r="15"
                        fill={isPumpOn ? '#15803d' : '#3f3f46'}
                        stroke={isPumpOn ? '#14532d' : '#1f2937'}
                        strokeWidth="3"
                      />
                      {isPumpOn && (
                        <circle cx="693" cy="170" r="22" fill="url(#statusGlow)" opacity="0.7">
                          <animate
                            attributeName="opacity"
                            values="0.4;0.9;0.4"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle cx="693" cy="170" r="10" fill={isPumpOn ? '#22c55e' : '#52525b'} />
                      <ellipse
                        cx="688"
                        cy="166"
                        rx="4"
                        ry="3"
                        fill={isPumpOn ? '#86efac' : '#6b7280'}
                        opacity="0.8"
                      />
                    </g>

                    {/* Motor mounting feet */}
                    {[530, 670].map((x) => (
                      <g key={`foot-${x}`}>
                        <rect x={x} y="350" width="30" height="15" fill="#4b5563" rx="2" />
                        <rect x={x + 2} y="352" width="26" height="11" fill="#374151" rx="1" />
                        <circle
                          cx={x + 15}
                          cy="360"
                          r="4"
                          fill="#1f2937"
                          stroke="#0f172a"
                          strokeWidth="1"
                        />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>

              {/* Pump Scheduler - Compact */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-1.5 md:p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <svg
                        className="w-3 h-3 md:w-6 md:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-xs md:text-xl font-bold text-white">Scheduler</h3>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <span className="px-1.5 md:px-4 py-0.5 md:py-2 rounded-md bg-white/20 border border-white/30 text-[9px] md:text-base font-bold text-white">
                        {schedule.mode || 'MANUAL'}
                      </span>
                      {(schedule.timerRemainingMs > 0 || isStopScheduled) && (
                        <span
                          className={`px-1.5 md:px-4 py-0.5 md:py-2 rounded-md text-[9px] md:text-base font-bold text-white ${isTimerActive ? 'bg-green-500' : 'bg-blue-500'}`}
                        >
                          {isTimerActive ? countdownLabel : stopLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-1.5 space-y-1.5">
                  {/* Timer Controls - Compact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Run Timer */}
                    <div className="bg-white rounded-md border border-cyan-200 p-1.5 md:p-2 shadow-sm">
                      <label className="flex items-center gap-1 md:gap-2 text-[9px] md:text-base font-semibold text-cyan-700 mb-1">
                        <svg
                          className="w-2.5 h-2.5 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
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
                    <div className="bg-white rounded-md border border-cyan-200 p-1.5 md:p-2 shadow-sm">
                      <label className="flex items-center gap-1 md:gap-2 text-[9px] md:text-base font-semibold text-cyan-700 mb-1">
                        <svg
                          className="w-2.5 h-2.5 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
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
                    <div className="flex items-center justify-between gap-2 bg-white rounded-md p-1.5 border border-cyan-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] md:text-xs text-cyan-600 font-medium">Next Stop</p>
                        <p className="text-xs md:text-sm font-bold text-slate-800 truncate">
                          {isTimerActive ? countdownLabel : stopLabel}
                        </p>
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
          <div className="lg:col-span-2 bg-white p-2 md:p-3">
            <div className="space-y-1.5 md:space-y-2">
              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {/* ON Button */}
                <button
                  onClick={() => !isPumpOn && togglePump()}
                  disabled={isPumpOn}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-base md:text-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                    isPumpOn
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed shadow-gray-300/30'
                      : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white shadow-green-500/30'
                  }`}
                >
                  <span className="flex flex-col items-center justify-center gap-1 md:gap-2">
                    <Power size={28} className="md:w-10 md:h-10" />
                    <span className="text-sm md:text-2xl">ON</span>
                  </span>
                </button>

                {/* OFF Button */}
                <button
                  onClick={() => isPumpOn && togglePump()}
                  disabled={!isPumpOn}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-base md:text-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                    !isPumpOn
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed shadow-gray-300/30'
                      : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-red-500/30'
                  }`}
                >
                  <span className="flex flex-col items-center justify-center gap-1 md:gap-2">
                    <Power size={28} className="md:w-10 md:h-10" />
                    <span className="text-sm md:text-2xl">OFF</span>
                  </span>
                </button>
              </div>

              {/* Real-time Metrics */}
              <div>
                <label className="text-[10px] md:text-base font-semibold text-slate-600 uppercase tracking-wider mb-2 md:mb-3 block">
                  Live Parameters
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-cyan-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Activity size={14} className="text-cyan-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-cyan-700 font-semibold">
                        Flow Rate
                      </p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-cyan-700">
                      {(pump.pumpFlowOutput || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-cyan-600 mt-0.5 md:mt-1">L/min</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Gauge size={14} className="text-blue-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-blue-700 font-semibold">
                        Pressure
                      </p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-blue-700">
                      {(pump.pumpPressureOutput || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] md:text-base text-blue-600 mt-0.5 md:mt-1">bar</p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-yellow-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Zap size={14} className="text-yellow-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-yellow-700 font-semibold">
                        Power
                      </p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-yellow-700">
                      {(pump.powerConsumption || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-yellow-600 mt-0.5 md:mt-1">kW</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg md:rounded-xl p-2 md:p-5 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Thermometer size={14} className="text-orange-600 md:w-6 md:h-6" />
                      <p className="text-[10px] md:text-base text-orange-700 font-semibold">
                        Temperature
                      </p>
                    </div>
                    <p className="text-base md:text-[2rem] md:leading-tight font-black text-orange-700">
                      {(pump.motorTemperature || 0).toFixed(1)}
                    </p>
                    <p className="text-[10px] md:text-base text-orange-600 mt-0.5 md:mt-1">°C</p>
                  </div>
                </div>
              </div>

              {/* Performance Monitoring */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg md:rounded-xl p-2 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-slate-600 md:w-7 md:h-7" />
                  <h4 className="text-xs md:text-xl font-bold text-slate-700">
                    Performance Monitoring
                  </h4>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {/* Efficiency Monitoring */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-base font-semibold text-slate-600 flex items-center gap-1">
                        <Activity size={12} className="md:w-5 md:h-5" /> Pump Efficiency
                      </span>
                      <span
                        className={`text-sm md:text-[1.75rem] md:leading-tight font-black ${pump.pumpEfficiency < 70 ? 'text-amber-600' : 'text-green-600'}`}
                      >
                        {(pump.pumpEfficiency || 65).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                      <div
                        className={`h-2 md:h-3 rounded-full transition-all ${pump.pumpEfficiency < 70 ? 'bg-amber-600' : 'bg-green-600'}`}
                        style={{ width: `${pump.pumpEfficiency || 65}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] md:text-sm text-slate-500">
                        {pump.pumpEfficiency < 70 ? '⚠ Check impeller' : '✓ Optimal'}
                      </p>
                      <p className="text-[9px] md:text-xs text-slate-400 font-medium">
                        Ideal: ≥75%
                      </p>
                    </div>
                  </div>

                  {/* Pressure Monitoring */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-base font-semibold text-slate-600 flex items-center gap-1">
                        <Gauge size={12} className="md:w-5 md:h-5" /> Output Pressure
                      </span>
                      <span
                        className={`text-sm md:text-[1.75rem] md:leading-tight font-black ${pump.pumpPressureOutput < 2.5 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {(pump.pumpPressureOutput || 0).toFixed(2)} bar
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                      <div
                        className={`h-2 md:h-3 rounded-full transition-all ${pump.pumpPressureOutput < 2.5 ? 'bg-red-600' : 'bg-green-600'}`}
                        style={{
                          width: `${Math.min(100, ((pump.pumpPressureOutput || 3.5) / 5) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-[9px] md:text-sm text-slate-500">
                      {pump.pumpPressureOutput < 2.5 ? '⚠ Low pressure' : '✓ Normal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {pumpMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = COLOR_MAP[metric.color] || COLOR_MAP.gray;

          return (
            <div
              key={idx}
              className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4 border-l-2 md:border-l-4 border-slate-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-1 md:mb-3">
                <Icon size={20} className={`${statusColor} md:w-12 md:h-12`} />
                {metric.color === 'red' && (
                  <AlertTriangle size={16} className="text-red-600 md:w-6 md:h-6" />
                )}
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold leading-tight">
                {metric.label}
              </p>
              <p className="text-sm md:text-[2rem] md:leading-tight font-black text-black mt-1 md:mt-2">
                {metric.value}{' '}
                <span className="text-[10px] md:text-2xl text-gray-500">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-2xl p-2 md:p-3 border-2 border-slate-200">
        <h3 className="text-xl md:text-3xl font-black text-slate-800 mb-2 md:mb-3 flex items-center gap-3">
          <Clock size={24} className="text-slate-600 md:w-9 md:h-9" />
          Pump Information
        </h3>

        {/* Info cards visible on mobile/tablet, hidden on desktop lg+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3 md:gap-4">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 md:p-4 border-2 border-slate-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-500 rounded-full"></span>
              Basic Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Pump ID</span>
                <span className="text-base md:text-xl font-black text-slate-900">PUMP-001</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Voltage</span>
                <span className="text-base md:text-xl font-black text-slate-900">
                  {(pump.voltage || 220).toFixed(1)} V
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-sm md:text-lg text-gray-600">Power Factor</span>
                <span className="text-base md:text-xl font-black text-slate-900">
                  {(pump.powerFactor || 0.95).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg text-gray-600">Discharge Rate</span>
                <span className="text-base md:text-xl font-black text-slate-900">
                  {(pump.pumpDischargeRate || 0).toFixed(1)} L/min
                </span>
              </div>
            </div>
          </div>

          {/* Running Hours */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-3 md:p-4 border-2 border-emerald-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-emerald-700 font-bold mb-2 md:mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Running Hours Analysis
            </h4>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Total Runtime</span>
                <p className="text-2xl md:text-4xl font-black text-emerald-600 mt-1">
                  {(pump.pumpRunningHours || 0).toFixed(1)} hrs
                </p>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm md:text-lg text-gray-600">Today</span>
                <span className="text-base md:text-xl font-bold text-slate-900">
                  {dailyRunningHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm md:text-lg text-gray-600">This Week</span>
                <span className="text-base md:text-xl font-bold text-slate-900">
                  {weeklyRunningHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg text-gray-600">This Month</span>
                <span className="text-base md:text-xl font-bold text-slate-900">
                  {monthlyRunningHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance & Health */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-3 md:p-4 border-2 border-amber-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-amber-700 font-bold mb-2 md:mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Maintenance & Health
            </h4>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">
                  Last Maintenance
                </span>
                <p className="text-xl md:text-3xl font-black text-amber-600 mt-1">7 days ago</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Next Scheduled</span>
                <p className="text-xl md:text-3xl font-black text-slate-900 mt-1">23 days</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600 md:w-6 md:h-6" />
                  <span className="text-sm md:text-lg font-bold text-green-700">
                    System Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Service Details */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 md:p-4 border-2 border-blue-200 shadow-md">
            <h4 className="text-xs md:text-base uppercase tracking-widest text-blue-700 font-bold mb-2 md:mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Warranty & Service Details
            </h4>
            <div className="space-y-2">
              {/* Warranty Status Banner */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-base text-gray-500 uppercase">
                    Warranty Status
                  </span>
                  <span
                    className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full ${
                      pump.warrantyStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : pump.warrantyStatus === 'EXPIRED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pump.warrantyStatus === 'ACTIVE'
                      ? '✓ In Warranty'
                      : pump.warrantyStatus === 'EXPIRED'
                        ? '✕ Expired'
                        : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Warranty Period */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <span className="text-xs md:text-base text-gray-500 uppercase">Warranty Period</span>
                <p className="text-xl md:text-3xl font-black text-slate-900 mt-1">{pump.warrantyPeriodMonths || 24} months</p>
              </div>

              {/* Warranty Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs md:text-sm text-gray-500 uppercase block mb-1">Provider</span>
                  <p className="text-sm md:text-lg font-bold text-slate-900">
                    {pump.warrantyProvider || 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs md:text-sm text-gray-500 uppercase block mb-1">Warranty Expiry</span>
                  <p className="text-sm md:text-lg font-bold text-slate-900">
                    {pump.warrantyExpiryDate
                      ? new Date(pump.warrantyExpiryDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs md:text-sm text-gray-500 uppercase block mb-1">Installation Date</span>
                  <p className="text-sm md:text-lg font-bold text-slate-900">
                    {pump.installationDate
                      ? new Date(pump.installationDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs md:text-sm text-gray-500 uppercase block mb-1">Next Service In</span>
                  <p className="text-sm md:text-lg font-bold text-blue-600">
                    {Math.max(
                      0,
                      Math.ceil((pump.nextServiceDate - Date.now()) / (24 * 60 * 60 * 1000))
                    )}{' '}
                    days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Pumped Throughout the Day */}
      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200">
        <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={24} className="text-blue-600" />
          Water Pumped Today
        </h3>
          <div className="h-64 md:h-80 bg-white dark:bg-slate-50 rounded-lg p-4 border border-slate-200">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-700">
                Time Resolution: <span className="text-blue-600">
                  {zoomLevel === 1 ? 'Hours' : zoomLevel === 2 ? 'Minutes' : 'Seconds'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(1)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    zoomLevel === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Hours
                </button>
                <button
                  onClick={() => setZoomLevel(2)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    zoomLevel === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Minutes
                </button>
                <button
                  onClick={() => setZoomLevel(3)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    zoomLevel === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Seconds
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={heartbeatData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                syncMethod="value"
              >
                <defs>
                  <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569"
                  style={{ fontSize: '8px' }}
                  tick={{ fill: '#475569' }}
                  interval={Math.floor(300 / 10)}
                  label={{ 
                    value: zoomLevel === 1 ? 'Time (HH:MM)' : zoomLevel === 2 ? 'Time (MM:SS)' : 'Time (SS.ms)', 
                    position: 'insideBottom', 
                    offset: -10, 
                    fill: '#475569', 
                    fontSize: 11 
                  }}
                />
                <YAxis 
                  stroke="#475569"
                  domain={[0, 700]}
                  style={{ fontSize: '10px' }}
                  tick={{ fill: '#475569' }}
                  ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                  label={{ value: 'Flow Rate (L/min)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value?.toFixed(1) || 0} L/min`, 'Flow Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="flow"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isPumpOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-slate-700 font-medium">
                  {isPumpOn ? 'Pumping' : 'Stopped'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Current Flow:</span>
                <span className="text-lg font-bold text-blue-600 ml-2">
                  {isPumpOn ? (pump.pumpFlowOutput || 150).toFixed(1) : '0.0'} L/min
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total Today</p>
              <p className="text-lg md:text-2xl font-black text-blue-700">
                {((pump.pumpFlowOutput || 150) * 60 * 10).toFixed(0)} L
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-2 border border-cyan-200">
              <p className="text-xs text-cyan-600 font-medium">Peak Hour</p>
              <p className="text-lg md:text-2xl font-black text-cyan-700">
                {((pump.pumpFlowOutput || 150) * 60 * 1.2).toFixed(0)} L
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
              <p className="text-xs text-indigo-600 font-medium">Avg/Hour</p>
              <p className="text-lg md:text-2xl font-black text-indigo-700">
                {((pump.pumpFlowOutput || 150) * 60 * 0.6).toFixed(0)} L
              </p>
            </div>
          </div>
        </div>

      {/* Running Hours Log History */}
      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200">
        <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock size={24} className="text-emerald-600" />
          Running Hours Log
        </h3>
        <div className="space-y-2 max-h-80 md:max-h-96 overflow-y-auto">
          {Array.from({ length: 10 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            // Fixed historical data - doesn't change in real time
            const runningHours = i === 0 ? 9.2 : i === 1 ? 10.5 : i === 2 ? 8.7 : i === 3 ? 11.2 : i === 4 ? 9.8 : i === 5 ? 10.1 : i === 6 ? 9.5 : i === 7 ? 10.8 : i === 8 ? 9.3 : 10.6;
            const startTime = i % 2 === 0 ? 6 : 7;
            const endTime = startTime + Math.floor(runningHours);
            
            return (
              <div
                key={i}
                className="bg-gradient-to-r from-slate-50 to-white rounded-lg p-3 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    {date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                    {runningHours.toFixed(1)} hrs
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Start: {startTime.toString().padStart(2, '0')}:00</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Stop: {endTime.toString().padStart(2, '0')}:00</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${(runningHours / 12) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Water Pumped: {(150 * 60 * runningHours).toFixed(0)} L
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-3 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-medium">Average Daily Runtime</p>
              <p className="text-2xl font-black text-emerald-700">10.2 hrs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyan-600 font-medium">This Week Total</p>
              <p className="text-2xl font-black text-cyan-700">71.4 hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Trigger Area - Desktop Only */}
      <div
        className="hidden lg:block fixed right-0 top-0 bottom-0 w-4 z-40"
        onMouseEnter={() => setShowDetailsSidebar(true)}
      />

      {/* Details Sidebar - Desktop Only */}
      <div
        className={`hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l-2 border-blue-200 z-50 transform transition-transform duration-300 overflow-y-auto ${
          showDetailsSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
        onMouseLeave={() => setShowDetailsSidebar(false)}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 z-10 shadow-md">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} />
            Pump Details
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Running Hours */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border-2 border-emerald-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-emerald-700 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Running Hours Analysis
            </h4>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <span className="text-xs text-gray-500 uppercase">Total Runtime</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {(pump.pumpRunningHours || 0).toFixed(1)} hrs
                </p>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm text-gray-600">Today</span>
                <span className="text-base font-bold text-slate-900">
                  {dailyRunningHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="text-base font-bold text-slate-900">
                  {weeklyRunningHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-base font-bold text-slate-900">
                  {monthlyRunningHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance & Health */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border-2 border-amber-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-amber-700 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Maintenance & Health
            </h4>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs text-gray-500 uppercase">
                  Last Maintenance
                </span>
                <p className="text-xl font-black text-amber-600 mt-1">7 days ago</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-xs text-gray-500 uppercase">Next Scheduled</span>
                <p className="text-xl font-black text-slate-900 mt-1">23 days</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-bold text-green-700">
                    System Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Service Details */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-blue-700 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Warranty & Service Details
            </h4>
            <div className="space-y-2">
              {/* Warranty Status Banner */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase">
                    Warranty Status
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      pump.warrantyStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : pump.warrantyStatus === 'EXPIRED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pump.warrantyStatus === 'ACTIVE'
                      ? '✓ In Warranty'
                      : pump.warrantyStatus === 'EXPIRED'
                        ? '✕ Expired'
                        : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Warranty Period */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <span className="text-xs text-gray-500 uppercase">Warranty Period</span>
                <p className="text-xl font-black text-slate-900 mt-1">{pump.warrantyPeriodMonths || 24} months</p>
              </div>

              {/* Warranty Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase block mb-1">Provider</span>
                  <p className="text-sm font-bold text-slate-900">
                    {pump.warrantyProvider || 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase block mb-1">Warranty Expiry</span>
                  <p className="text-sm font-bold text-slate-900">
                    {pump.warrantyExpiryDate
                      ? new Date(pump.warrantyExpiryDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase block mb-1">Installation Date</span>
                  <p className="text-sm font-bold text-slate-900">
                    {pump.installationDate
                      ? new Date(pump.installationDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase block mb-1">Next Service In</span>
                  <p className="text-sm font-bold text-blue-600">
                    {Math.max(
                      0,
                      Math.ceil((pump.nextServiceDate - Date.now()) / (24 * 60 * 60 * 1000))
                    )}{' '}
                    days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Details - Moved to Bottom */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border-2 border-slate-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-500 rounded-full"></span>
              Basic Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-sm text-gray-600">Pump ID</span>
                <span className="text-base font-black text-slate-900">PUMP-001</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-sm text-gray-600">Voltage</span>
                <span className="text-base font-black text-slate-900">
                  {(pump.voltage || 220).toFixed(1)} V
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-sm text-gray-600">Power Factor</span>
                <span className="text-base font-black text-slate-900">
                  {(pump.powerFactor || 0.95).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discharge Rate</span>
                <span className="text-base font-black text-slate-900">
                  {(pump.pumpDischargeRate || 0).toFixed(1)} L/min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
