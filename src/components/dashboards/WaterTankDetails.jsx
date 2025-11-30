import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Droplet, Gauge, Thermometer, ArrowLeft, Settings, FlaskConical, Activity, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
      color: tank.temperature > 30 ? 'red' : 'blue',
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

      {/* Tank Visual with Controls */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Tank Visual */}
            <div className="relative">
              <div className={`relative w-32 h-48 rounded-lg border-4 ${tank.isFilling ? 'border-green-400' : 'border-blue-400'} bg-slate-200 overflow-hidden shadow-2xl`}>
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
                    tank.isFilling ? 'bg-gradient-to-t from-blue-600 to-cyan-400' : 'bg-gradient-to-t from-blue-500 to-blue-400'
                  }`}
                  style={{ height: `${Math.min(100, Math.max(0, tank.tankLevel || 0))}%` }}
                >
                  {tank.isFilling && (
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 h-3 bg-cyan-300/50 animate-wave"></div>
                      <div className="absolute top-2 left-0 right-0 h-2 bg-cyan-200/30 animate-wave-delayed"></div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black text-2xl drop-shadow-lg pointer-events-none">
                  <span>{(tank.tankLevel || 0).toFixed(0)}%</span>
                  <span className="text-xs font-semibold">{(tank.currentVolume || 0).toLocaleString()} L</span>
                </div>
                {/* Tank Top Cap */}
                <div className="absolute -top-2 left-0 right-0 h-6 bg-slate-500 rounded-t-lg border-2 border-slate-700"></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-blue-200 mb-1">Current Status</p>
              <p className="text-3xl font-black mb-2">
                {tank.isFilling ? 'FILLING' : tank.tankLevel > 80 ? 'FULL' : tank.tankLevel > 30 ? 'NORMAL' : 'LOW'}
              </p>
              <p className="text-xs text-blue-300">
                Capacity: {(tank.tankCapacity || 10000).toLocaleString()} L | 
                Available: {((tank.tankCapacity || 10000) - (tank.currentVolume || 0)).toLocaleString()} L
              </p>
            </div>
          </div>
          
          {/* Valve Controls */}
          <div className="flex flex-col gap-3">
            <button
              onClick={toggleTankInlet}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
                tank.inletValveStatus === 'OPEN' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Inlet Valve: {tank.inletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}
            </button>
            <button
              onClick={toggleTankOutlet}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
                tank.outletValveStatus === 'OPEN' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Outlet Valve: {tank.outletValveStatus === 'OPEN' ? 'CLOSE' : 'OPEN'}
            </button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tankMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = metric.color === 'green' ? 'text-green-600' :
                            metric.color === 'red' ? 'text-red-600' :
                            metric.color === 'amber' ? 'text-amber-600' :
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
        {/* Tank Level & Volume Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Tank Level & Volume Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="level" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLevel)" name="Level (%)" />
              <Area yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" fillOpacity={1} fill="url(#colorVolume)" name="Volume (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature & pH Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Thermometer size={20} className="text-red-600" />
            Temperature & pH
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="pH" stroke="#8b5cf6" strokeWidth={2} name="pH" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Water Quality Parameters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FlaskConical size={20} className="text-blue-600" />
          Water Quality Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {qualityData.map((param, idx) => {
            const isGood = param.status === 'Good' || param.status === 'Excellent';
            const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;
            
            return (
              <div key={idx} className={`border-2 rounded-lg p-4 ${
                isGood ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-black">{param.parameter}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    param.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                    param.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {param.status}
                  </span>
                </div>
                <p className="text-3xl font-bold text-black mb-2">
                  {param.value} <span className="text-lg text-gray-500">{param.unit || ''}</span>
                </p>
                <div className="text-xs text-gray-600 mb-2">
                  Range: {param.min} - {param.max}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full ${
                      isGood ? 'bg-green-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  ></div>
                </div>
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
                  ? 'All parameters are within safe limits as per BIS standards.'
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



