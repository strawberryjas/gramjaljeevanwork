import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import {
  Droplet,
  Gauge,
  Thermometer,
  ArrowLeft,
  Settings,
  FlaskConical,
  Activity,
  AlertTriangle,
  CheckCircle,
  Radio,
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
  BarChart,
  Bar,
} from 'recharts';
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
    {
      parameter: 'pH',
      value: (quality.pH || 7).toFixed(2),
      min: 6.5,
      max: 8.5,
      status: (quality.pH || 7) >= 6.5 && (quality.pH || 7) <= 8.5 ? 'Good' : 'Out of Range',
    },
    {
      parameter: 'Turbidity',
      value: (quality.turbidity || 0).toFixed(2),
      min: 0,
      max: 5,
      status: (quality.turbidity || 0) <= 5 ? 'Excellent' : 'High',
      unit: 'NTU',
    },
    {
      parameter: 'Chlorine',
      value: (quality.chlorine || 0).toFixed(2),
      min: 0.2,
      max: 1.0,
      status: (quality.chlorine || 0) >= 0.2 && (quality.chlorine || 0) <= 1 ? 'Good' : 'Adjust',
      unit: 'mg/L',
    },
    {
      parameter: 'TDS',
      value: (quality.TDS || 0).toFixed(0),
      min: 0,
      max: 500,
      status: (quality.TDS || 0) <= 500 ? 'Good' : 'High',
      unit: 'ppm',
    },
    {
      parameter: 'Temperature',
      value: (tank.temperature || 26).toFixed(1),
      min: 15,
      max: 35,
      status: (tank.temperature || 26) >= 15 && (tank.temperature || 26) <= 35 ? 'Good' : 'Alert',
      unit: '°C',
    },
    {
      parameter: 'Hardness',
      value: (quality.hardness || 180).toFixed(0),
      min: 0,
      max: 300,
      status: (quality.hardness || 180) <= 300 ? 'Good' : 'High',
      unit: 'mg/L',
    },
    {
      parameter: 'EC',
      value: (quality.EC || 450).toFixed(0),
      min: 0,
      max: 750,
      status: (quality.EC || 450) <= 750 ? 'Good' : 'High',
      unit: 'µS/cm',
    },
  ];

  const tankMetrics = [
    {
      label: 'Tank Level',
      value: (tank.tankLevel || 0).toFixed(1),
      icon: Droplet,
      color: tank.tankLevel > 60 ? 'green' : tank.tankLevel > 30 ? 'amber' : 'red',
      unit: '%',
    },
    {
      label: 'Current Volume',
      value: (tank.currentVolume || 0).toLocaleString(),
      icon: Activity,
      color: 'blue',
      unit: 'L',
    },
    {
      label: 'Capacity',
      value: (tank.tankCapacity || 10000).toLocaleString(),
      icon: Gauge,
      color: 'emerald',
      unit: 'L',
    },
    {
      label: 'Temperature',
      value: (tank.temperature || 26).toFixed(1),
      icon: Thermometer,
      color: 'blue',
      unit: '°C',
    },
    {
      label: 'Inlet Valve',
      value: tank.inletValveStatus || 'CLOSED',
      icon: Settings,
      color: tank.inletValveStatus === 'OPEN' ? 'green' : 'red',
      unit: '',
    },
    {
      label: 'Outlet Valve',
      value: tank.outletValveStatus || 'CLOSED',
      icon: Settings,
      color: tank.outletValveStatus === 'OPEN' ? 'green' : 'red',
      unit: '',
    },
  ];

  const isWaterSafe =
    (quality.pH || 7) >= 6.5 &&
    (quality.pH || 7) <= 8.5 &&
    (quality.turbidity || 0) < 5 &&
    (quality.chlorine || 0) >= 0.2 &&
    (quality.chlorine || 0) <= 1;

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
            <p className="text-sm text-slate-500">
              Main Overhead Tank - Complete monitoring and control
            </p>
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
                    <span
                      className={`w-2 h-2 rounded-full ${tank.isFilling ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`}
                    ></span>
                    Overhead Water Tank - Elevated Structure
                  </h3>
                  <p className="text-xs text-slate-600">
                    Capacity: {(tank.tankCapacity || 10000).toLocaleString()} Liters • Height: 15m
                  </p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex-shrink-0 ${
                    tank.isFilling
                      ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {tank.isFilling
                    ? '● FILLING'
                    : tank.tankLevel > 80
                      ? '● FULL'
                      : tank.tankLevel > 30
                        ? '● NORMAL'
                        : '● LOW'}
                </div>
              </div>

              {/* Realistic Overhead Tank SVG - Matching SystemContainer */}
              <div className="relative flex items-center justify-center py-6">
                {/* Ambient Water Glow */}
                {tank.isFilling && (
                  <div
                    className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-cyan-500/5 to-transparent animate-pulse"
                    style={{ animationDuration: '3s' }}
                  ></div>
                )}

                <svg
                  viewBox="0 0 800 700"
                  className="w-full h-auto"
                  style={{ maxHeight: '650px', filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))' }}
                >
                  <defs>
                    {/* Concrete gradient for support columns */}
                    <linearGradient id="concreteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9ca3af" />
                      <stop offset="50%" stopColor="#d1d5db" />
                      <stop offset="100%" stopColor="#9ca3af" />
                    </linearGradient>

                    {/* Tank body gradient - light yellow with dirt */}
                    <linearGradient id="tankMetalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                      <stop offset="30%" stopColor="#fde68a" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#d4a574" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.45" />
                    </linearGradient>

                    {/* Water gradient */}
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="1.0" />
                    </linearGradient>

                    {/* Pipe gradient */}
                    <linearGradient id="blueMetalPipe" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>

                    {/* Clip path for water in tank */}
                    <clipPath id="waterClip">
                      <rect x="220" y="-35" width="360" height="170" rx="3" />
                    </clipPath>
                  </defs>

                  {/* Ground level */}
                  <rect x="100" y="650" width="600" height="10" fill="#6b7280" opacity="0.8" />

                  {/* Four Support Columns (tall, slender) */}
                  <g id="supportColumns">
                    {/* Left front column */}
                    <rect
                      x="215"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="217" y="165" width="3" height="485" fill="#d1d5db" opacity="0.7" />

                    {/* Left back column */}
                    <rect
                      x="280"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="282" y="165" width="3" height="485" fill="#d1d5db" opacity="0.7" />

                    {/* Right back column */}
                    <rect
                      x="495"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="497" y="165" width="3" height="485" fill="#d1d5db" opacity="0.7" />

                    {/* Right front column */}
                    <rect
                      x="560"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="562" y="165" width="3" height="485" fill="#d1d5db" opacity="0.7" />
                  </g>

                  {/* Horizontal Support Beams */}
                  <g id="supportBeams">
                    {/* Bottom beams (near ground) */}
                    <rect
                      x="215"
                      y="630"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Mid-section beams */}
                    <rect
                      x="215"
                      y="420"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Top beams (just below tank) */}
                    <rect
                      x="215"
                      y="145"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                  </g>

                  {/* Main Staircase (ground to mid-platform) */}
                  <g id="mainStaircase">
                    {/* Stair structure - left side */}
                    <rect x="110" y="440" width="70" height="190" fill="#6b7280" opacity="0.3" />

                    {/* Individual steps */}
                    {[615, 600, 585, 570, 555, 540, 525, 510, 495, 480, 465, 450].map((y, i) => (
                      <rect
                        key={i}
                        x="110"
                        y={y}
                        width="70"
                        height="6"
                        fill="#9ca3af"
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Handrails */}
                    <line x1="108" y1="440" x2="108" y2="630" stroke="#4b5563" strokeWidth="3" />
                    <line x1="182" y1="440" x2="182" y2="630" stroke="#4b5563" strokeWidth="3" />
                  </g>

                  {/* Ladder (mid-platform to top) */}
                  <g id="ladderToTop">
                    {/* Vertical rails */}
                    <line x1="155" y1="165" x2="155" y2="420" stroke="#4b5563" strokeWidth="4" />
                    <line x1="175" y1="165" x2="175" y2="420" stroke="#4b5563" strokeWidth="4" />

                    {/* Rungs */}
                    {[180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400].map((y, i) => (
                      <line
                        key={i}
                        x1="155"
                        y1={y}
                        x2="175"
                        y2={y}
                        stroke="#4b5563"
                        strokeWidth="3"
                      />
                    ))}
                  </g>

                  {/* Vertical Inlet/Outlet Pipes (running along column) */}
                  <g id="verticalPipes">
                    {/* Main pipe from ground to tank */}
                    <rect
                      x="540"
                      y="165"
                      width="20"
                      height="485"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="542" y="165" width="3" height="485" fill="#60a5fa" opacity="0.6" />

                    {/* Pipe joints/flanges */}
                    <rect x="535" y="630" width="30" height="12" fill="#1e3a8a" rx="2" />
                    <rect x="535" y="420" width="30" height="12" fill="#1e3a8a" rx="2" />
                    <rect x="535" y="165" width="30" height="12" fill="#1e3a8a" rx="2" />
                  </g>

                  {/* Tank Platform (walkway around tank) */}
                  <g id="tankPlatform">
                    <rect
                      x="205"
                      y="140"
                      width="390"
                      height="25"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Platform railing */}
                    <line x1="205" y1="140" x2="595" y2="140" stroke="#4b5563" strokeWidth="3" />
                    {/* Vertical rail posts */}
                    {[225, 285, 345, 405, 465, 525, 575].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1="130"
                        x2={x}
                        y2="140"
                        stroke="#4b5563"
                        strokeWidth="2"
                      />
                    ))}
                    {/* Top rail */}
                    <line x1="205" y1="130" x2="595" y2="130" stroke="#4b5563" strokeWidth="3" />
                  </g>

                  {/* Cylindrical Water Tank (true side view) */}
                  <g id="waterTank">
                    {/* Tank bottom - straight line */}
                    <line x1="220" y1="135" x2="580" y2="135" stroke="#ca8a04" strokeWidth="3" />

                    {/* Tank body (cylindrical sides) */}
                    <rect
                      x="220"
                      y="-35"
                      width="360"
                      height="170"
                      fill="url(#tankMetalGradient)"
                      stroke="#ca8a04"
                      strokeWidth="3"
                    />

                    {/* Tank top curve */}
                    <ellipse
                      cx="400"
                      cy="-35"
                      rx="180"
                      ry="25"
                      fill="#fde68a"
                      stroke="#ca8a04"
                      strokeWidth="3"
                      opacity="0.5"
                    />

                    {/* Left edge highlight */}
                    <line x1="220" y1="-35" x2="220" y2="135" stroke="#fef3c7" strokeWidth="2" />

                    {/* Right edge shadow */}
                    <line x1="580" y1="-35" x2="580" y2="135" stroke="#92400e" strokeWidth="2" />

                    {/* Signage/Label area on tank */}
                    <rect
                      x="320"
                      y="20"
                      width="160"
                      height="60"
                      fill="#3b82f6"
                      opacity="0.7"
                      stroke="#1e40af"
                      strokeWidth="2"
                      rx="3"
                    />
                    <text
                      x="400"
                      y="55"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="22"
                      fontWeight="bold"
                    >
                      WATER
                    </text>

                    {/* Small hatch/door */}
                    <rect
                      x="500"
                      y="80"
                      width="40"
                      height="45"
                      fill="#6b7280"
                      stroke="#4b5563"
                      strokeWidth="2"
                      rx="2"
                    />
                    <circle cx="532" cy="102" r="3" fill="#374151" />
                  </g>

                  {/* Water Level (animated) */}
                  <g clipPath="url(#waterClip)">
                    {tank.tankLevel > 0 && (
                      <>
                        {/* Main Water Body */}
                        <rect
                          x="220"
                          y={-35 + 170 * (1 - tank.tankLevel / 100)}
                          width="360"
                          height={170 * (tank.tankLevel / 100)}
                          fill="url(#waterGradient)"
                          className="transition-all duration-1000"
                        />

                        {/* Water surface shimmer */}
                        <ellipse
                          cx="400"
                          cy={-35 + 170 * (1 - tank.tankLevel / 100)}
                          rx="178"
                          ry="6"
                          fill="#ffffff"
                          opacity="0.4"
                          className="transition-all duration-1000"
                        >
                          <animate
                            attributeName="ry"
                            values="6;11;6"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </ellipse>

                        {/* Bubbles */}
                        {tank.isFilling && (
                          <>
                            <circle cx="280" cy="110" r="3" fill="#ffffff" opacity="0.6">
                              <animate
                                attributeName="cy"
                                values="130;-30;130"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="350" cy="115" r="2.5" fill="#ffffff" opacity="0.5">
                              <animate
                                attributeName="cy"
                                values="135;-25;135"
                                dur="3.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="420" cy="112" r="3.5" fill="#ffffff" opacity="0.6">
                              <animate
                                attributeName="cy"
                                values="132;-28;132"
                                dur="2.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="490" cy="118" r="2" fill="#ffffff" opacity="0.5">
                              <animate
                                attributeName="cy"
                                values="138;-22;138"
                                dur="3.2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="540" cy="105" r="3" fill="#ffffff" opacity="0.6">
                              <animate
                                attributeName="cy"
                                values="125;-35;125"
                                dur="3.3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}
                      </>
                    )}
                  </g>

                  {/* Flat Circular Roof with Safety Railing */}
                  <g id="tankRoof">
                    {/* Roof platform */}
                    <ellipse
                      cx="400"
                      cy="-40"
                      rx="185"
                      ry="28"
                      fill="#fde68a"
                      stroke="#ca8a04"
                      strokeWidth="3"
                    />

                    {/* Safety railing around roof */}
                    <ellipse
                      cx="400"
                      cy="-55"
                      rx="185"
                      ry="28"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="3"
                    />
                    {/* Vertical posts */}
                    {[215, 270, 325, 380, 435, 490, 545, 585].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1={-61 + (Math.abs(400 - x) / 185) * 8}
                        x2={x}
                        y2={-45 + (Math.abs(400 - x) / 185) * 7}
                        stroke="#4b5563"
                        strokeWidth="2"
                      />
                    ))}
                  </g>

                  {/* Pipe connection to tank */}
                  <g id="tankPipeConnection">
                    {/* Horizontal pipe from vertical pipe to tank */}
                    <rect
                      x="520"
                      y="165"
                      width="30"
                      height="15"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="522" y="167" width="3" height="11" fill="#60a5fa" opacity="0.6" />
                  </g>

                  {/* Water Level Display Overlay */}
                  {tank.tankLevel > 0 && (
                    <g id="waterLevelDisplay">
                      {/* Percentage display - positioned based on water level to avoid collision */}
                      <text
                        x="400"
                        y={Math.max(-20, -35 + 170 * (1 - tank.tankLevel / 100) - 15)}
                        fontSize="36"
                        fill="#0891b2"
                        textAnchor="middle"
                        fontWeight="bold"
                        stroke="#ffffff"
                        strokeWidth="3"
                        paintOrder="stroke"
                      >
                        {(tank.tankLevel || 0).toFixed(0)}%
                      </text>

                      {/* Volume display */}
                      <rect x="340" y="150" width="120" height="24" fill="rgba(0,0,0,0.7)" rx="6" />
                      <text
                        x="400"
                        y="167"
                        fontSize="14"
                        fill="#ffffff"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {(tank.currentVolume || 0).toLocaleString()} L
                      </text>
                    </g>
                  )}
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
                    <div
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        tank.isFilling
                          ? 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/30'
                          : tank.tankLevel > 80
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                            : tank.tankLevel > 30
                              ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30'
                              : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30'
                      }`}
                    >
                      <Droplet size={28} className="text-white md:w-9 md:h-9" />
                      {tank.isFilling && (
                        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-slate-400 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-xl md:text-3xl font-black text-black mb-0.5 md:mb-1">
                        {tank.isFilling
                          ? 'FILLING'
                          : tank.tankLevel > 80
                            ? 'FULL'
                            : tank.tankLevel > 30
                              ? 'NORMAL'
                              : 'LOW'}
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
                            <span className="hidden md:inline">
                              {tank.tankLevel > 80
                                ? 'At Capacity'
                                : tank.tankLevel > 30
                                  ? 'Operational'
                                  : 'Refill Required'}
                            </span>
                            <span className="md:hidden">
                              {tank.tankLevel > 80 ? 'Full' : tank.tankLevel > 30 ? 'OK' : 'Low'}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Level Indicator */}
                  <div className="w-full bg-slate-200 rounded-full h-2 md:h-3 overflow-hidden">
                    <div
                      className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                        tank.tankLevel > 80
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : tank.tankLevel > 30
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                            : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                      style={{ width: `${tank.tankLevel || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water Usage - Yesterday & Today */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 block">
                  Water Usage
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-200">
                    <p className="text-[10px] md:text-xs text-blue-600 font-semibold uppercase mb-1">
                      Yesterday
                    </p>
                    <p className="text-lg md:text-2xl font-black text-blue-700">
                      {(8450).toLocaleString()}
                    </p>
                    <p className="text-[10px] md:text-sm text-blue-600 mt-0.5">Liters</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-green-200">
                    <p className="text-[10px] md:text-xs text-green-600 font-semibold uppercase mb-1">
                      Today
                    </p>
                    <p className="text-lg md:text-2xl font-black text-green-700">
                      {(tank.currentVolume || 7200).toLocaleString()}
                    </p>
                    <p className="text-[10px] md:text-sm text-green-600 mt-0.5">Liters</p>
                  </div>
                </div>
              </div>

              {/* Valve Controls */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 block">
                  Valve Controls
                </label>
                <div className="space-y-3 md:space-y-4">
                  {/* Inlet Valve Controls */}
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-600 mb-2">
                      Inlet Valve
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <button
                        onClick={() => {
                          if (tank.inletValveStatus !== 'OPEN') {
                            toggleTankInlet();
                          }
                        }}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                          tank.inletValveStatus === 'OPEN'
                            ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white shadow-green-500/30'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30 cursor-pointer'
                        }`}
                      >
                        <span className="flex flex-col items-center gap-1">
                          <Settings size={16} className="md:w-5 md:h-5" />
                          <span>OPEN</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          if (tank.inletValveStatus === 'OPEN') {
                            toggleTankInlet();
                          }
                        }}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                          tank.inletValveStatus !== 'OPEN'
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-red-500/30'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30 cursor-pointer'
                        }`}
                      >
                        <span className="flex flex-col items-center gap-1">
                          <Settings size={16} className="md:w-5 md:h-5" />
                          <span>CLOSE</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Outlet Valve Controls */}
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-600 mb-2">
                      Outlet Valve
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <button
                        onClick={() => {
                          if (tank.outletValveStatus !== 'OPEN') {
                            toggleTankOutlet();
                          }
                        }}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                          tank.outletValveStatus === 'OPEN'
                            ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white shadow-green-500/30'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30 cursor-pointer'
                        }`}
                      >
                        <span className="flex flex-col items-center gap-1">
                          <Settings size={16} className="md:w-5 md:h-5" />
                          <span>OPEN</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          if (tank.outletValveStatus === 'OPEN') {
                            toggleTankOutlet();
                          }
                        }}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                          tank.outletValveStatus !== 'OPEN'
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-red-500/30'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30 cursor-pointer'
                        }`}
                      >
                        <span className="flex flex-col items-center gap-1">
                          <Settings size={16} className="md:w-5 md:h-5" />
                          <span>CLOSE</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valve Timer Control */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl border-2 border-amber-200 p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs md:text-sm font-bold text-amber-800 uppercase flex items-center gap-2">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4"
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
                    Keep Valve Close Timer
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs text-amber-600 font-semibold">OFF</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-8 h-4 md:w-11 md:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] md:after:top-[2px] md:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                    <span className="text-[10px] md:text-xs text-amber-600 font-semibold">ON</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="flex-1 bg-white border-2 border-amber-300 rounded-md px-2 py-1 md:px-3 md:py-2 text-[10px] md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue="06:00"
                    />
                    <input
                      type="time"
                      className="flex-1 bg-white border-2 border-amber-300 rounded-md px-2 py-1 md:px-3 md:py-2 text-[10px] md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      defaultValue="18:00"
                    />
                  </div>
                  <p className="text-[9px] md:text-xs text-amber-700 text-center">
                    Valves will remain closed during scheduled hours
                  </p>
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
              One or more quality parameters are outside safe limits. Please review quality metrics
              below.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {tankMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor =
            metric.color === 'green'
              ? 'text-green-600'
              : metric.color === 'red'
                ? 'text-red-600'
                : metric.color === 'amber'
                  ? 'text-amber-600'
                  : metric.color === 'blue'
                    ? 'text-blue-600'
                    : 'text-emerald-600';

          return (
            <div
              key={idx}
              className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-4 border-slate-300"
            >
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <Icon size={16} className={`${statusColor} md:w-8 md:h-8`} />
                {metric.color === 'red' && (
                  <AlertTriangle size={14} className="text-red-600 md:w-5 md:h-5" />
                )}
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold">{metric.label}</p>
              <p className="text-xs md:text-3xl font-black text-black mt-1 md:mt-2">
                {metric.value}{' '}
                <span className="text-[10px] md:text-2xl text-gray-500">{metric.unit}</span>
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
              <span
                className={`text-lg md:text-3xl font-black ${tank.tankLevel < 20 ? 'text-red-600' : tank.tankLevel > 90 ? 'text-amber-600' : 'text-green-600'}`}
              >
                {(tank.tankLevel || 65).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${tank.tankLevel < 20 ? 'bg-red-600' : tank.tankLevel > 90 ? 'bg-amber-600' : 'bg-green-600'}`}
                style={{ width: `${tank.tankLevel || 65}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">
              {tank.tankLevel < 20
                ? '⚠ Critical low level - Initiate refill'
                : tank.tankLevel > 90
                  ? '⚠ Near capacity - Monitor overflow'
                  : '✓ Optimal water level'}
            </p>
          </div>

          {/* Flow Rate Analysis */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-semibold text-slate-600 flex items-center gap-2">
                <Activity size={16} className="md:w-5 md:h-5" /> Inlet Flow Rate
              </span>
              <span
                className={`text-lg md:text-3xl font-black ${(tank.inletFlowRate || 450) < 300 ? 'text-red-600' : 'text-green-600'}`}
              >
                {(tank.inletFlowRate || 450).toFixed(0)} L/min
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${(tank.inletFlowRate || 450) < 300 ? 'bg-red-600' : 'bg-green-600'}`}
                style={{ width: `${Math.min(100, ((tank.inletFlowRate || 450) / 600) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">
              {(tank.inletFlowRate || 450) < 300
                ? '⚠ Low flow detected - Check inlet valve or pump'
                : '✓ Normal inlet flow'}
            </p>
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
              <div
                className="h-3 rounded-full transition-all bg-blue-600"
                style={{ width: `${Math.min(100, ((tank.temperature || 26) / 40) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">Temperature monitoring (informational only)</p>
          </div>

          {/* Valve Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">Inlet Valve</span>
                <div
                  className={`w-3 h-3 rounded-full ${tank.inletValveStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
                ></div>
              </div>
              <p className="text-lg font-black text-slate-900">
                {tank.inletValveStatus || 'CLOSED'}
              </p>
              <p className="text-2xs text-blue-600">
                {tank.inletValveStatus === 'OPEN' ? '✓ Filling active' : '— Standby'}
              </p>
            </div>

            <div className="space-y-2 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">Outlet Valve</span>
                <div
                  className={`w-3 h-3 rounded-full ${tank.outletValveStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
                ></div>
              </div>
              <p className="text-lg font-black text-slate-900">
                {tank.outletValveStatus || 'CLOSED'}
              </p>
              <p className="text-2xs text-blue-600">
                {tank.outletValveStatus === 'OPEN' ? '✓ Distribution active' : '— Standby'}
              </p>
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
            <p className="text-cyan-100 text-sm mt-1">
              Continuous quality assurance and compliance tracking
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-xs font-black ${isWaterSafe ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}
          >
            {isWaterSafe ? '✓ SAFE FOR USE' : '⚠ REQUIRES ATTENTION'}
          </span>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {qualityData.map((param, idx) => {
            const isGood = param.status === 'Good' || param.status === 'Excellent';
            const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border-2 border-cyan-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">{param.parameter}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-2xs font-bold ${
                      param.status === 'Excellent'
                        ? 'bg-green-100 text-green-700'
                        : param.status === 'Good'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
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
                    className={`h-full transition-all ${isGood ? 'bg-green-600' : 'bg-amber-500'}`}
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
        <div
          className={`mt-6 p-4 rounded-lg border-2 ${
            isWaterSafe ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}
        >
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
