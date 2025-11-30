import React, { useState } from 'react';
import { 
  Activity, TrendingUp, BarChart3, PieChart as PieChartIcon,
  Download, Calendar, Database, FileText, Filter,
  Microscope, FlaskConical, Beaker, LineChart as LineChartIcon,
  Layout
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { SystemContainer } from './SystemContainer';

// Researcher Dashboard - Analytics and data export focus
export const ResearcherDashboard = ({ sensors = {}, systemState, history = [] }) => {
  const [viewMode, setViewMode] = useState('analytics'); // 'analytics' | 'network'
  const [dateRange, setDateRange] = useState('7days');
  const [selectedDataset, setSelectedDataset] = useState('all');
  const pump = systemState?.pumpHouse || {};
  const metrics = systemState?.systemMetrics || {};
  const pipelines = systemState?.pipelines || [];
  const tankQuality = systemState?.overheadTank?.waterQuality || {};
  const realtimeHistory = (systemState?.realtimeHistory && systemState.realtimeHistory.length > 0
    ? systemState.realtimeHistory
    : history) || [];
  const openPipelines = pipelines.filter(p => p.valveStatus === 'OPEN').length;
  const leakWatch = pipelines.filter(p => p.leakageProbability > 40).length;
  const qualityAlerts = pipelines.filter(p => p.qualityDeviation > 10).length;

  const analyticsStats = [
    { label: 'Data Points', value: (realtimeHistory.length || 0).toLocaleString(), icon: Database, color: 'blue', trend: `${pipelines.length} feeds` },
    { label: 'Avg Flow Rate', value: `${(metrics.totalFlowRate || pump.pumpFlowOutput || 0).toFixed(1)} L/min`, icon: Activity, color: 'emerald', trend: `${openPipelines} open` },
    { label: 'Efficiency', value: `${(metrics.systemEfficiency || pump.pumpEfficiency || 0).toFixed(1)}%`, icon: TrendingUp, color: 'green', trend: `${metrics.totalLeakage || 0} L loss` },
    { label: 'Pipelines Flagged', value: `${qualityAlerts}`, icon: FileText, color: 'purple', trend: `${leakWatch} leak watch` }
  ];

  const trendDataSource = realtimeHistory.slice(0, 30).map(entry => ({
    day: entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `T-${entry.pumpStatus || ''}`,
    flow: entry.flowRate ?? entry.pumpFlowRate ?? 0,
    pressure: entry.pressure ?? entry.pipePressure ?? pump.pumpPressureOutput ?? 0,
    quality: entry.turbidity ? Math.max(0, 100 - entry.turbidity * 10) : Math.max(0, 100 - (metrics.averageQualityDeviation || 0))
  })).reverse();

  const mockTrendData = trendDataSource.length > 0 ? trendDataSource : Array.from({ length: 12 }, (_, i) => ({
    day: `T-${12 - i}`,
    flow: 80 + Math.random() * 20,
    pressure: 2.5 + Math.random(),
    quality: 85 + Math.random() * 5
  }));

  const distributionData = [
    { name: 'Operational', value: Math.max(openPipelines - leakWatch, 0), color: '#10b981' },
    { name: 'Leak Watch', value: leakWatch, color: '#f59e0b' },
    { name: 'Offline', value: pipelines.length - openPipelines, color: '#ef4444' }
  ].filter(segment => segment.value > 0);

  if (!distributionData.length) {
    distributionData.push({ name: 'Operational', value: 1, color: '#10b981' });
  }

  const currentPH = tankQuality.pH ?? sensors.qualityPH ?? 7;
  const currentTurbidity = tankQuality.turbidity ?? sensors.qualityTurbidity ?? 0;
  const currentChlorine = tankQuality.chlorine ?? sensors.qualityChlorine ?? 0;
  const currentTDS = tankQuality.TDS ?? sensors.qualityTDS ?? 0;

  const waterQualityData = [
    { parameter: 'pH', value: currentPH.toFixed(2), min: 6.5, max: 8.5, status: currentPH >= 6.5 && currentPH <= 8.5 ? 'Good' : 'Out of Range' },
    { parameter: 'Turbidity', value: currentTurbidity.toFixed(2), min: 0, max: 5, status: currentTurbidity <= 5 ? 'Excellent' : 'High' },
    { parameter: 'Chlorine', value: currentChlorine.toFixed(2), min: 0.2, max: 1.0, status: currentChlorine >= 0.2 && currentChlorine <= 1 ? 'Good' : 'Adjust' },
    { parameter: 'TDS', value: currentTDS.toFixed(0), min: 0, max: 500, status: currentTDS <= 500 ? 'Good' : 'High' }
  ];

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-4">
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            viewMode === 'analytics' 
              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 size={16} /> Analytics
        </button>
        <button
          onClick={() => setViewMode('network')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            viewMode === 'network' 
              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Activity size={16} /> Junja Network
        </button>
      </div>

      {viewMode === 'network' ? (
        <SystemContainer />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Microscope size={28} className="text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-black">Research Dashboard</h1>
                  <p className="text-sm text-gray-600">Data Analytics & Research Tools</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm font-semibold"
                >
                  <option value="24hours">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsStats.map((stat, idx) => (
              <div key={idx} className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${stat.color}-600`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={24} className={`text-${stat.color}-600`} />
                  <span className="text-xs font-bold text-green-600">{stat.trend}</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                <p className="text-2xl font-bold text-black mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Analysis */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Multi-Parameter Trend Analysis
                </h2>
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1">
                  <Download size={16} />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="flow" stroke="#3b82f6" name="Flow Rate" />
                  <Line type="monotone" dataKey="pressure" stroke="#10b981" name="Pressure" />
                  <Line type="monotone" dataKey="quality" stroke="#8b5cf6" name="Quality Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* System Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <PieChartIcon size={20} className="text-purple-600" />
                System Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Quality Parameters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <FlaskConical size={20} className="text-blue-600" />
              Water Quality Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {waterQualityData.map((param, idx) => (
                <div key={idx} className="border rounded-lg p-4">
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
                  <p className="text-3xl font-bold text-black mb-2">{param.value}</p>
                  <div className="text-xs text-gray-600">
                    Range: {param.min} - {param.max}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-green-600"
                      style={{ width: `${((param.value - param.min) / (param.max - param.min)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <Download size={20} className="text-blue-600" />
              Export Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => handleExport('csv')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg p-4 flex flex-col items-center gap-2 transition-all"
              >
                <FileText size={32} />
                <span className="font-bold">Export CSV</span>
                <span className="text-xs text-gray-600">Spreadsheet format</span>
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-lg p-4 flex flex-col items-center gap-2 transition-all"
              >
                <FileText size={32} />
                <span className="font-bold">Export PDF</span>
                <span className="text-xs text-gray-600">Report format</span>
              </button>
              <button 
                onClick={() => handleExport('json')}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-lg p-4 flex flex-col items-center gap-2 transition-all"
              >
                <Database size={32} />
                <span className="font-bold">Export JSON</span>
                <span className="text-xs text-gray-600">Raw data</span>
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg p-4 flex flex-col items-center gap-2 transition-all"
              >
                <BarChart3 size={32} />
                <span className="font-bold">Export Excel</span>
                <span className="text-xs text-gray-600">Advanced analysis</span>
              </button>
            </div>
          </div>

          {/* Research Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 flex items-center gap-3 transition-all shadow-md">
              <Beaker size={24} />
              <span className="font-bold">Run Analysis</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center gap-3 transition-all shadow-md">
              <BarChart3 size={24} />
              <span className="font-bold">Generate Report</span>
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-4 flex items-center gap-3 transition-all shadow-md">
              <Database size={24} />
              <span className="font-bold">Query Database</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
