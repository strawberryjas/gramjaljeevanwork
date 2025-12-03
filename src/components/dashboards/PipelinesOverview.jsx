import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Activity, Gauge, AlertTriangle, ArrowLeft, Settings, Radio, TrendingUp, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PipelinesOverview = ({ onBack, onNavigateToPipeline }) => {
  const { state, toggleValve, isLive } = useSimulationData();
  const pipelines = state?.pipelines || [];

  const totalFlow = pipelines.reduce((sum, p) => sum + (p.outlet?.flowSensor?.value || 0), 0);
  const openPipelines = pipelines.filter(p => p.valveStatus === 'OPEN').length;
  const pipelinesWithLeaks = pipelines.filter(p => p.leakageProbability > 30).length;
  const avgPressure = pipelines.length > 0 
    ? pipelines.reduce((sum, p) => sum + (p.inlet?.pressureSensor?.value || 0), 0) / pipelines.length 
    : 0;

  const overviewStats = [
    {
      label: 'Total Flow',
      value: totalFlow.toFixed(1),
      unit: 'L/min',
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Open Pipelines',
      value: `${openPipelines} / ${pipelines.length}`,
      unit: '',
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Avg Pressure',
      value: avgPressure.toFixed(2),
      unit: 'Bar',
      icon: Gauge,
      color: 'emerald'
    },
    {
      label: 'Leakage Alerts',
      value: pipelinesWithLeaks,
      unit: '',
      icon: AlertTriangle,
      color: pipelinesWithLeaks > 0 ? 'red' : 'green'
    }
  ];

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
              <Activity className="text-blue-600" size={28} />
              All Pipelines & Valves
            </h2>
            <p className="text-sm text-slate-500">Complete pipeline network monitoring and control</p>
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
          const colorClass = stat.color === 'blue' ? 'text-blue-600' :
                           stat.color === 'green' ? 'text-green-600' :
                           stat.color === 'red' ? 'text-red-600' :
                           'text-emerald-600';
          
          return (
            <div key={idx} className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-6 border-l-4 border-slate-300">
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <Icon size={16} className={`${colorClass} md:w-8 md:h-8`} />
              </div>
              <p className="text-[10px] md:text-lg text-gray-600 font-semibold">{stat.label}</p>
              <p className="text-xs md:text-3xl font-black text-black mt-1 md:mt-2">
                {stat.value} <span className="text-[10px] md:text-2xl text-gray-500">{stat.unit}</span>
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
              <div className={`p-2 md:p-4 ${
                hasLeakage
                  ? 'bg-red-600 text-white'
                  : isOpen
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-white'
              }`}>
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
                {/* Valve Control Section */}
                <div className="bg-slate-100 rounded-lg p-1.5 md:p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div 
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          isOpen 
                            ? 'bg-green-500 border-green-700 animate-pulse-subtle' 
                            : 'bg-red-600 border-red-800'
                        }`}
                      >
                        <Settings size={14} className="text-white md:w-5 md:h-5" />
                      </div>
                      <div>
                        <p className="text-[8px] md:text-sm font-semibold text-slate-700">Valve Status</p>
                        <p className={`text-[10px] md:text-lg font-black ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
                          {pipeline.valveStatus || 'CLOSED'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleValve(pipeline.pipelineId)}
                      className={`px-2 py-1 md:px-3 md:py-1.5 rounded font-bold text-[8px] md:text-sm transition-all shadow whitespace-nowrap ${
                        isOpen 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isOpen ? '🔒 Close' : '🔓 Open'}
                    </button>
                  </div>
                </div>

                {/* Flow Loss & Leakage */}
                <div className={`p-1.5 md:p-3 rounded-lg border-2 ${
                  hasLeakage ? 'bg-red-100 border-red-400' : 'bg-slate-100 border-slate-300'
                }`}>
                  <div className="flex items-center justify-between gap-2 md:gap-3">
                    <div>
                      <p className="text-[8px] md:text-sm font-semibold text-slate-700">Flow Loss</p>
                      <p className={`text-[10px] md:text-xl font-black ${flowLoss > 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {flowLoss.toFixed(1)} <span className="text-[6px] md:text-sm">L/min</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] md:text-sm font-semibold text-slate-700">Leakage</p>
                      <p className={`text-[10px] md:text-xl font-black ${hasLeakage ? 'text-red-600' : 'text-green-600'}`}>
                        {pipeline.leakageProbability || 0}<span className="text-[6px] md:text-sm">%</span>
                      </p>
                    </div>
                  </div>
                  {hasLeakage && (
                    <div className="mt-1 md:mt-1.5 p-0.5 md:p-1 bg-red-200 rounded text-[7px] md:text-[9px] font-bold text-red-800 text-center">
                      ⚠ ALERT
                    </div>
                  )}
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
                  onClick={() => onNavigateToPipeline && onNavigateToPipeline(`pipeline-details-${pipeline.pipelineId}`)}
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
        <h3 className="text-sm md:text-lg font-bold text-slate-800 mb-2 md:mb-4 text-center">Quick Actions</h3>
        <div className="flex flex-nowrap justify-center gap-1 md:gap-3">
          <button
            onClick={() => {
              pipelines.forEach(p => {
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
              pipelines.forEach(p => {
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
              pipelines.filter(p => p.leakageProbability > 30).forEach(p => {
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



