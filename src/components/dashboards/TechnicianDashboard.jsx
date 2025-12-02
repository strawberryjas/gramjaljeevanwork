import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Activity, Droplet, Gauge, Zap,
  Clock, WifiOff, Radio, Layout, Map, Settings, List
} from 'lucide-react';
import { SystemContainer } from './SystemContainer';

// Lazy load detail components
const PumpDetails = lazy(() => import('./PumpDetails').then(module => ({ default: module.PumpDetails })));
const WaterTankDetails = lazy(() => import('./WaterTankDetails').then(module => ({ default: module.WaterTankDetails })));
const PipelinesOverview = lazy(() => import('./PipelinesOverview').then(module => ({ default: module.PipelinesOverview })));
const PipelineDetails = lazy(() => import('./PipelineDetails').then(module => ({ default: module.PipelineDetails })));

// Technician Dashboard - Full operational access (Original Overview)
export const TechnicianDashboard = ({
  sensors = {},
  offlineMode,
  lastSync,
  activeView,
  setActiveView,
  systemState // Full simulation state with pipelines
}) => {
  const [activeNetworkView, setActiveNetworkView] = useState('diagram'); // 'diagram', 'pump', 'tank', 'pipelines', 'pipeline-details'
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Live sensor data from IoT network (updated every second)
  // Main Tank Sensors (primary data source)
  const tankLevel = Math.round(sensors?.tankLevel || 75);
  const turbidity = sensors?.turbidity || sensors?.qualityTurbidity || 0.8;
  const chlorine = sensors?.chlorine || sensors?.qualityChlorine || 0.6;
  const pH = sensors?.pH || sensors?.qualityPH || 7.2;
  const tds = sensors?.qualityTDS || 320;

  // Pump House Sensors
  const pumpStatus = sensors?.pumpStatus || 'OFF';
  const isPumpRunning = pumpStatus === 'ON' || pumpStatus === 'RUNNING';
  const flowRate = isPumpRunning ? (sensors?.flowRate ?? sensors?.pumpFlowRate ?? 0) : 0;
  const pressure = isPumpRunning ? (sensors?.pressure ?? sensors?.pipePressure ?? 0) : 0;
  const powerConsumption = isPumpRunning ? (sensors?.powerConsumption ?? sensors?.pumpPower ?? 0) : 0;
  const tankQualityRef = {
    turbidity: sensors?.turbidity ?? sensors?.qualityTurbidity ?? 0,
    pH: sensors?.pH ?? sensors?.qualityPH ?? 7,
    chlorine: sensors?.chlorine ?? sensors?.qualityChlorine ?? 0,
    TDS: sensors?.qualityTDS ?? 0,
  };
  const formatQualityValue = (value, decimals = 2) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(decimals) : '—';
  };

  // Get pipelines from systemState (simulation engine)
  const pipelines = systemState?.pipelines || [];

  // Calculate total flow from all pipelines
  const totalFlow = pipelines.length > 0
    ? pipelines.reduce((sum, p) => sum + (p.outlet?.flowSensor?.value || 0), 0)
    : (sensors?.totalFlowRate || flowRate);

  // Update chart data when sensors change (real-time IoT updates)
  useEffect(() => {
    if (sensors) {
      setLastUpdate(new Date());
    }
  }, [sensors]);

  // Sync internal state with parent activeView prop
  useEffect(() => {
    if (activeView === 'overview') setActiveNetworkView('diagram');
    else if (activeView === 'quality') setActiveNetworkView('quality');
    else if (activeView === 'analytics') setActiveNetworkView('analytics');
    else if (activeView === 'gis') setActiveNetworkView('gis');
  }, [activeView]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeNetworkView]);

  // Handle navigation from SystemContainer diagram clicks
  const handleDiagramNavigation = (target) => {
    if (target === 'pump-details') {
      setActiveNetworkView('pump');
    } else if (target === 'tank-details') {
      setActiveNetworkView('tank');
    } else if (target === 'pipelines-overview') {
      setActiveNetworkView('pipelines');
    } else if (target === 'infrastructure') {
      setActiveNetworkView('pipelines'); // Map 'infrastructure' to pipelines view for now
    } else if (target && target.startsWith('pipeline-details-')) {
      const pipelineId = target.replace('pipeline-details-', '');
      setSelectedPipelineId(Number(pipelineId));
      setActiveNetworkView('pipeline-details');
    }
  };

  const handlePipelineDrillDown = (target) => {
    if (target && target.startsWith('pipeline-details-')) {
      const pipelineId = target.replace('pipeline-details-', '');
      setSelectedPipelineId(Number(pipelineId));
      setActiveNetworkView('pipeline-details');
    }
  };

  const operationalStats = [
    {
      label: 'Main Tank Level',
      value: `${tankLevel}%`,
      icon: Droplet,
      color: 'blue',
      status: tankLevel > 30 ? 'normal' : 'warning',
      subtitle: 'Main Overhead Tank'
    },
    {
      label: 'Total Flow Rate',
      value: `${totalFlow.toFixed(1)} L/min`,
      icon: Activity,
      color: 'blue',
      status: totalFlow > 80 ? 'normal' : 'warning',
      subtitle: 'All Pipelines Combined'
    },
    {
      label: 'Pump Pressure',
      value: `${pressure.toFixed(1)} Bar`,
      icon: Gauge,
      color: 'emerald',
      status: pressure > 2.5 ? 'normal' : 'critical',
      subtitle: `Pump: ${pumpStatus}`
    },
    {
      label: 'Power Consumption',
      value: `${powerConsumption.toFixed(1)} kW`,
      icon: Zap,
      color: 'purple',
      status: powerConsumption < 15 ? 'normal' : 'warning',
      subtitle: 'Current Draw'
    },
  ];

  const qualityMetrics = [
    {
      label: 'Turbidity',
      value: turbidity.toFixed(2),
      unit: 'NTU',
      status: turbidity < 1 ? 'good' : 'warning',
      source: 'Main Tank Sensor'
    },
    {
      label: 'Chlorine',
      value: chlorine.toFixed(2),
      unit: 'mg/L',
      status: chlorine >= 0.5 && chlorine <= 1.0 ? 'good' : 'warning',
      source: 'Main Tank Sensor'
    },
    {
      label: 'pH Level',
      value: pH.toFixed(2),
      unit: '',
      status: pH >= 6.5 && pH <= 8.5 ? 'good' : 'warning',
      source: 'Main Tank Sensor'
    },
    {
      label: 'TDS',
      value: tds.toFixed(0),
      unit: 'ppm',
      status: tds < 500 ? 'good' : 'warning',
      source: 'Main Tank Sensor'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-3">
            Junja Network Monitor
            {isLive && (
              <span className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-600 animate-pulse">
                <Radio size={14} className="animate-ping absolute" />
                <Radio size={14} />
                LIVE
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock size={14} /> Last Update: {lastUpdate.toLocaleTimeString()} |
            <WifiOff size={14} /> {offlineMode ? 'Offline Mode' : 'Online Mode'} |
            <span className="text-blue-600 font-bold">Tank: {tankLevel}% | Flow: {flowRate.toFixed(1)} L/min</span>
          </p>
        </div>
      </div>

      {/* Sub-Dashboard Navigation removed as requested */}

      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading component...</div>}>
        {activeNetworkView === 'diagram' && (
          <SystemContainer onNavigate={handleDiagramNavigation} />
        )}
        {activeNetworkView === 'quality' && (
          <WaterTankDetails onBack={() => setActiveNetworkView('diagram')} />
        )}
        {activeNetworkView === 'analytics' && (
          <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Activity size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">ML Analytics Dashboard</h3>
            <p className="text-sm text-slate-400">Predictive maintenance and usage analysis coming soon.</p>
          </div>
        )}
        {activeNetworkView === 'gis' && (
          <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Map size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">GIS Mapping System</h3>
            <p className="text-sm text-slate-400">Geospatial infrastructure view coming soon.</p>
          </div>
        )}
        {/* Hidden views accessible via drill-down */}
        {activeNetworkView === 'pump' && (
          <PumpDetails onBack={() => setActiveNetworkView('diagram')} />
        )}
        {activeNetworkView === 'tank' && (
          <WaterTankDetails onBack={() => setActiveNetworkView('diagram')} />
        )}
        {activeNetworkView === 'pipelines' && (
          <PipelinesOverview
            onBack={() => setActiveNetworkView('diagram')}
            onNavigateToPipeline={handlePipelineDrillDown}
          />
        )}
        {activeNetworkView === 'pipeline-details' && (
          <PipelineDetails
            pipelineId={selectedPipelineId}
            onBack={() => setActiveNetworkView('pipelines')}
          />
        )}
      </Suspense>
    </div>
  );
};
