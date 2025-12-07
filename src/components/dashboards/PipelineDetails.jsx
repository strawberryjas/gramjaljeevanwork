import React, { useMemo } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import {
  Activity,
  Gauge,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Radio,
  Droplet,
  TrendingUp,
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

export const PipelineDetails = ({ pipelineId, onBack }) => {
  const { state, toggleValve, isLive } = useSimulationData();
  const pipelines = state?.pipelines || [];
  const pipeline = pipelines.find((p) => p.pipelineId === pipelineId) || pipelines[0];
  const [showDetailsSidebar, setShowDetailsSidebar] = React.useState(false);

  // Get tank water quality for baseline TDS comparison
  const tankWaterQuality = state?.overheadTank?.waterQuality || {};
  const tankTDS = tankWaterQuality.TDS || 320;

  // Ensure we have a valid pipeline ID
  const actualPipelineId = pipeline?.pipelineId || pipelineId;

  // Stabilize hasLeakage - once a pipe has leakage, it persists regardless of valve state
  const hasLeakage = useMemo(() => {
    return pipeline ? pipeline.leakageProbability > 30 : false;
  }, [pipeline?.leakageProbability]);

  // Safe toggle function
  const handleToggleValve = () => {
    if (actualPipelineId) {
      console.log('Toggling valve for pipeline:', actualPipelineId);
      const result = toggleValve(actualPipelineId);
      if (!result.success) {
        console.error('Valve toggle failed:', result.reason);
        alert(result.reason || 'Failed to toggle valve');
      }
    } else {
      console.error('Cannot toggle valve: invalid pipeline ID');
    }
  };

  if (!pipeline) {
    return (
      <div className="text-center p-6">
        <p className="text-slate-600">Pipeline not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const isOpen = pipeline.valveStatus === 'OPEN';
  const inletFlow = pipeline.inlet?.flowSensor?.value || 0;
  const outletFlow = pipeline.outlet?.flowSensor?.value || 0;
  const inletPressure = pipeline.inlet?.pressureSensor?.value || 0;
  const outletPressure = pipeline.outlet?.pressureSensor?.value || 0;
  const flowLoss = inletFlow - outletFlow;
  const inletQuality = pipeline.inlet?.qualitySensor || {};
  const outletQuality = pipeline.outlet?.qualitySensor || {};

  // Calculate water color based on TDS degradation from tank baseline
  // Outlet sensors only detect TDS, so compare with tank water quality
  const getWaterColor = (quality, isOutlet = false, tankTDSBaseline = 320) => {
    const outletTDS = quality.TDS || 320;

    // For inlet: always use clean blue (tank water)
    if (!isOutlet) {
      return { base: '#0891b2', light: '#06b6d4', bright: '#22d3ee', dark: '#0e7490' }; // Clear cyan-blue
    }

    // For outlet: compare TDS with tank baseline to detect contamination during distribution
    const TDSIncrease = outletTDS - tankTDSBaseline;

    // Water quality classification based on TDS increase from tank
    // Brown/murky: TDS increased by >100 ppm (significant contamination in pipes)
    if (TDSIncrease > 100) {
      return { base: '#78350f', light: '#92400e', bright: '#b45309', dark: '#451a03' }; // Brown/murky - unsafe
    }
    // Light cloudy: TDS increased by 50-100 ppm (moderate contamination)
    else if (TDSIncrease > 50) {
      return { base: '#0284c7', light: '#0ea5e9', bright: '#38bdf8', dark: '#0369a1' }; // Light blue - monitor
    }
    // Slight increase 20-50 ppm: acceptable range
    else if (TDSIncrease > 20) {
      return { base: '#06b6d4', light: '#22d3ee', bright: '#67e8f9', dark: '#0891b2' }; // Cyan - good
    }

    // Default: Clean blue (TDS increase <20 ppm - excellent quality)
    return { base: '#0891b2', light: '#06b6d4', bright: '#22d3ee', dark: '#0e7490' }; // Clear cyan-blue - excellent
  };

  const inletWaterColor = getWaterColor(inletQuality, false, tankTDS);
  const outletWaterColor = getWaterColor(outletQuality, true, tankTDS);

  // Calculate decay animation opacity for realistic flow fadeout
  const calculateFlowOpacity = () => {
    if (!isOpen) {
      // Gradual fadeout based on remaining pressure/flow
      const flowRatio = inletFlow / 100; // normalize
      const pressureRatio = inletPressure / 4; // normalize to typical max
      return Math.max(flowRatio, pressureRatio) * 0.8;
    }
    return 1;
  };

  const flowOpacity = calculateFlowOpacity();

  // Create history data for charts
  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    inletFlow: inletFlow + Math.random() * 5,
    outletFlow: outletFlow + Math.random() * 5,
    inletPressure: inletPressure + Math.random() * 0.2,
    outletPressure: outletPressure + Math.random() * 0.2,
  }));

  const pipelineMetrics = [
    {
      label: 'Valve Status',
      value: pipeline.valveStatus || 'CLOSED',
      icon: Settings,
      color: isOpen ? 'green' : 'red',
      unit: '',
    },
    {
      label: 'Inlet Flow',
      value: inletFlow.toFixed(1),
      icon: Activity,
      color: 'cyan',
      unit: 'L/min',
    },
    {
      label: 'Outlet Flow',
      value: outletFlow.toFixed(1),
      icon: Activity,
      color: 'orange',
      unit: 'L/min',
    },
    {
      label: 'Inlet Pressure',
      value: inletPressure.toFixed(2),
      icon: Gauge,
      color: 'cyan',
      unit: 'Bar',
    },
    {
      label: 'Outlet Pressure',
      value: outletPressure.toFixed(2),
      icon: Gauge,
      color: 'orange',
      unit: 'Bar',
    },
    {
      label: 'Flow Loss',
      value: flowLoss.toFixed(1),
      icon: TrendingUp,
      color: flowLoss > 5 ? 'red' : 'green',
      unit: 'L/min',
    },
    {
      label: 'Leakage Probability',
      value: (pipeline.leakageProbability || 0).toFixed(1),
      icon: AlertTriangle,
      color: hasLeakage ? 'red' : 'green',
      unit: '%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" size={28} />
              Pipeline {pipelineId} Details
            </h2>
            <p className="text-sm text-slate-500">
              {pipeline.pipelineName || `Distribution Pipeline ${pipelineId}`}
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

      {/* Pipeline Control Card */}
      <div
        className={`bg-gradient-to-r rounded-xl p-6 text-white ${
          isOpen ? 'from-green-900 to-green-800' : 'from-red-900 to-red-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isOpen
                  ? 'bg-green-500 shadow-lg shadow-green-300'
                  : 'bg-red-500 shadow-lg shadow-red-300'
              }`}
            >
              <Settings size={40} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-200">Valve Status</p>
              <p className="text-3xl font-black">{pipeline.valveStatus || 'CLOSED'}</p>
              <p className="text-xs text-slate-300 mt-1">
                Location: {pipeline.pipelineName?.split(' - ')[1] || `Ward ${pipelineId}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleValve}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
              isOpen
                ? 'bg-red-600 hover:bg-red-700 shadow-lg'
                : 'bg-green-600 hover:bg-green-700 shadow-lg'
            }`}
          >
            {isOpen ? 'Close Valve' : 'Open Valve'}
          </button>
        </div>
      </div>

      {/* Realistic 3D Pipeline Visualization */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Activity className="text-cyan-400" size={28} />
                Live Pipeline Flow Monitoring
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Underground Distribution Pipeline • Length: {(pipeline.length || 450).toFixed(0)}m
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${
                isOpen
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isOpen && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
              {isOpen ? '● FLOWING' : '● VALVE CLOSED'}
            </div>
          </div>
        </div>

        <div className="p-8 relative">
          {/* Ambient Glow Effect */}
          {isOpen && !hasLeakage && (
            <div
              className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-blue-500/5 to-transparent animate-pulse pointer-events-none"
              style={{ animationDuration: '3s' }}
            ></div>
          )}
          {hasLeakage && isOpen && (
            <div
              className="absolute inset-0 bg-gradient-radial from-red-500/10 via-orange-500/5 to-transparent animate-pulse pointer-events-none"
              style={{ animationDuration: '2s' }}
            ></div>
          )}

          {/* Main Pipeline SVG */}
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 1000 400" className="w-full h-auto" style={{ maxHeight: '400px' }}>
              <defs>
                {/* Gradients for Realistic Pipe */}
                <linearGradient id="pipeMetalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#71717a" />
                  <stop offset="30%" stopColor="#52525b" />
                  <stop offset="70%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#27272a" />
                </linearGradient>

                <linearGradient id="pipeMetalGradientClosed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#52525b" />
                  <stop offset="50%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#27272a" />
                </linearGradient>

                <linearGradient id="waterFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#0891b2" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0e7490" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="leakageWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>

                <radialGradient id="valveGradient">
                  <stop offset="0%" stopColor="#52525b" />
                  <stop offset="70%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#27272a" />
                </radialGradient>

                {/* Shadows and Filters */}
                <filter id="pipeDropShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                  <feOffset dx="0" dy="10" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ground/Underground Context */}
              <rect x="0" y="280" width="1000" height="120" fill="#18181b" opacity="0.3" />
              <line
                x1="0"
                y1="280"
                x2="1000"
                y2="280"
                stroke="#27272a"
                strokeWidth="2"
                strokeDasharray="10,5"
              />

              {/* Inlet Chamber/Connection */}
              <g transform="translate(50, 180)">
                <rect
                  x="-30"
                  y="-40"
                  width="60"
                  height="100"
                  fill="#27272a"
                  stroke="#52525b"
                  strokeWidth="3"
                  rx="4"
                  filter="url(#pipeDropShadow)"
                />
                <rect
                  x="-25"
                  y="-35"
                  width="50"
                  height="90"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="2"
                  rx="3"
                />

                {/* Dynamic Water Level based on Flow Rate */}
                {(() => {
                  // Calculate water level height based on flow rate (0-100 L/min = 0-80px height)
                  const maxFlow = 100; // L/min
                  const maxHeight = 80; // pixels
                  const waterHeight = Math.min((inletFlow / maxFlow) * maxHeight, maxHeight);
                  const waterY = 50 - waterHeight; // Start from bottom (y=50)

                  return (
                    (inletFlow > 0.5 || inletPressure > 0.05) && (
                      <g opacity={flowOpacity}>
                        {/* Water fill with gradient */}
                        <defs>
                          <linearGradient id="inletWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop
                              offset="0%"
                              stopColor={inletWaterColor.bright}
                              stopOpacity="0.6"
                            />
                            <stop
                              offset="100%"
                              stopColor={inletWaterColor.dark}
                              stopOpacity="0.8"
                            />
                          </linearGradient>
                        </defs>

                        {/* Main water body */}
                        <rect
                          x="-22"
                          y={waterY}
                          width="44"
                          height={waterHeight}
                          fill="url(#inletWaterGrad)"
                          rx="2"
                        />

                        {/* Animated water surface with ripples */}
                        <path
                          d={`M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY}`}
                          fill={inletWaterColor.light}
                          opacity="0.5"
                        >
                          <animate
                            attributeName="d"
                            values={`M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY};
                                  M -22,${waterY} Q -11,${waterY + 2} 0,${waterY} T 22,${waterY};
                                  M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY}`}
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </path>

                        {/* Small bubbles rising */}
                        {[0, 1, 2].map((i) => (
                          <circle
                            key={i}
                            cx={-12 + i * 12}
                            cy={waterY + 10}
                            r="1.5"
                            fill="#e0f2fe"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="cy"
                              from={waterY + waterHeight - 5}
                              to={waterY}
                              dur={`${2 + i * 0.3}s`}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.4;0.8;0.4"
                              dur={`${2 + i * 0.3}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        ))}
                      </g>
                    )
                  );
                })()}

                <text
                  x="0"
                  y="-50"
                  fontSize="11"
                  fill="#71717a"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  INLET
                </text>
                <text
                  x="0"
                  y="85"
                  fontSize="14"
                  fill="#06b6d4"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {inletFlow.toFixed(1)}
                </text>
                <text x="0" y="100" fontSize="9" fill="#71717a" textAnchor="middle">
                  L/min
                </text>
                <text x="0" y="115" fontSize="9" fill="#10b981" textAnchor="middle">
                  {inletPressure.toFixed(2)} Bar
                </text>
              </g>

              {/* Outlet Chamber/Connection */}
              <g transform="translate(950, 180)">
                <rect
                  x="-30"
                  y="-40"
                  width="60"
                  height="100"
                  fill="#27272a"
                  stroke="#52525b"
                  strokeWidth="3"
                  rx="4"
                  filter="url(#pipeDropShadow)"
                />
                <rect
                  x="-25"
                  y="-35"
                  width="50"
                  height="90"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="2"
                  rx="3"
                />

                {/* Dynamic Water Level based on Flow Rate */}
                {(() => {
                  // Calculate water level height based on flow rate (0-100 L/min = 0-80px height)
                  const maxFlow = 100; // L/min
                  const maxHeight = 80; // pixels
                  const waterHeight = Math.min((outletFlow / maxFlow) * maxHeight, maxHeight);
                  const waterY = 50 - waterHeight; // Start from bottom (y=50)

                  return (
                    (outletFlow > 0.5 || outletPressure > 0.05) && (
                      <g opacity={flowOpacity}>
                        {/* Water fill with gradient */}
                        <defs>
                          <linearGradient id="outletWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop
                              offset="0%"
                              stopColor={outletWaterColor.bright}
                              stopOpacity="0.6"
                            />
                            <stop
                              offset="100%"
                              stopColor={outletWaterColor.dark}
                              stopOpacity="0.8"
                            />
                          </linearGradient>
                        </defs>

                        {/* Main water body */}
                        <rect
                          x="-22"
                          y={waterY}
                          width="44"
                          height={waterHeight}
                          fill="url(#outletWaterGrad)"
                          rx="2"
                        />

                        {/* Animated water surface with ripples */}
                        <path
                          d={`M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY}`}
                          fill={outletWaterColor.light}
                          opacity="0.5"
                        >
                          <animate
                            attributeName="d"
                            values={`M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY};
                                  M -22,${waterY} Q -11,${waterY + 2} 0,${waterY} T 22,${waterY};
                                  M -22,${waterY} Q -11,${waterY - 2} 0,${waterY} T 22,${waterY}`}
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </path>

                        {/* Small bubbles rising */}
                        {[0, 1, 2].map((i) => (
                          <circle
                            key={i}
                            cx={-12 + i * 12}
                            cy={waterY + 10}
                            r="1.5"
                            fill="#e0f2fe"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="cy"
                              from={waterY + waterHeight - 5}
                              to={waterY}
                              dur={`${2 + i * 0.3}s`}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.4;0.8;0.4"
                              dur={`${2 + i * 0.3}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        ))}
                      </g>
                    )
                  );
                })()}

                <text
                  x="0"
                  y="-50"
                  fontSize="11"
                  fill="#71717a"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  OUTLET
                </text>
                <text
                  x="0"
                  y="85"
                  fontSize="14"
                  fill="#06b6d4"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {outletFlow.toFixed(1)}
                </text>
                <text x="0" y="100" fontSize="9" fill="#71717a" textAnchor="middle">
                  L/min
                </text>
                <text x="0" y="115" fontSize="9" fill="#10b981" textAnchor="middle">
                  {outletPressure.toFixed(2)} Bar
                </text>
              </g>

              {/* Main Pipeline Section 1 (Inlet to Valve) - Rural India Style */}
              <g filter="url(#pipeDropShadow)">
                {/* Outer Pipe Body - Concrete/PVC pipes common in rural India */}
                <rect
                  x="110"
                  y="160"
                  width="340"
                  height="60"
                  fill={isOpen ? 'url(#pipeMetalGradient)' : 'url(#pipeMetalGradientClosed)'}
                  rx="6"
                />
                <rect x="115" y="165" width="330" height="50" fill="#52525b" rx="4" />

                {/* Weathered/Aged pipe appearance */}
                <rect x="115" y="165" width="330" height="8" fill="#71717a" opacity="0.3" rx="4" />
                <rect x="115" y="207" width="330" height="8" fill="#27272a" opacity="0.2" rx="4" />

                {/* Pipe Joints - Typical rural connections with couplings */}
                {[150, 250, 350].map((x, i) => (
                  <g key={i}>
                    {/* Joint Collar */}
                    <rect x={x} y="158" width="16" height="64" fill="#52525b" rx="2" />
                    <rect x={x + 2} y="161" width="12" height="58" fill="#3f3f46" rx="1" />
                    {/* Coupling Bolts */}
                    <circle
                      cx={x + 8}
                      cy="165"
                      r="2.5"
                      fill="#27272a"
                      stroke="#71717a"
                      strokeWidth="0.5"
                    />
                    <circle
                      cx={x + 8}
                      cy="215"
                      r="2.5"
                      fill="#27272a"
                      stroke="#71717a"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}

                {/* Water Flow Inside (Section 1) - Realistic Flowing Water with Quality-Based Color */}
                {(inletFlow > 0.5 || inletPressure > 0.05) && !hasLeakage && (
                  <g key={`section1-normal-${pipelineId}`} clipPath="url(#pipeClip1)">
                    <defs>
                      <clipPath id="pipeClip1">
                        <rect x="115" y="170" width="330" height="40" rx="4" />
                      </clipPath>
                      {/* Animated gradient for flowing water effect - Based on Inlet Quality */}
                      <linearGradient id="flowingWater1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={inletWaterColor.dark} stopOpacity="0.9">
                          <animate
                            attributeName="offset"
                            values="-1;1"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="25%" stopColor={inletWaterColor.base} stopOpacity="0.95">
                          <animate
                            attributeName="offset"
                            values="-0.75;1.25"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="50%" stopColor={inletWaterColor.light} stopOpacity="1">
                          <animate
                            attributeName="offset"
                            values="-0.5;1.5"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="75%" stopColor={inletWaterColor.bright} stopOpacity="0.95">
                          <animate
                            attributeName="offset"
                            values="-0.25;1.75"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="100%" stopColor={inletWaterColor.dark} stopOpacity="0.9">
                          <animate
                            attributeName="offset"
                            values="0;2"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </stop>
                      </linearGradient>
                    </defs>

                    {/* Base Water Layer */}
                    <rect
                      x="115"
                      y="170"
                      width="330"
                      height="40"
                      fill={inletWaterColor.base}
                      opacity={0.7 * flowOpacity}
                    />

                    {/* Animated Flowing Layer */}
                    <rect
                      x="115"
                      y="170"
                      width="330"
                      height="40"
                      fill="url(#flowingWater1)"
                      opacity={0.8 * flowOpacity}
                    />

                    {/* Turbulent Water Bubbles - Multiple Sizes */}
                    {[...Array(12)].map((_, i) => {
                      const yPos = 175 + (i % 4) * 8;
                      const size = 2 + (i % 3);
                      const duration = 2 + (i % 3) * 0.3;
                      const delay = i * 0.2;
                      return (
                        <ellipse
                          key={i}
                          cx="120"
                          cy={yPos}
                          rx={size}
                          ry={size * 0.8}
                          fill={inletWaterColor.bright}
                          opacity={0.6 * flowOpacity}
                        >
                          <animate
                            attributeName="cx"
                            from="120"
                            to="440"
                            dur={`${duration}s`}
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0.7;0.3"
                            dur={`${duration}s`}
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="ry"
                            values={`${size * 0.8};${size * 1.2};${size * 0.8}`}
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </ellipse>
                      );
                    })}

                    {/* Surface Ripples */}
                    <path
                      d="M 115,172 Q 160,168 205,172 T 295,172 T 385,172 T 445,172"
                      stroke={inletWaterColor.bright}
                      strokeWidth="1"
                      fill="none"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="d"
                        values="M 115,172 Q 160,168 205,172 T 295,172 T 385,172 T 445,172;
                                M 115,172 Q 160,176 205,172 T 295,172 T 385,172 T 445,172;
                                M 115,172 Q 160,168 205,172 T 295,172 T 385,172 T 445,172"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                )}

                {/* Leaking Pipe Water Flow - Reduced flow with quality-based color */}
                {(inletFlow > 0.5 || inletPressure > 0.05) && hasLeakage && (
                  <g key={`section1-leak-${pipelineId}`} clipPath="url(#pipeClip1Leak)">
                    <defs>
                      <clipPath id="pipeClip1Leak">
                        <rect x="115" y="170" width="330" height="40" rx="4" />
                      </clipPath>
                    </defs>

                    {/* Reduced Water Base - uses quality color, not brown */}
                    <rect
                      x="115"
                      y="180"
                      width="330"
                      height="28"
                      fill={inletWaterColor.base}
                      opacity="0.6"
                    />

                    {/* Slower water movement due to leak (not contamination) */}
                    <rect
                      x="115"
                      y="180"
                      width="330"
                      height="28"
                      fill={inletWaterColor.light}
                      opacity="0.3"
                    >
                      <animate
                        attributeName="x"
                        from="115"
                        to="85"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.2;0.4;0.2"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </rect>

                    {/* Slower moving water particles (due to pressure loss) */}
                    {[...Array(6)].map((_, i) => {
                      const yPos = 185 + (i % 3) * 8;
                      const size = 2 + (i % 2) * 0.5;
                      const duration = 5 + (i % 3);
                      const delay = i * 0.8;
                      return (
                        <ellipse
                          key={i}
                          cx="120"
                          cy={yPos}
                          rx={size}
                          ry={size * 1.2}
                          fill={inletWaterColor.bright}
                          opacity="0.5"
                        >
                          <animate
                            attributeName="cx"
                            from="120"
                            to="440"
                            dur={`${duration}s`}
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="cy"
                            values={`${yPos};${yPos + 2};${yPos}`}
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0.6;0.3"
                            dur={`${duration}s`}
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </ellipse>
                      );
                    })}
                  </g>
                )}

                {/* No Flow Indicator */}
                {!isOpen && (
                  <text
                    x="280"
                    y="195"
                    fontSize="14"
                    fill="#71717a"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    NO FLOW
                  </text>
                )}
              </g>

              {/* Main Control Valve (Center) */}
              <g
                transform="translate(500, 190)"
                filter="url(#pipeDropShadow)"
                style={{ cursor: 'pointer' }}
                onClick={handleToggleValve}
              >
                {/* Valve Body */}
                <rect
                  x="-45"
                  y="-60"
                  width="90"
                  height="80"
                  fill="url(#valveGradient)"
                  stroke="#71717a"
                  strokeWidth="3"
                  rx="6"
                />
                <rect
                  x="-40"
                  y="-55"
                  width="80"
                  height="70"
                  fill="#3f3f46"
                  stroke="#52525b"
                  strokeWidth="2"
                  rx="4"
                />

                {/* Valve Wheel/Handle */}
                <circle cx="0" cy="-90" r="30" fill="#52525b" stroke="#71717a" strokeWidth="3" />
                <circle cx="0" cy="-90" r="22" fill="#3f3f46" stroke="#27272a" strokeWidth="2" />
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <line
                    key={angle}
                    x1="0"
                    y1="-90"
                    x2={Math.cos(((angle - 90) * Math.PI) / 180) * 18}
                    y2={-90 + Math.sin(((angle - 90) * Math.PI) / 180) * 18}
                    stroke="#71717a"
                    strokeWidth="3"
                  />
                ))}

                {/* Valve Status Indicator */}
                <circle
                  cx="0"
                  cy="-20"
                  r="12"
                  fill={isOpen ? '#22c55e' : '#ef4444'}
                  stroke="#fff"
                  strokeWidth="2.5"
                />
                {isOpen && (
                  <circle cx="0" cy="-20" r="18" fill="#22c55e" opacity="0.3">
                    <animate
                      attributeName="opacity"
                      values="0.2;0.5;0.2"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Valve Label */}
                <rect
                  x="-35"
                  y="25"
                  width="70"
                  height="22"
                  fill="#fcd34d"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x="0"
                  y="40"
                  fontSize="10"
                  fill="#78350f"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  MAIN VALVE
                </text>

                {/* Invisible clickable overlay for better hit area */}
                <rect x="-50" y="-120" width="100" height="170" fill="transparent" />
              </g>

              {/* Main Pipeline Section 2 (Valve to Outlet) - Rural India Style */}
              <g filter="url(#pipeDropShadow)">
                {/* Check for High Blockage (only show if pressure drop is very high) */}
                {(() => {
                  const hasBlockage =
                    inletPressure - outletPressure > 1.2 && isOpen && flowLoss > 15;

                  return (
                    <>
                      {/* Outer Pipe Body - Concrete/PVC Style for Rural India */}
                      <rect
                        x="550"
                        y="160"
                        width="340"
                        height="60"
                        fill={isOpen ? 'url(#pipeMetalGradient)' : 'url(#pipeMetalGradientClosed)'}
                        rx="6"
                      />
                      <rect x="555" y="165" width="330" height="50" fill="#52525b" rx="4" />

                      {/* Weathered/Aged appearance */}
                      <rect
                        x="555"
                        y="165"
                        width="330"
                        height="8"
                        fill="#71717a"
                        opacity="0.3"
                        rx="4"
                      />
                      <rect
                        x="555"
                        y="207"
                        width="330"
                        height="8"
                        fill="#27272a"
                        opacity="0.2"
                        rx="4"
                      />

                      {/* Pipe Joints - Typical Rural Pipe Connections */}
                      {[580, 680, 780].map((x, i) => (
                        <g key={i}>
                          {/* Joint Collar */}
                          <rect x={x} y="158" width="16" height="64" fill="#52525b" rx="2" />
                          <rect x={x + 2} y="161" width="12" height="58" fill="#3f3f46" rx="1" />
                          {/* Coupling Bolts */}
                          <circle
                            cx={x + 8}
                            cy="165"
                            r="2.5"
                            fill="#27272a"
                            stroke="#71717a"
                            strokeWidth="0.5"
                          />
                          <circle
                            cx={x + 8}
                            cy="215"
                            r="2.5"
                            fill="#27272a"
                            stroke="#71717a"
                            strokeWidth="0.5"
                          />
                        </g>
                      ))}

                      {/* Blockage Visualization - Only for severe cases */}
                      {hasBlockage && (
                        <g>
                          {/* Blockage Point */}
                          <ellipse cx="700" cy="190" rx="35" ry="25" fill="#78350f" opacity="0.8" />
                          <ellipse cx="700" cy="190" rx="28" ry="20" fill="#92400e" opacity="0.9" />

                          {/* Pressure Build-up Behind Blockage */}
                          <rect
                            x="560"
                            y="172"
                            width="120"
                            height="36"
                            fill="#ef4444"
                            opacity="0.2"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.15;0.3;0.15"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </rect>

                          {/* Turbulent particles before blockage */}
                          {[0, 1, 2].map((i) => (
                            <circle
                              key={i}
                              cx="620"
                              cy={180 + i * 10}
                              r="2.5"
                              fill="#f87171"
                              opacity="0.6"
                            >
                              <animate
                                attributeName="cx"
                                values="560;680;560"
                                dur="2s"
                                begin={`${i * 0.4}s`}
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.4;0.8;0.4"
                                dur="2s"
                                begin={`${i * 0.4}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          ))}

                          {/* Blockage Warning */}
                          <g transform="translate(700, 250)">
                            <rect
                              x="-45"
                              y="0"
                              width="90"
                              height="28"
                              fill="#dc2626"
                              stroke="#991b1b"
                              strokeWidth="2"
                              rx="4"
                            />
                            <text
                              x="0"
                              y="18"
                              fontSize="10"
                              fill="#fff"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              ⚠ BLOCKAGE
                            </text>
                          </g>
                        </g>
                      )}

                      {/* Normal Water Flow (Section 2) - Realistic Flowing Water with Quality-Based Color */}
                      {(outletFlow > 0.5 || outletPressure > 0.05) &&
                        !hasBlockage &&
                        !hasLeakage && (
                          <g key={`section2-normal-${pipelineId}`} clipPath="url(#pipeClip2)">
                            <defs>
                              <clipPath id="pipeClip2">
                                <rect x="555" y="170" width="330" height="40" rx="4" />
                              </clipPath>
                              {/* Animated gradient for flowing water effect - Based on Outlet Quality */}
                              <linearGradient id="flowingWater2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop
                                  offset="0%"
                                  stopColor={outletWaterColor.dark}
                                  stopOpacity="0.9"
                                >
                                  <animate
                                    attributeName="offset"
                                    values="-1;1"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                                <stop
                                  offset="25%"
                                  stopColor={outletWaterColor.base}
                                  stopOpacity="0.95"
                                >
                                  <animate
                                    attributeName="offset"
                                    values="-0.75;1.25"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                                <stop
                                  offset="50%"
                                  stopColor={outletWaterColor.light}
                                  stopOpacity="1"
                                >
                                  <animate
                                    attributeName="offset"
                                    values="-0.5;1.5"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                                <stop
                                  offset="75%"
                                  stopColor={outletWaterColor.bright}
                                  stopOpacity="0.95"
                                >
                                  <animate
                                    attributeName="offset"
                                    values="-0.25;1.75"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                                <stop
                                  offset="100%"
                                  stopColor={outletWaterColor.dark}
                                  stopOpacity="0.9"
                                >
                                  <animate
                                    attributeName="offset"
                                    values="0;2"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                              </linearGradient>
                            </defs>

                            {/* Base Water Layer */}
                            <rect
                              x="555"
                              y="170"
                              width="330"
                              height="40"
                              fill={outletWaterColor.base}
                              opacity={0.7 * flowOpacity}
                            />

                            {/* Animated Flowing Layer */}
                            <rect
                              x="555"
                              y="170"
                              width="330"
                              height="40"
                              fill="url(#flowingWater2)"
                              opacity={0.8 * flowOpacity}
                            />

                            {/* Turbulent Water Bubbles - Multiple Sizes */}
                            {[...Array(12)].map((_, i) => {
                              const yPos = 175 + (i % 4) * 8;
                              const size = 2 + (i % 3);
                              const duration = 2 + (i % 3) * 0.3;
                              const delay = i * 0.2;
                              return (
                                <ellipse
                                  key={i}
                                  cx="560"
                                  cy={yPos}
                                  rx={size}
                                  ry={size * 0.8}
                                  fill={outletWaterColor.bright}
                                  opacity={0.6 * flowOpacity}
                                >
                                  <animate
                                    attributeName="cx"
                                    from="560"
                                    to="880"
                                    dur={`${duration}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.3;0.7;0.3"
                                    dur={`${duration}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="ry"
                                    values={`${size * 0.8};${size * 1.2};${size * 0.8}`}
                                    dur="1s"
                                    repeatCount="indefinite"
                                  />
                                </ellipse>
                              );
                            })}

                            {/* Surface Ripples */}
                            <path
                              d="M 555,172 Q 600,168 645,172 T 735,172 T 825,172 T 885,172"
                              stroke={outletWaterColor.bright}
                              strokeWidth="1"
                              fill="none"
                              opacity="0.4"
                            >
                              <animate
                                attributeName="d"
                                values="M 555,172 Q 600,168 645,172 T 735,172 T 825,172 T 885,172;
                                      M 555,172 Q 600,176 645,172 T 735,172 T 825,172 T 885,172;
                                      M 555,172 Q 600,168 645,172 T 735,172 T 825,172 T 885,172"
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </g>
                        )}

                      {/* Leaking Pipe Water Flow (Section 2) - Reduced flow with quality-based color */}
                      {(outletFlow > 0.5 || outletPressure > 0.05) &&
                        !hasBlockage &&
                        hasLeakage && (
                          <g key={`section2-leak-${pipelineId}`} clipPath="url(#pipeClip2Leak)">
                            <defs>
                              <clipPath id="pipeClip2Leak">
                                <rect x="555" y="170" width="330" height="40" rx="4" />
                              </clipPath>
                            </defs>

                            {/* Reduced Water Base - uses outlet quality color */}
                            <rect
                              x="555"
                              y="180"
                              width="330"
                              height="28"
                              fill={outletWaterColor.base}
                              opacity="0.6"
                            />

                            {/* Slower water movement due to leak */}
                            <rect
                              x="555"
                              y="180"
                              width="330"
                              height="28"
                              fill={outletWaterColor.light}
                              opacity="0.3"
                            >
                              <animate
                                attributeName="x"
                                from="555"
                                to="525"
                                dur="4s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.2;0.4;0.2"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </rect>

                            {/* Slower moving water particles (due to pressure loss) */}
                            {[...Array(6)].map((_, i) => {
                              const yPos = 185 + (i % 3) * 8;
                              const size = 2 + (i % 2) * 0.5;
                              const duration = 5 + (i % 3);
                              const delay = i * 0.8;
                              return (
                                <ellipse
                                  key={i}
                                  cx="560"
                                  cy={yPos}
                                  rx={size}
                                  ry={size * 1.2}
                                  fill={outletWaterColor.bright}
                                  opacity="0.5"
                                >
                                  <animate
                                    attributeName="cx"
                                    from="560"
                                    to="880"
                                    dur={`${duration}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="cy"
                                    values={`${yPos};${yPos + 2};${yPos}`}
                                    dur="2.5s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.3;0.6;0.3"
                                    dur={`${duration}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                  />
                                </ellipse>
                              );
                            })}
                          </g>
                        )}

                      {/* Reduced flow after severe blockage */}
                      {hasBlockage && (
                        <g clipPath="url(#pipeClip2Blocked)">
                          <defs>
                            <clipPath id="pipeClip2Blocked">
                              <rect x="555" y="170" width="330" height="40" rx="4" />
                            </clipPath>
                          </defs>

                          {/* Weak flow after blockage */}
                          <rect
                            x="720"
                            y="175"
                            width="165"
                            height="30"
                            fill="url(#waterFlowGradient)"
                            opacity="0.4"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.3;0.5;0.3"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </rect>

                          {[0, 1].map((i) => (
                            <circle
                              key={i}
                              cx="730"
                              cy={182 + i * 12}
                              r="2"
                              fill="#e0f2fe"
                              opacity="0.5"
                            >
                              <animate
                                attributeName="cx"
                                from="730"
                                to="880"
                                dur="5s"
                                begin={`${i * 1}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          ))}
                        </g>
                      )}
                    </>
                  );
                })()}
              </g>

              {/* Pipe Support Brackets - Rural India Style (Brick/Concrete Pillars) */}
              {[200, 350, 500, 650, 800].map((x) => (
                <g key={x}>
                  {/* Support pillar */}
                  <rect x={x - 4} y="220" width="8" height="40" fill="#71717a" rx="1" />
                  <rect x={x - 3} y="221" width="6" height="38" fill="#52525b" />
                  {/* Base/Foundation */}
                  <rect x={x - 8} y="258" width="16" height="10" fill="#3f3f46" rx="2" />
                  <rect x={x - 7} y="260" width="14" height="6" fill="#27272a" rx="1" />
                </g>
              ))}

              {/* Realistic Pressurized Leak Visualization */}
              {hasLeakage && (inletFlow > 0.5 || inletPressure > 0.05) && (
                <g
                  key={`leak-${pipelineId}-${hasLeakage}`}
                  transform="translate(400, 220)"
                  opacity={flowOpacity}
                >
                  {/* Crack/Rupture Point with Pressure */}
                  <path
                    d="M -6,-4 L 6,4 M -6,4 L 6,-4 M 0,-6 L 0,6"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="0" r="8" fill="#ef4444" opacity="0.3">
                    <animate
                      attributeName="r"
                      values="8;12;8"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.4;0.2"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Pressurized Water Spray - Main Jet */}
                  <g>
                    {/* Central high-pressure stream */}
                    <path
                      d="M 0,0 Q -15,15 -25,35 L -30,45"
                      stroke={inletWaterColor.light}
                      strokeWidth="4"
                      fill="none"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.6;0.8;0.6"
                        dur="0.3s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 0,0 Q -8,12 -12,28 L -15,38"
                      stroke={inletWaterColor.bright}
                      strokeWidth="2.5"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="0.3s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Side spray jets */}
                    <path
                      d="M 0,0 Q 10,8 15,20 L 18,30"
                      stroke={inletWaterColor.light}
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.5;0.7;0.5"
                        dur="0.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 0,0 Q -25,5 -35,18 L -42,28"
                      stroke={inletWaterColor.base}
                      strokeWidth="2.5"
                      fill="none"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.6;0.4"
                        dur="0.35s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>

                  {/* Spray Particles/Mist */}
                  {[...Array(20)].map((_, i) => {
                    const angle = i * 18 - 90; // Spread 180 degrees downward
                    const distance = 20 + (i % 5) * 8;
                    const xEnd = Math.cos((angle * Math.PI) / 180) * distance;
                    const yEnd = Math.sin((angle * Math.PI) / 180) * distance;
                    const duration = 0.4 + (i % 4) * 0.1;
                    const delay = (i % 6) * 0.05;
                    const size = 1.5 + (i % 3) * 0.5;

                    return (
                      <circle
                        key={i}
                        cx="0"
                        cy="0"
                        r={size}
                        fill={inletWaterColor.bright}
                        opacity="0.7"
                      >
                        <animate
                          attributeName="cx"
                          from="0"
                          to={xEnd}
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          from="0"
                          to={yEnd}
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.7"
                          to="0"
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          from={size}
                          to={size * 0.3}
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  })}

                  {/* Splashing Water Droplets */}
                  {[...Array(8)].map((_, i) => {
                    const xPos = -30 + i * 8;
                    const yStart = 35 + (i % 3) * 5;
                    const yEnd = yStart + 20 + (i % 4) * 8;
                    const duration = 0.6 + (i % 3) * 0.15;
                    const delay = (i % 5) * 0.1;

                    return (
                      <ellipse
                        key={`drop-${i}`}
                        cx={xPos}
                        cy={yStart}
                        rx="2"
                        ry="3"
                        fill={inletWaterColor.base}
                        opacity="0.6"
                      >
                        <animate
                          attributeName="cy"
                          from={yStart}
                          to={yEnd}
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="ry"
                          values="3;4;2"
                          dur={`${duration}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                      </ellipse>
                    );
                  })}

                  {/* Leak Warning Icon */}
                  <g transform="translate(0, 75)" filter="url(#glowEffect)">
                    <circle cx="0" cy="0" r="20" fill="#dc2626" opacity="0.9">
                      <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <path d="M 0,-10 L -8,8 L 8,8 Z" fill="#fff" />
                    <text
                      x="0"
                      y="7"
                      fontSize="12"
                      fill="#dc2626"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      !
                    </text>
                    <text
                      x="0"
                      y="35"
                      fontSize="10"
                      fill="#dc2626"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      PRESSURIZED LEAK
                    </text>
                    <text x="0" y="48" fontSize="8" fill="#ef4444" textAnchor="middle">
                      {flowLoss.toFixed(1)} L/min @ {inletPressure.toFixed(1)} Bar
                      {!isOpen && inletFlow > 0 && ' (decaying)'}
                    </text>
                  </g>
                </g>
              )}

              {/* Flow Direction Indicators */}
              {(inletFlow > 1 || outletFlow > 1) && (
                <>
                  <g transform="translate(280, 145)">
                    <polygon points="0,0 15,8 0,16" fill="#06b6d4" opacity="0.6">
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </polygon>
                    <text x="20" y="12" fontSize="9" fill="#71717a" fontWeight="bold">
                      FLOW
                    </text>
                  </g>
                  <g transform="translate(720, 145)">
                    <polygon points="0,0 15,8 0,16" fill="#06b6d4" opacity="0.6">
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </polygon>
                    <text x="20" y="12" fontSize="9" fill="#71717a" fontWeight="bold">
                      FLOW
                    </text>
                  </g>
                </>
              )}
            </svg>
          </div>

          {/* Flow Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-8">
            <div className="bg-gray-900/50 rounded-lg md:rounded-xl p-2 md:p-4 shadow-lg border border-gray-700/50">
              <div className="text-[8px] md:text-sm font-bold text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">
                Flow Rate
              </div>
              <div
                className={`text-sm md:text-2xl font-black ${isOpen ? 'text-cyan-400' : 'text-gray-600'}`}
              >
                {isOpen ? inletFlow.toFixed(1) : '0.0'}
              </div>
              <div className="text-[8px] md:text-sm text-gray-500 mt-0.5 md:mt-1">L/min</div>
              {isOpen && (
                <div className="mt-1 md:mt-2 h-0.5 md:h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              )}
            </div>

            <div className="bg-gray-900/50 rounded-lg md:rounded-xl p-2 md:p-4 shadow-lg border border-gray-700/50">
              <div className="text-[8px] md:text-sm font-bold text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">
                Flow Loss
              </div>
              <div
                className={`text-sm md:text-2xl font-black ${flowLoss > 5 ? 'text-red-400' : 'text-green-400'}`}
              >
                {flowLoss.toFixed(1)}
              </div>
              <div className="text-[8px] md:text-sm text-gray-500 mt-0.5 md:mt-1">L/min</div>
              {flowLoss > 5 && (
                <div className="flex items-center gap-0.5 md:gap-1 mt-1 md:mt-2">
                  <AlertTriangle size={10} className="text-red-400 md:w-3 md:h-3" />
                  <span className="text-[8px] md:text-xs text-red-400 font-semibold">
                    High Loss
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-900/50 rounded-lg md:rounded-xl p-2 md:p-4 shadow-lg border border-gray-700/50">
              <div className="text-[8px] md:text-sm font-bold text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">
                Pressure Drop
              </div>
              <div
                className={`text-sm md:text-4xl font-black ${inletPressure - outletPressure > 0.5 ? 'text-amber-400' : 'text-green-400'}`}
              >
                {(inletPressure - outletPressure).toFixed(2)}
              </div>
              <div className="text-[8px] md:text-sm text-gray-500 mt-0.5 md:mt-1">Bar</div>
              {inletPressure - outletPressure > 0.8 && (
                <div className="flex items-center gap-0.5 md:gap-1 mt-1 md:mt-2">
                  <AlertTriangle size={10} className="text-amber-400 md:w-3 md:h-3" />
                  <span className="text-[8px] md:text-xs text-amber-400 font-semibold">
                    Possible Blockage
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leakage Alert */}
      {hasLeakage && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-600" />
          <div>
            <p className="font-bold text-red-800">Leakage Alert Detected</p>
            <p className="text-sm text-red-700">
              Flow loss of {flowLoss.toFixed(1)} L/min detected. Leakage probability:{' '}
              {pipeline.leakageProbability}%
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4">
        {pipelineMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor =
            metric.color === 'green'
              ? 'text-green-600'
              : metric.color === 'red'
                ? 'text-red-600'
                : metric.color === 'blue'
                  ? 'text-blue-600'
                  : metric.color === 'cyan'
                    ? 'text-cyan-600'
                    : metric.color === 'orange'
                      ? 'text-orange-600'
                      : 'text-emerald-600';

          return (
            <div
              key={idx}
              className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-2 md:border-l-4 border-slate-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-1 md:mb-3">
                <Icon size={20} className={`${statusColor} md:w-8 md:h-8`} />
                {metric.color === 'red' && (
                  <AlertTriangle size={16} className="text-red-600 md:w-5 md:h-5" />
                )}
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold leading-tight">
                {metric.label}
              </p>
              <p className="text-sm md:text-3xl font-black text-black mt-1 md:mt-2">
                {metric.value}{' '}
                <span className="text-[10px] md:text-2xl text-gray-500">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Water Quality */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6">
        <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-2 md:mb-4 flex items-center gap-1 md:gap-2">
          <Droplet size={16} className="text-blue-600 md:w-5 md:h-5" />
          Water Quality Parameters
        </h3>
        <div className="grid grid-cols-2 gap-2 md:gap-6">
          <div>
            <h4 className="text-[10px] md:text-base font-bold text-slate-700 mb-1 md:mb-3">
              Inlet Quality
            </h4>
            <div className="space-y-1 md:space-y-2">
              {(() => {
                const pH = inletQuality.pH || 7.0;
                const phColor =
                  pH >= 6.5 && pH <= 8.5
                    ? 'bg-green-50 border-green-200'
                    : pH >= 6.0 && pH <= 9.0
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const phTextColor =
                  pH >= 6.5 && pH <= 8.5
                    ? 'text-green-700'
                    : pH >= 6.0 && pH <= 9.0
                      ? 'text-yellow-700'
                      : 'text-red-700';
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${phColor}`}>
                    <span className="text-[9px] md:text-base text-gray-600">pH</span>
                    <span className={`text-[9px] md:text-lg font-bold ${phTextColor}`}>
                      {pH.toFixed(2)}
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const turbidity = inletQuality.turbidity || 0;
                const turbidityColor =
                  turbidity <= 5
                    ? 'bg-green-50 border-green-200'
                    : turbidity <= 10
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const turbidityTextColor =
                  turbidity <= 5
                    ? 'text-green-700'
                    : turbidity <= 10
                      ? 'text-yellow-700'
                      : 'text-red-700';
                return (
                  <div
                    className={`flex justify-between p-1 md:p-2 rounded border ${turbidityColor}`}
                  >
                    <span className="text-[9px] md:text-base text-gray-600">Turbidity</span>
                    <span className={`text-[9px] md:text-lg font-bold ${turbidityTextColor}`}>
                      {turbidity.toFixed(2)} NTU
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const tds = inletQuality.TDS || 0;
                const tdsColor =
                  tds <= 500
                    ? 'bg-green-50 border-green-200'
                    : tds <= 1000
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const tdsTextColor =
                  tds <= 500 ? 'text-green-700' : tds <= 1000 ? 'text-yellow-700' : 'text-red-700';
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${tdsColor}`}>
                    <span className="text-[9px] md:text-base text-gray-600">TDS</span>
                    <span className={`text-[9px] md:text-lg font-bold ${tdsTextColor}`}>
                      {tds.toFixed(0)} ppm
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const ecoli = inletQuality.ecoli || 0;
                const ecoliColor = ecoli === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                const ecoliTextColor = ecoli === 0 ? 'text-green-700' : 'text-red-700';
                const hasAlert = ecoli > 0;
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${ecoliColor} ${hasAlert ? 'animate-pulse' : ''}`}>
                    <span className="text-[9px] md:text-base text-gray-600 flex items-center gap-1">
                      E.coli
                      {hasAlert && <AlertTriangle size={12} className="text-red-600" />}
                    </span>
                    <span className={`text-[9px] md:text-lg font-bold ${ecoliTextColor}`}>
                      {ecoli.toFixed(0)} CFU/100ml
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const ammonia = inletQuality.ammonia || 0.1;
                const ammoniaColor =
                  ammonia <= 0.5
                    ? 'bg-green-50 border-green-200'
                    : ammonia <= 1.5
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const ammoniaTextColor =
                  ammonia <= 0.5 ? 'text-green-700' : ammonia <= 1.5 ? 'text-yellow-700' : 'text-red-700';
                const hasAlert = ammonia > 1.5;
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${ammoniaColor} ${hasAlert ? 'animate-pulse' : ''}`}>
                    <span className="text-[9px] md:text-base text-gray-600 flex items-center gap-1">
                      Ammonia
                      {hasAlert && <AlertTriangle size={12} className="text-red-600" />}
                    </span>
                    <span className={`text-[9px] md:text-lg font-bold ${ammoniaTextColor}`}>
                      {ammonia.toFixed(2)} mg/L
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] md:text-base font-bold text-slate-700 mb-1 md:mb-3">
              Outlet Quality
            </h4>
            <div className="space-y-1 md:space-y-2">
              {(() => {
                const pH = outletQuality.pH || 7.0;
                const phColor =
                  pH >= 6.5 && pH <= 8.5
                    ? 'bg-green-50 border-green-200'
                    : pH >= 6.0 && pH <= 9.0
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const phTextColor =
                  pH >= 6.5 && pH <= 8.5
                    ? 'text-green-700'
                    : pH >= 6.0 && pH <= 9.0
                      ? 'text-yellow-700'
                      : 'text-red-700';
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${phColor}`}>
                    <span className="text-[9px] md:text-base text-gray-600">pH</span>
                    <span className={`text-[9px] md:text-lg font-bold ${phTextColor}`}>
                      {pH.toFixed(2)}
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const turbidity = outletQuality.turbidity || 0;
                const turbidityColor =
                  turbidity <= 5
                    ? 'bg-green-50 border-green-200'
                    : turbidity <= 10
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const turbidityTextColor =
                  turbidity <= 5
                    ? 'text-green-700'
                    : turbidity <= 10
                      ? 'text-yellow-700'
                      : 'text-red-700';
                return (
                  <div
                    className={`flex justify-between p-1 md:p-2 rounded border ${turbidityColor}`}
                  >
                    <span className="text-[9px] md:text-base text-gray-600">Turbidity</span>
                    <span className={`text-[9px] md:text-lg font-bold ${turbidityTextColor}`}>
                      {turbidity.toFixed(2)} NTU
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const tds = outletQuality.TDS || 0;
                const tdsColor =
                  tds <= 500
                    ? 'bg-green-50 border-green-200'
                    : tds <= 1000
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const tdsTextColor =
                  tds <= 500 ? 'text-green-700' : tds <= 1000 ? 'text-yellow-700' : 'text-red-700';
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${tdsColor}`}>
                    <span className="text-[9px] md:text-base text-gray-600">TDS</span>
                    <span className={`text-[9px] md:text-lg font-bold ${tdsTextColor}`}>
                      {tds.toFixed(0)} ppm
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const ecoli = outletQuality.ecoli || 0;
                const ecoliColor = ecoli === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                const ecoliTextColor = ecoli === 0 ? 'text-green-700' : 'text-red-700';
                const hasAlert = ecoli > 0;
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${ecoliColor} ${hasAlert ? 'animate-pulse' : ''}`}>
                    <span className="text-[9px] md:text-base text-gray-600 flex items-center gap-1">
                      E.coli
                      {hasAlert && <AlertTriangle size={12} className="text-red-600" />}
                    </span>
                    <span className={`text-[9px] md:text-lg font-bold ${ecoliTextColor}`}>
                      {ecoli.toFixed(0)} CFU/100ml
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const ammonia = outletQuality.ammonia || 0.2;
                const ammoniaColor =
                  ammonia <= 0.5
                    ? 'bg-green-50 border-green-200'
                    : ammonia <= 1.5
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const ammoniaTextColor =
                  ammonia <= 0.5 ? 'text-green-700' : ammonia <= 1.5 ? 'text-yellow-700' : 'text-red-700';
                const hasAlert = ammonia > 1.5;
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${ammoniaColor} ${hasAlert ? 'animate-pulse' : ''}`}>
                    <span className="text-[9px] md:text-base text-gray-600 flex items-center gap-1">
                      Ammonia
                      {hasAlert && <AlertTriangle size={12} className="text-red-600" />}
                    </span>
                    <span className={`text-[9px] md:text-lg font-bold ${ammoniaTextColor}`}>
                      {ammonia.toFixed(2)} mg/L
                    </span>
                  </div>
                );
              })()}
              {(() => {
                const residualChlorine = outletQuality.residualChlorine || 0.3;
                const rcColor =
                  residualChlorine >= 0.2 && residualChlorine <= 2.0
                    ? 'bg-green-50 border-green-200'
                    : residualChlorine >= 0.1 && residualChlorine < 0.2
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200';
                const rcTextColor =
                  residualChlorine >= 0.2 && residualChlorine <= 2.0
                    ? 'text-green-700'
                    : residualChlorine >= 0.1 && residualChlorine < 0.2
                      ? 'text-yellow-700'
                      : 'text-red-700';
                const hasAlert = residualChlorine < 0.1 || residualChlorine > 2.0;
                return (
                  <div className={`flex justify-between p-1 md:p-2 rounded border ${rcColor} ${hasAlert ? 'animate-pulse' : ''}`}>
                    <span className="text-[9px] md:text-base text-gray-600 flex items-center gap-1">
                      RC (Chlorine)
                      {hasAlert && <AlertTriangle size={12} className="text-red-600" />}
                    </span>
                    <span className={`text-[9px] md:text-lg font-bold ${rcTextColor}`}>
                      {residualChlorine.toFixed(2)} mg/L
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Information - Mobile/Tablet Only */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 lg:hidden">
        <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-2 md:mb-4 flex items-center gap-1 md:gap-2">
          <Radio size={16} className="text-blue-600 md:w-5 md:h-5" />
          Sensor Information
        </h3>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="p-2 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-[10px] md:text-base font-bold text-blue-800 mb-1 md:mb-2">
              Inlet Sensors
            </p>
            <div className="space-y-0.5 md:space-y-1 text-[9px] md:text-sm">
              <p>Flow Sensor: {inletFlow.toFixed(1)} L/min</p>
              <p>Pressure Sensor: {inletPressure.toFixed(2)} Bar</p>
              <p>Battery: 85%</p>
            </div>
          </div>
          <div className="p-2 md:p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-[10px] md:text-base font-bold text-green-800 mb-1 md:mb-2">
              Outlet Sensors
            </p>
            <div className="space-y-0.5 md:space-y-1 text-[9px] md:text-sm">
              <p>Flow Sensor: {outletFlow.toFixed(1)} L/min</p>
              <p>Pressure Sensor: {outletPressure.toFixed(2)} Bar</p>
              <p>Battery: 82%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Technical Specifications - Mobile/Tablet Only */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-blue-100 lg:hidden">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
          <Activity className="text-blue-600" size={18} />
          Technical Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Diameter */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-blue-600 font-semibold mb-1">Diameter</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.diameter || '150'}<span className="text-xs ml-1">mm</span></p>
          </div>

          {/* Flow Rate */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-purple-600 font-semibold mb-1">Flow Rate</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.maxFlowRate || '100'}<span className="text-xs ml-1">L/min</span></p>
          </div>

          {/* Pressure (KFC) */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-pink-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-pink-600 font-semibold mb-1">Pressure (KFC)</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.pressureRating || '10'}<span className="text-xs ml-1">Bar</span></p>
          </div>

          {/* Material */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-cyan-600 font-semibold mb-1">Material</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.material || 'PVC'}</p>
          </div>

          {/* KSC */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-indigo-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-indigo-600 font-semibold mb-1">KSC Rating</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.kscRating || 'Class 4'}</p>
          </div>

          {/* Load Capacity */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-orange-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-orange-600 font-semibold mb-1">Load Capacity</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.loadCapacity || '2500'}<span className="text-xs ml-1">kg</span></p>
          </div>

          {/* Length */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-emerald-600 font-semibold mb-1">Length</p>
            <p className="text-lg font-bold text-slate-800">{(pipeline.length || 450).toFixed(0)}<span className="text-xs ml-1">m</span></p>
          </div>

          {/* Depth */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-teal-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-teal-600 font-semibold mb-1">Depth</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.depth || '1.2'}<span className="text-xs ml-1">m</span></p>
          </div>

          {/* Wall Thickness */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-violet-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-violet-600 font-semibold mb-1">Wall Thickness</p>
            <p className="text-lg font-bold text-slate-800">{pipeline.wallThickness || '4.5'}<span className="text-xs ml-1">mm</span></p>
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
            Pipeline Details
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Technical Specifications */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-blue-700 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Technical Specifications
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-sm text-gray-600">Diameter</span>
                <span className="text-sm font-bold text-black">{pipeline.diameter || '150'} mm</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-purple-100">
                <span className="text-sm text-gray-600">Flow Rate</span>
                <span className="text-sm font-bold text-black">{pipeline.maxFlowRate || '100'} L/min</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-pink-100">
                <span className="text-sm text-gray-600">Pressure (KFC)</span>
                <span className="text-sm font-bold text-black">{pipeline.pressureRating || '10'} Bar</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-cyan-100">
                <span className="text-sm text-gray-600">Material</span>
                <span className="text-sm font-bold text-black">{pipeline.material || 'PVC'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-indigo-100">
                <span className="text-sm text-gray-600">KSC Rating</span>
                <span className="text-sm font-bold text-black">{pipeline.kscRating || 'Class 4'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-orange-100">
                <span className="text-sm text-gray-600">Load Capacity</span>
                <span className="text-sm font-bold text-black">{pipeline.loadCapacity || '2500'} kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-emerald-100">
                <span className="text-sm text-gray-600">Length</span>
                <span className="text-sm font-bold text-black">{(pipeline.length || 450).toFixed(0)} m</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-teal-100">
                <span className="text-sm text-gray-600">Depth</span>
                <span className="text-sm font-bold text-black">{pipeline.depth || '1.2'} m</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-violet-100">
                <span className="text-sm text-gray-600">Wall Thickness</span>
                <span className="text-sm font-bold text-black">{pipeline.wallThickness || '4.5'} mm</span>
              </div>
            </div>
          </div>

          {/* Sensor Information */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border-2 border-emerald-200 shadow-md">
            <h4 className="text-sm uppercase tracking-widest text-emerald-700 font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Sensor Information
            </h4>
            <div className="space-y-3">
              <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-bold text-blue-700 mb-2">Inlet Sensors</p>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Flow Sensor:</span>
                    <span className="font-semibold">{inletFlow.toFixed(1)} L/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure Sensor:</span>
                    <span className="font-semibold">{inletPressure.toFixed(2)} Bar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className="font-semibold">85%</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50/50 rounded-lg p-3 border border-green-200">
                <p className="text-xs font-bold text-green-700 mb-2">Outlet Sensors</p>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Flow Sensor:</span>
                    <span className="font-semibold">{outletFlow.toFixed(1)} L/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure Sensor:</span>
                    <span className="font-semibold">{outletPressure.toFixed(2)} Bar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className="font-semibold">82%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
