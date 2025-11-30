import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Activity, Gauge, AlertTriangle, ArrowLeft, Settings, Radio, Droplet, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PipelineDetails = ({ pipelineId, onBack }) => {
  const { state, toggleValve, isLive } = useSimulationData();
  const pipelines = state?.pipelines || [];
  const pipeline = pipelines.find(p => p.pipelineId === pipelineId) || pipelines[0];

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
  const hasLeakage = pipeline.leakageProbability > 30;
  const inletFlow = pipeline.inlet?.flowSensor?.value || 0;
  const outletFlow = pipeline.outlet?.flowSensor?.value || 0;
  const inletPressure = pipeline.inlet?.pressureSensor?.value || 0;
  const outletPressure = pipeline.outlet?.pressureSensor?.value || 0;
  const flowLoss = inletFlow - outletFlow;
  const inletQuality = pipeline.inlet?.qualitySensor || {};
  const outletQuality = pipeline.outlet?.qualitySensor || {};

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
      unit: ''
    },
    {
      label: 'Inlet Flow',
      value: inletFlow.toFixed(1),
      icon: Activity,
      color: 'blue',
      unit: 'L/min'
    },
    {
      label: 'Outlet Flow',
      value: outletFlow.toFixed(1),
      icon: Activity,
      color: 'blue',
      unit: 'L/min'
    },
    {
      label: 'Inlet Pressure',
      value: inletPressure.toFixed(2),
      icon: Gauge,
      color: 'emerald',
      unit: 'Bar'
    },
    {
      label: 'Outlet Pressure',
      value: outletPressure.toFixed(2),
      icon: Gauge,
      color: 'emerald',
      unit: 'Bar'
    },
    {
      label: 'Flow Loss',
      value: flowLoss.toFixed(1),
      icon: TrendingUp,
      color: flowLoss > 5 ? 'red' : 'green',
      unit: 'L/min'
    },
    {
      label: 'Leakage Probability',
      value: (pipeline.leakageProbability || 0).toFixed(1),
      icon: AlertTriangle,
      color: hasLeakage ? 'red' : 'green',
      unit: '%'
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
              Pipeline {pipelineId} Details
            </h2>
            <p className="text-sm text-slate-500">{pipeline.pipelineName || `Distribution Pipeline ${pipelineId}`}</p>
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
      <div className={`bg-gradient-to-r rounded-xl p-6 text-white ${
        isOpen ? 'from-green-900 to-green-800' : 'from-red-900 to-red-800'
      }`}>
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
            onClick={() => toggleValve(pipelineId)}
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

      {/* Alert Banner */}
      {hasLeakage && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-600" />
          <div>
            <p className="font-bold text-red-800">Leakage Alert Detected</p>
            <p className="text-sm text-red-700">
              Flow loss of {flowLoss.toFixed(1)} L/min detected. Leakage probability: {pipeline.leakageProbability}%
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = metric.color === 'green' ? 'text-green-600' :
                            metric.color === 'red' ? 'text-red-600' :
                            metric.color === 'blue' ? 'text-blue-600' :
                            'text-emerald-600';
          
          return (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-slate-300">
              <div className="flex items-center justify-between mb-3">
                <Icon size={32} className={statusColor} />
                {metric.color === 'red' && (
                  <AlertTriangle size={20} className="text-red-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-semibold">{metric.label}</p>
              <p className="text-3xl font-black text-black mt-2">
                {metric.value} <span className="text-lg text-gray-500">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flow Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Flow Rate (Inlet vs Outlet)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorInletFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutletFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="inletFlow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInletFlow)" name="Inlet Flow (L/min)" />
              <Area type="monotone" dataKey="outletFlow" stroke="#10b981" fillOpacity={1} fill="url(#colorOutletFlow)" name="Outlet Flow (L/min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pressure Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-emerald-600" />
            Pressure (Inlet vs Outlet)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="inletPressure" stroke="#3b82f6" strokeWidth={2} name="Inlet Pressure (Bar)" />
              <Line type="monotone" dataKey="outletPressure" stroke="#10b981" strokeWidth={2} name="Outlet Pressure (Bar)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Water Quality */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Droplet size={20} className="text-blue-600" />
          Water Quality Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-slate-700 mb-3">Inlet Quality</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">pH</span>
                <span className="text-sm font-bold">{(inletQuality.pH || 7.0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">Turbidity</span>
                <span className="text-sm font-bold">{(inletQuality.turbidity || 0).toFixed(2)} NTU</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">Chlorine</span>
                <span className="text-sm font-bold">{(inletQuality.chlorine || 0).toFixed(2)} mg/L</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">TDS</span>
                <span className="text-sm font-bold">{(inletQuality.TDS || 0).toFixed(0)} ppm</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3">Outlet Quality</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">pH</span>
                <span className="text-sm font-bold">{(outletQuality.pH || 7.0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">Turbidity</span>
                <span className="text-sm font-bold">{(outletQuality.turbidity || 0).toFixed(2)} NTU</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">Chlorine</span>
                <span className="text-sm font-bold">{(outletQuality.chlorine || 0).toFixed(2)} mg/L</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-gray-600">TDS</span>
                <span className="text-sm font-bold">{(outletQuality.TDS || 0).toFixed(0)} ppm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Radio size={20} className="text-blue-600" />
          Sensor Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-bold text-blue-800 mb-2">Inlet Sensors</p>
            <div className="space-y-1 text-sm">
              <p>Flow Sensor: {inletFlow.toFixed(1)} L/min</p>
              <p>Pressure Sensor: {inletPressure.toFixed(2)} Bar</p>
              <p>Battery: 85%</p>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="font-bold text-green-800 mb-2">Outlet Sensors</p>
            <div className="space-y-1 text-sm">
              <p>Flow Sensor: {outletFlow.toFixed(1)} L/min</p>
              <p>Pressure Sensor: {outletPressure.toFixed(2)} Bar</p>
              <p>Battery: 82%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



