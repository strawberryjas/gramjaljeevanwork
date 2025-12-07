import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import {
  Activity,
  Gauge,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Radio,
  TrendingUp,
  CheckCircle,
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

export const PipelinesOverview = ({ onBack, onNavigateToPipeline }) => {
  const { state, toggleValve, isLive } = useSimulationData();
  const pipelines = state?.pipelines || [];

  const totalFlow = pipelines.reduce((sum, p) => sum + (p.outlet?.flowSensor?.value || 0), 0);
  const openPipelines = pipelines.filter((p) => p.valveStatus === 'OPEN').length;
  const pipelinesWithLeaks = pipelines.filter((p) => p.leakageProbability > 30).length;
  const avgPressure =
    pipelines.length > 0
      ? pipelines.reduce((sum, p) => sum + (p.inlet?.pressureSensor?.value || 0), 0) /
        pipelines.length
      : 0;

  const overviewStats = [
    {
      label: 'Total Flow',
      value: totalFlow.toFixed(1),
      unit: 'L/min',
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'Open Pipelines',
      value: `${openPipelines} / ${pipelines.length}`,
      unit: '',
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Avg Pressure',
      value: avgPressure.toFixed(2),
      unit: 'Bar',
      icon: Gauge,
      color: 'emerald',
    },
    {
      label: 'Leakage Alerts',
      value: pipelinesWithLeaks,
      unit: '',
      icon: AlertTriangle,
      color: pipelinesWithLeaks > 0 ? 'red' : 'green',
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
              All Pipelines & Valves
            </h2>
            <p className="text-sm text-slate-500">
              Complete pipeline network monitoring and control
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

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {overviewStats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClass =
            stat.color === 'blue'
              ? 'text-blue-600'
              : stat.color === 'green'
                ? 'text-green-600'
                : stat.color === 'red'
                  ? 'text-red-600'
                  : 'text-emerald-600';

          return (
            <div
              key={idx}
              className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-4 border-slate-300"
            >
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <Icon size={16} className={`${colorClass} md:w-8 md:h-8`} />
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold">{stat.label}</p>
              <p className="text-xs md:text-3xl font-black text-black mt-1 md:mt-2">
                {stat.value}{' '}
                <span className="text-[10px] md:text-2xl text-gray-500">{stat.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* All Pipelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {pipelines.map((pipeline) => {
          const isOpen = pipeline.valveStatus === 'OPEN';
          const hasLeakage = pipeline.leakageProbability > 30;
          const inletFlow = pipeline.inlet?.flowSensor?.value || 0;
          const outletFlow = pipeline.outlet?.flowSensor?.value || 0;
          const inletPressure = pipeline.inlet?.pressureSensor?.value || 0;
          const outletPressure = pipeline.outlet?.pressureSensor?.value || 0;
          const flowLoss = inletFlow - outletFlow;

          return (
            <div
              key={pipeline.pipelineId}
              className={`bg-white rounded-lg md:rounded-xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl ${
                hasLeakage
                  ? 'border-red-400 bg-red-50'
                  : isOpen
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-300 bg-slate-50'
              }`}
            >
              {/* Pipeline Header */}
              <div
                className={`p-2 md:p-4 ${
                  hasLeakage
                    ? 'bg-red-600 text-white'
                    : isOpen
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-600 text-white'
                }`}
              >
                {/* Pipeline Image */}
                <div className="mb-2 md:mb-3 flex justify-center bg-white/10 rounded-lg p-2">
                  <svg width="100%" height="60" viewBox="0 0 300 60" className="max-w-full">
                    <defs>
                      <linearGradient
                        id={`pipeGrad-${pipeline.pipelineId}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                      <filter id={`pipeShadow-${pipeline.pipelineId}`}>
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Main Pipe Body */}
                    <rect
                      x="10"
                      y="15"
                      width="280"
                      height="30"
                      fill={`url(#pipeGrad-${pipeline.pipelineId})`}
                      rx="15"
                      filter={`url(#pipeShadow-${pipeline.pipelineId})`}
                    />

                    {/* Pipe Highlights */}
                    <rect
                      x="10"
                      y="17"
                      width="280"
                      height="8"
                      fill="rgba(255,255,255,0.2)"
                      rx="4"
                    />

                    {/* Connection Flanges */}
                    <rect x="5" y="12" width="12" height="36" fill="#334155" rx="2" />
                    <rect x="283" y="12" width="12" height="36" fill="#334155" rx="2" />
                    <circle cx="11" cy="20" r="1.5" fill="#64748b" />
                    <circle cx="11" cy="40" r="1.5" fill="#64748b" />
                    <circle cx="289" cy="20" r="1.5" fill="#64748b" />
                    <circle cx="289" cy="40" r="1.5" fill="#64748b" />

                    {/* Water Flow Animation (only when open) */}
                    {isOpen && (
                      <>
                        <circle cx="50" cy="30" r="3" fill="#3b82f6" opacity="0.7">
                          <animate
                            attributeName="cx"
                            from="20"
                            to="280"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="100" cy="30" r="3" fill="#60a5fa" opacity="0.7">
                          <animate
                            attributeName="cx"
                            from="20"
                            to="280"
                            dur="2s"
                            begin="0.3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="150" cy="30" r="3" fill="#93c5fd" opacity="0.7">
                          <animate
                            attributeName="cx"
                            from="20"
                            to="280"
                            dur="2s"
                            begin="0.6s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}

                    {/* Valve in Center */}
                    <rect x="140" y="10" width="20" height="40" fill="#1e293b" rx="2" />
                    <circle
                      cx="150"
                      cy="30"
                      r="10"
                      fill={isOpen ? '#22c55e' : '#ef4444'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <path
                      d="M150 24 L150 36 M144 30 L156 30"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm md:text-2xl font-black flex items-center gap-1 md:gap-2">
                      <Activity size={16} className="md:w-7 md:h-7" />
                      Pipeline {pipeline.pipelineId}
                    </h3>
                    <p className="text-[10px] md:text-base opacity-90">
                      {pipeline.pipelineName || `Distribution Pipeline ${pipeline.pipelineId}`}
                    </p>
                  </div>
                  {hasLeakage && (
                    <AlertTriangle size={16} className="animate-pulse md:w-6 md:h-6" />
                  )}
                </div>
              </div>

              {/* Pipeline Content */}
              <div className="p-2 md:p-4 space-y-2 md:space-y-4">
                {/* Valve Control Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => !isOpen && toggleValve(pipeline.pipelineId)}
                    className={`px-2 py-2 md:px-3 md:py-3 rounded-lg font-bold text-[10px] md:text-base transition-all shadow-lg ${
                      isOpen
                        ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white shadow-green-500/30'
                        : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30'
                    }`}
                  >
                    <span className="flex flex-col items-center gap-1">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>OPEN</span>
                    </span>
                  </button>

                  <button
                    onClick={() => isOpen && toggleValve(pipeline.pipelineId)}
                    className={`px-2 py-2 md:px-3 md:py-3 rounded-lg font-bold text-[10px] md:text-base transition-all shadow-lg ${
                      !isOpen
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-red-500/30'
                        : 'bg-gray-300 text-gray-600 hover:bg-gray-400 shadow-gray-300/30'
                    }`}
                  >
                    <span className="flex flex-col items-center gap-1">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>CLOSE</span>
                    </span>
                  </button>
                </div>

                {/* Sensors Info */}
                <div className="flex items-center justify-between p-1.5 md:p-2 bg-slate-50 rounded text-[9px] md:text-xs">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Radio size={12} className="text-blue-600 md:w-3.5 md:h-3.5" />
                    <span className="text-slate-600">Flow: Active</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Gauge size={12} className="text-emerald-600 md:w-3.5 md:h-3.5" />
                    <span className="text-slate-600">Pressure: Active</span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() =>
                    onNavigateToPipeline &&
                    onNavigateToPipeline(`pipeline-details-${pipeline.pipelineId}`)
                  }
                  className="w-full py-1.5 md:py-2 bg-blue-600 text-white rounded-lg font-bold text-[10px] md:text-sm hover:bg-blue-700 transition-all shadow-lg"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6">
        <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-2 md:mb-4 text-center">
          Quick Actions
        </h3>
        <div className="flex flex-nowrap justify-center gap-1 md:gap-3">
          <button
            onClick={() => {
              pipelines.forEach((p) => {
                if (p.valveStatus === 'CLOSED') {
                  toggleValve(p.pipelineId);
                }
              });
            }}
            className="flex-1 px-1.5 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg font-bold text-[9px] md:text-sm hover:bg-green-700 transition-all"
          >
            🔓 Open All
          </button>
          <button
            onClick={() => {
              pipelines.forEach((p) => {
                if (p.valveStatus === 'OPEN') {
                  toggleValve(p.pipelineId);
                }
              });
            }}
            className="flex-1 px-1.5 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg font-bold text-[9px] md:text-sm hover:bg-red-700 transition-all"
          >
            🔒 Close All
          </button>
          <button
            onClick={() => {
              pipelines
                .filter((p) => p.leakageProbability > 30)
                .forEach((p) => {
                  toggleValve(p.pipelineId);
                });
            }}
            className="flex-1 px-1.5 py-1.5 md:px-4 md:py-2 bg-amber-600 text-white rounded-lg font-bold text-[9px] md:text-sm hover:bg-amber-700 transition-all"
          >
            ⚠ Isolate
          </button>
        </div>
      </div>
    </div>
  );
};
