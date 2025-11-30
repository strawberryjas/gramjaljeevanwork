import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  Activity, Droplet, AlertTriangle, Wind, Zap, Clipboard,
  LogOut, MapPin, Clock, WifiOff,
  Server, Layers, ClipboardList, PenTool, Wrench, DollarSign,
  FlaskConical, Beaker, Microscope, TrendingUp,
  CalendarClock, Calendar, AlertCircle,
  Users, Star, FileCheck, LayoutDashboard, Table, FileText,
  Thermometer, Power, Map,
  Ticket, CheckSquare, Filter, PlusCircle, X, Languages,
  Landmark, Navigation, Play, Square, Settings,
  Download, FileBarChart, Upload, Share2, Leaf, Sun, Gauge, BarChart3,
  PieChart as PieChartIcon, Menu
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Legend, Scatter,
  PieChart, Pie, Cell
} from 'recharts';

// Import our modular components
import { LoginScreen } from './components/auth/LoginScreen';
import { VoiceAssistant } from './components/VoiceAssistant';
import { StatCard } from './components/shared/StatCard';
import { GaugeChart } from './components/shared/GaugeChart';
import { QualityCard } from './components/shared/QualityCard';
import { CountdownCard } from './components/shared/CountdownCard';
import { PipelineMapViewer } from './components/PipelineMapViewer';
const GuestDashboard = lazy(() =>
  import('./components/dashboards/GuestDashboard').then(module => ({
    default: module.GuestDashboard,
  }))
);
const TechnicianDashboard = lazy(() =>
  import('./components/dashboards/TechnicianDashboard').then(module => ({
    default: module.TechnicianDashboard,
  }))
);
const ResearcherDashboard = lazy(() =>
  import('./components/dashboards/ResearcherDashboard').then(module => ({
    default: module.ResearcherDashboard,
  }))
);
const PumpDetails = lazy(() =>
  import('./components/dashboards/PumpDetails').then(module => ({
    default: module.PumpDetails,
  }))
);
const PipelineDetails = lazy(() =>
  import('./components/dashboards/PipelineDetails').then(module => ({
    default: module.PipelineDetails,
  }))
);
const WaterTankDetails = lazy(() =>
  import('./components/dashboards/WaterTankDetails').then(module => ({
    default: module.WaterTankDetails,
  }))
);
const PipelinesOverview = lazy(() =>
  import('./components/dashboards/PipelinesOverview').then(module => ({
    default: module.PipelinesOverview,
  }))
);

// Import constants and utilities
import { HAZARD_LOGS } from './constants/mockData';
import { getNextDistributionTime } from './utils/helpers';
import { samplePipelineData, sampleInfrastructureData } from './data/samplePipelineData';

// Import hooks
import { useSimulationData } from './hooks/useSimulationData';
import { useAuth, useLanguage, useOffline } from './hooks/useAppState';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './components/LanguageSelector';

const ministryLogoUrl = '/ministry-logo.svg';
const jalsenseLogoUrl = '/jalsense-logo.svg';

const formatMetric = (value, decimals = 2, fallback = 0) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Number(parsed.toFixed(decimals));
  }
  const fb = Number(fallback);
  return Number.isFinite(fb) ? Number(fb.toFixed(decimals)) : 0;
};

const formatDurationLabel = (ms = 0) => {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  return `${seconds}s`;
};

const toLocalInputString = (date) => {
  if (!(date instanceof Date)) return '';
  const pad = (num) => `${num}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * GRAM JAL JEEVAN - Rural Piped Water Supply O&M System
 * V18.0 - Public Transparency & Full Integration Edition
 * Features: Extended Public Dashboard (Energy, GIS, Help Desk, Voice AI)
 */

// --- DASHBOARDS ---

const InfrastructureDashboard = ({ data, history, systemState, onTogglePump, onToggleValve, onSchedulePumpTimer, onSchedulePumpStop, onCancelPumpSchedule }) => {
  const [selectedPump, setSelectedPump] = useState('primary');
  const [confirmPump, setConfirmPump] = useState(null);
  const [pumpTimerMinutes, setPumpTimerMinutes] = useState(30);
  const [pumpStopAt, setPumpStopAt] = useState(() => toLocalInputString(new Date(Date.now() + 60 * 60 * 1000)));

  // Use live system state from simulation engine
  const pumpStatus = systemState?.pumpHouse?.pumpStatus || data?.pumpStatus || 'OFF';
  const isPumpOn = pumpStatus === 'ON' || pumpStatus === 'RUNNING';

  // Get pipeline data from digital twin
  const pipelineSegments = systemState?.pipelines?.map((p, idx) => {
    const inletFlow = p.inlet?.flowSensor?.value || 0;
    const inletPressure = p.inlet?.pressureSensor?.value || 0;
    const status = p.leakageProbability > 40 ? 'critical' :
      p.leakageProbability > 20 ? 'warning' : 'normal';
    return {
      id: `pipeline-${p.pipelineId}`,
      label: p.pipelineName || `Pipeline ${p.pipelineId}`,
      pressure: inletPressure,
      flow: inletFlow,
      status: status,
      pipelineId: p.pipelineId,
      valveStatus: p.valveStatus,
      leakage: p.leakageProbability,
    };
  }) || [
      { id: 'intake', label: 'Raw Water Intake', pressure: 4.2, flow: 420, status: 'normal' },
      { id: 'treatment', label: 'Treatment Plant', pressure: 3.6, flow: 400, status: 'normal' },
      { id: 'transmission', label: 'Transmission Main', pressure: 3.1, flow: 380, status: 'warning' },
      { id: 'distribution', label: 'Distribution Ring', pressure: 2.4, flow: 360, status: 'critical' },
    ];

  // Get valves from digital twin pipelines
  const valves = systemState?.pipelines?.map(p => ({
    id: `V-${p.pipelineId}`,
    location: p.pipelineName?.replace(/.*- /, '') || `Ward ${p.pipelineId}`,
    state: p.valveStatus,
    automation: 'Manual',
    lastAction: 'Just now',
    pipelineId: p.pipelineId,
  })) || [
      { id: 'V-01', location: 'Ward 1', state: 'OPEN', automation: 'Auto', lastAction: '10 min ago' },
      { id: 'V-05', location: 'Ward 5', state: 'CLOSED', automation: 'Manual', lastAction: '1 hr ago' },
      { id: 'V-12', location: 'Elevated Tank', state: 'OPEN', automation: 'Auto', lastAction: '5 min ago' },
      { id: 'V-17', location: 'Booster Line', state: 'CLOSED', automation: 'Manual', lastAction: '2 hrs ago' },
    ];

  // Get sensors from digital twin - Main tank sensors + pipeline sensors
  const sensors = systemState ? [
    // Main Tank Sensors
    {
      id: 'S-TANK-LEVEL',
      type: 'Level',
      location: 'Main Tank',
      battery: 95,
      lastSeen: 'Just now',
      value: `${systemState.overheadTank?.tankLevel?.toFixed(1)}%`,
      status: systemState.overheadTank?.tankLevel > 30 ? 'ACTIVE' : 'WARNING'
    },
    {
      id: 'S-TANK-PH',
      type: 'Water Quality (pH)',
      location: 'Main Tank',
      battery: 92,
      lastSeen: 'Just now',
      value: systemState.overheadTank?.waterQuality?.pH?.toFixed(2),
      status: 'ACTIVE'
    },
    {
      id: 'S-TANK-TURB',
      type: 'Water Quality (Turbidity)',
      location: 'Main Tank',
      battery: 90,
      lastSeen: 'Just now',
      value: `${systemState.overheadTank?.waterQuality?.turbidity?.toFixed(2)} NTU`,
      status: 'ACTIVE'
    },
    // Pipeline Sensors (from each pipeline)
    ...(systemState.pipelines?.flatMap(p => [
      {
        id: `S-P${p.pipelineId}-INLET-FLOW`,
        type: 'Flow',
        location: `${p.pipelineName} - Inlet`,
        battery: 88,
        lastSeen: 'Just now',
        value: `${p.inlet?.flowSensor?.value || 0} L/min`,
        status: p.valveStatus === 'OPEN' ? 'ACTIVE' : 'INACTIVE'
      },
      {
        id: `S-P${p.pipelineId}-INLET-PRESSURE`,
        type: 'Pressure',
        location: `${p.pipelineName} - Inlet`,
        battery: 85,
        lastSeen: 'Just now',
        value: `${p.inlet?.pressureSensor?.value?.toFixed(2) || 0} bar`,
        status: p.valveStatus === 'OPEN' ? 'ACTIVE' : 'INACTIVE'
      },
      {
        id: `S-P${p.pipelineId}-OUTLET-FLOW`,
        type: 'Flow',
        location: `${p.pipelineName} - Outlet`,
        battery: 82,
        lastSeen: 'Just now',
        value: `${p.outlet?.flowSensor?.value || 0} L/min`,
        status: p.valveStatus === 'OPEN' ? 'ACTIVE' : 'INACTIVE'
      },
      {
        id: `S-P${p.pipelineId}-OUTLET-PRESSURE`,
        type: 'Pressure',
        location: `${p.pipelineName} - Outlet`,
        battery: 80,
        lastSeen: 'Just now',
        value: `${p.outlet?.pressureSensor?.value?.toFixed(2) || 0} bar`,
        status: p.valveStatus === 'OPEN' ? 'ACTIVE' : 'INACTIVE'
      },
    ]) || [])
  ] : [
    { id: 'S-101', type: 'Pressure', location: 'Ward 3', battery: 92, lastSeen: '2 mins ago' },
    { id: 'S-204', type: 'Flow', location: 'Ward 5', battery: 68, lastSeen: '12 mins ago' },
    { id: 'S-307', type: 'Water Quality', location: 'Tank Zone', battery: 54, lastSeen: '5 mins ago' },
    { id: 'S-415', type: 'Level', location: 'Ground Reservoir', battery: 87, lastSeen: 'Just now' },
  ];

  // Get tank data from digital twin
  const tankCapacity = systemState?.overheadTank?.tankCapacity || 50000;
  const tankLevel = systemState?.overheadTank?.tankLevel || data?.tankLevel || 75;
  const currentVolume = Math.round((tankLevel / 100) * tankCapacity);
  const inflow = systemState?.pumpHouse?.pumpFlowOutput || data?.pumpFlowRate || 0;
  const totalOutflow = systemState?.systemMetrics?.totalFlowRate || 0;
  const outflow = totalOutflow || Math.max(320, inflow - 40);
  const predictedEmptyHours = outflow > inflow ? ((currentVolume) / (outflow - inflow)).toFixed(1) : 'Stable';
  const predictedFillHours = inflow > outflow ? ((tankCapacity - currentVolume) / (inflow - outflow)).toFixed(1) : 'N/A';

  const handlePumpToggle = (id) => {
    if (id === 'primary' && onTogglePump) {
      onTogglePump();
    } else {
      setConfirmPump(id);
    }
  };

  const pumpSchedule = systemState?.pumpSchedule || {};
  const scheduleMode = pumpSchedule.mode || 'MANUAL';
  const scheduleCountdown = formatDurationLabel(pumpSchedule.timerRemainingMs);
  const scheduleStopTime = pumpSchedule.timerEnd
    ? new Date(pumpSchedule.timerEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';
  const lastScheduleEvent = pumpSchedule.lastEvent?.type?.replace(/_/g, ' ');

  const triggerPumpTimer = () => {
    if (!onSchedulePumpTimer) return;
    const minutes = Math.max(1, Number(pumpTimerMinutes) || 0);
    onSchedulePumpTimer(minutes);
  };

  const triggerPumpStopAt = () => {
    if (!onSchedulePumpStop || !pumpStopAt) return;
    onSchedulePumpStop(pumpStopAt);
  };

  const clearPumpSchedule = () => {
    if (onCancelPumpSchedule) {
      onCancelPumpSchedule('USER_CANCELLED');
    }
  };

  const confirmPumpToggle = () => {
    if (!confirmPump) return;
    if (confirmPump === 'primary' && onTogglePump) {
      onTogglePump();
    }
    setConfirmPump(null);
  };

  const handleValveToggle = (valve) => {
    if (valve.pipelineId && onToggleValve) {
      onToggleValve(valve.pipelineId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <Server size={32} className="text-indigo-600" /> Infrastructure Command Center
          </h2>
          <p className="text-sm text-gray-500">Live view of pumps, pipelines, valves and sensors</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
            Specific Energy: {systemState?.pumpHouse?.pumpFlowOutput > 0 && systemState?.pumpHouse?.powerConsumption
              ? (systemState.pumpHouse.powerConsumption / (systemState.pumpHouse.pumpFlowOutput * 0.06)).toFixed(2)
              : 0} kWh/m³
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            Total Flow: {systemState?.systemMetrics?.totalFlowRate
              ? (systemState.systemMetrics.totalFlowRate * 60).toLocaleString()
              : '0'} L/hr
          </span>
        </div>
      </div>

      {/* Pipeline Network Diagram */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-4 border-b bg-indigo-50 flex items-center justify-between">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2">
            <Layers size={18} /> Pipeline Network Overview
          </h3>
          <span className="text-xs font-semibold text-indigo-600">Pressure reference: Bar • Flow: L/min</span>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {pipelineSegments.map((segment, idx) => (
              <React.Fragment key={segment.id}>
                <div className={`w-full max-w-xs p-4 rounded-xl border-2 ${segment.status === 'critical' ? 'border-red-300 bg-red-50' : segment.status === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
                  <p className="text-xs uppercase text-gray-500 mb-1">{segment.label}</p>
                  <p className="text-2xl font-black text-black">{segment.pressure.toFixed(1)} <span className="text-sm text-gray-500">Bar</span></p>
                  <p className="text-xs text-gray-500 mt-1">Flow: {segment.flow} L/min</p>
                  <div className="w-full bg-white rounded-full h-2 mt-3 overflow-hidden">
                    <div className={`h-full ${segment.status === 'critical' ? 'bg-red-500' : segment.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(segment.pressure / 5) * 100}%` }}></div>
                  </div>
                </div>
                {idx < pipelineSegments.length - 1 && (
                  <div className="hidden lg:flex flex-col items-center text-gray-400">
                    <div className="w-16 h-2 bg-gradient-to-r from-slate-300 to-slate-200 rounded-full"></div>
                    <Navigation size={18} className="mt-1" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal •
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning •
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
          </p>
        </div>
      </div>

      {/* Pump Station + Tank */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Single Pump Station */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black flex items-center gap-2">
              <Power size={18} /> Main Pump Station
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPumpOn ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
              {isPumpOn ? '● RUNNING' : '○ STOPPED'}
            </span>
          </div>

          {/* Pump Visual */}
          <div className={`relative p-6 rounded-2xl border-2 mb-4 transition-all duration-500 ${isPumpOn ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Animated Pump Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isPumpOn ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}>
                  <Power size={36} className={`text-white ${isPumpOn ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <p className="text-2xl font-black text-black">{isPumpOn ? 'RUNNING' : 'STOPPED'}</p>
                  <p className="text-sm text-gray-500">Primary Pump • Kirloskar 7.5HP</p>
                </div>
              </div>

              {/* Flow Animation */}
              {isPumpOn && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-24 bg-blue-100 rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 animate-flow-up" style={{ height: '60%', animation: 'flowUp 1s infinite' }}></div>
                    </div>
                    <span className="text-xs text-blue-600 font-bold mt-1">Flow</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pump Metrics */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-black text-blue-600">{(systemState?.pumpHouse?.pumpFlowOutput || 0).toFixed(0)}</p>
                <p className="text-xs text-gray-500">L/min Flow</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-black text-emerald-600">{(systemState?.pumpHouse?.pumpPressureOutput || 0).toFixed(1)}</p>
                <p className="text-xs text-gray-500">Bar Pressure</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-black text-amber-600">{(systemState?.pumpHouse?.powerConsumption || 0).toFixed(1)}</p>
                <p className="text-xs text-gray-500">kW Power</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-black text-purple-600">{(systemState?.pumpHouse?.pumpRunningHours || 0).toFixed(1)}</p>
                <p className="text-xs text-gray-500">Hours Run</p>
              </div>
            </div>

            {/* Motor Temperature */}
            <div className="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
              <span className="text-sm text-gray-600">Motor Temperature</span>
              <span className={`text-lg font-bold ${(systemState?.pumpHouse?.motorTemperature || 25) > 55 ? 'text-red-600' : 'text-green-600'}`}>
                {(systemState?.pumpHouse?.motorTemperature || 25).toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Pump Control Button */}
          <button
            onClick={() => handlePumpToggle('primary')}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${isPumpOn
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
              }`}
          >
            {isPumpOn ? <Square size={20} /> : <Play size={20} />}
            {isPumpOn ? 'STOP PUMP' : 'START PUMP'}
          </button>

          {/* Open Pipelines Count */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700">
              <strong>{systemState?.pipelines?.filter(p => p.valveStatus === 'OPEN').length || 0}</strong> of 5 pipelines open
              {isPumpOn && systemState?.pipelines?.filter(p => p.valveStatus === 'OPEN').length === 0 && (
                <span className="ml-2 text-green-600 font-bold">• Tank Filling</span>
              )}
            </p>
          </div>

          {/* Pump Scheduler Controls */}
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={14} className="text-blue-600" />
                Pump Scheduler
              </p>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold">
                Mode: {scheduleMode}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={pumpTimerMinutes}
                  onChange={(e) => setPumpTimerMinutes(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={triggerPumpTimer}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                >
                  Run Timer
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={pumpStopAt || ''}
                  onChange={(e) => setPumpStopAt(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={triggerPumpStopAt}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Schedule Stop
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span>Next auto-stop: {scheduleMode === 'TIMER' ? scheduleCountdown : scheduleStopTime}</span>
              <span>Failsafe: Tank 100% cutoff active</span>
              <button onClick={clearPumpSchedule} className="text-rose-600 font-bold hover:underline">
                Clear schedule
              </button>
            </div>
            {lastScheduleEvent && (
              <p className="text-[11px] text-slate-500">Last event: {lastScheduleEvent}</p>
            )}
          </div>
        </div>

        {/* Tank Status with Filling Animation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black flex items-center gap-2">
              <Droplet size={18} /> Water Tank Status
            </h3>
            {systemState?.overheadTank?.isFilling && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 animate-pulse">
                ↑ FILLING
              </span>
            )}
            {!systemState?.overheadTank?.isFilling && inflow < outflow && isPumpOn && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                ↓ DRAINING
              </span>
            )}
          </div>
          <div className="space-y-4">
            {/* Tank Visual with Animation */}
            <div className="relative h-48 bg-slate-200 rounded-2xl overflow-hidden border-4 border-slate-300">
              {/* Water Level */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div
                  className={`w-full transition-all duration-1000 ${systemState?.overheadTank?.isFilling
                    ? 'bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300'
                    : 'bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300'
                    }`}
                  style={{ height: `${Math.max(0, Math.min(100, tankLevel))}%` }}
                >
                  {/* Wave Animation when filling */}
                  {systemState?.overheadTank?.isFilling && (
                    <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
                      <div className="animate-wave bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 h-full opacity-70"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bubbles animation when filling */}
              {systemState?.overheadTank?.isFilling && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/50 rounded-full animate-bubble"
                      style={{
                        left: `${15 + i * 15}%`,
                        bottom: '10%',
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '2s'
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Tank Info Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>100%</span>
                  <span className="text-white bg-black/30 px-2 py-0.5 rounded">
                    {systemState?.overheadTank?.isFilling ? '▲ Filling' : inflow < outflow ? '▼ Draining' : '— Stable'}
                  </span>
                </div>
                <div className="text-center text-white drop-shadow-lg">
                  <p className="text-4xl font-black">{Math.max(0, Math.min(100, tankLevel)).toFixed(1)}%</p>
                  <p className="text-sm uppercase tracking-wide font-bold">
                    {currentVolume.toLocaleString()} / {tankCapacity.toLocaleString()} L
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-bold">0%</div>
              </div>
            </div>

            {/* Water Quality Metrics */}
            {systemState?.overheadTank?.waterQuality && (
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                  <p className="font-bold text-blue-700">{systemState.overheadTank.waterQuality.pH.toFixed(2)}</p>
                  <p className="text-blue-500">pH</p>
                </div>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center">
                  <p className="font-bold text-cyan-700">{systemState.overheadTank.waterQuality.turbidity.toFixed(2)}</p>
                  <p className="text-cyan-500">NTU</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <p className="font-bold text-green-700">{systemState.overheadTank.waterQuality.chlorine.toFixed(2)}</p>
                  <p className="text-green-500">Cl mg/L</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
                  <p className="font-bold text-purple-700">{systemState.overheadTank.waterQuality.TDS.toFixed(0)}</p>
                  <p className="text-purple-500">TDS</p>
                </div>
              </div>
            )}

            {/* Flow Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`border rounded-xl p-3 ${inflow > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-gray-500 flex items-center gap-1">
                  <span className={inflow > 0 ? 'text-green-500' : ''}>↓</span> Inflow Rate
                </p>
                <p className={`text-xl font-bold ${inflow > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {inflow.toFixed(0)} L/min
                </p>
              </div>
              <div className={`border rounded-xl p-3 ${outflow > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-gray-500 flex items-center gap-1">
                  <span className={outflow > 0 ? 'text-amber-500' : ''}>↑</span> Outflow Rate
                </p>
                <p className={`text-xl font-bold ${outflow > 0 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {outflow.toFixed(0)} L/min
                </p>
              </div>
            </div>

            {/* Valve Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onToggleValve && systemState?.pipelines?.forEach((_, i) => onToggleValve(i + 1))}
                className="py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
              >
                Toggle All Valves
              </button>
              <button className="py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                View Tank History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Valves and Sensors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="p-4 border-b bg-green-50 flex items-center justify-between">
            <h3 className="font-bold text-green-900 flex items-center gap-2">
              <PenTool size={18} /> Valve Control Matrix
            </h3>
            <span className="text-xs font-semibold text-green-700">{valves.filter(v => v.state === 'OPEN').length} OPEN / {valves.length} TOTAL</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {valves.map(valve => (
              <div key={valve.id} className="p-3 rounded-xl border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-black">{valve.id}</p>
                  <span className={`text-2xs px-2 py-0.5 rounded-full font-bold ${valve.state === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-black'}`}>{valve.state}</span>
                </div>
                <p className="text-xs text-gray-500">{valve.location}</p>
                <p className="text-2xs text-gray-400 mt-1">Mode: {valve.automation}</p>
                <p className="text-2xs text-gray-400">Last action: {valve.lastAction}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleValveToggle(valve)}
                    className={`flex-1 text-2xs py-1.5 rounded-lg border font-bold ${valve.state === 'OPEN'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                      }`}
                  >
                    {valve.state === 'OPEN' ? 'Close Valve' : 'Open Valve'}
                  </button>
                  <button className="flex-1 text-2xs py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="p-4 border-b bg-emerald-50 flex items-center justify-between">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
              <Microscope size={18} /> Sensor Health Dashboard
            </h3>
            <span className="text-xs font-semibold text-emerald-600">Avg Battery: {Math.round(sensors.reduce((acc, s) => acc + s.battery, 0) / sensors.length)}%</span>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {sensors.map(sensor => (
              <div key={sensor.id} className={`flex items-center justify-between rounded-xl border p-3 ${sensor.status === 'WARNING' ? 'border-amber-300 bg-amber-50' :
                sensor.status === 'INACTIVE' ? 'border-gray-200 bg-gray-50' :
                  'border-emerald-200 bg-emerald-50'
                }`}>
                <div className="flex-1">
                  <p className="text-sm font-bold text-black">{sensor.id} • {sensor.type}</p>
                  <p className="text-xs text-gray-500">{sensor.location}</p>
                  {sensor.value && (
                    <p className="text-xs font-bold text-blue-600 mt-1">Current: {sensor.value}</p>
                  )}
                  <p className="text-2xs text-gray-400 mt-1">Last transmission: {sensor.lastSeen}</p>
                  {sensor.status && (
                    <span className={`text-2xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${sensor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      sensor.status === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {sensor.status}
                    </span>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">Battery</p>
                  <p className={`text-lg font-bold ${sensor.battery < 50 ? 'text-red-600' : 'text-green-600'}`}>{sensor.battery}%</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className={`h-full ${sensor.battery < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${sensor.battery}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pump Performance Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
          <Activity size={18} className="text-slate-600" />
          <h3 className="font-bold text-slate-800">Flow vs Pressure Trends</h3>
        </div>
        <div className="p-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis yAxisId="left" label={{ value: 'Flow (L/m)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Pressure (Bar)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="pumpFlowRate" fill="#dbeafe" stroke="#3b82f6" name="Flow Rate" />
              <Line yAxisId="right" type="monotone" dataKey="pipePressure" stroke="#ef4444" strokeWidth={2} name="Pipe Pressure" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {confirmPump && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border-2 border-gray-200">
            <div className="p-5 border-b bg-amber-50 flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-600" />
              <div>
                <p className="text-sm font-bold text-amber-700 uppercase tracking-wide">Confirm Action</p>
                <p className="text-xs text-amber-600">Pump {confirmPump.toUpperCase()}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-black">
                Are you sure you want to {pumpStates[confirmPump] ? 'stop' : 'start'} the <strong>{confirmPump} pump</strong>? This will update the live infrastructure status and may affect current supply schedule.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmPump(null)} className="flex-1 py-2 rounded-xl border text-black font-bold">Cancel</button>
                <button onClick={confirmPumpToggle} className={`flex-1 py-2 rounded-xl font-bold text-white ${pumpStates[confirmPump] ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DailyOperationDashboard = ({ data, user, logInspection, history }) => {
  const [costPerUnit] = useState(8);
  const energyConsumed = Number(data.dailyEnergyKWh ?? 0);
  const dailyCost = energyConsumed * costPerUnit;
  const monthlyProjection = dailyCost * 30;
  const handleInspection = () => {
    const result = window.prompt("Perform Visual Leak Check? (Enter 'OK' or 'Issue')");
    if (result) logInspection(result);
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <ClipboardList size={28} className="text-teal-600" /> Daily Operations Center
        </h2>
        <div className="text-sm text-gray-500">Shift: Morning</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
            <h3 className="font-bold text-teal-800 flex items-center gap-2">
              <PenTool size={20} /> 1. Daily Routine Checks
            </h3>
            <button onClick={handleInspection} className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
              <Clipboard size={14} /> Log Inspection
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="text-xs text-gray-500 uppercase mb-1">Last Insp. Time</div>
                <div className="font-bold text-black">{data.lastInspectionDate}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="text-xs text-gray-500 uppercase mb-1">Operator ID</div>
                <div className="font-bold text-blue-600">{data.lastInspectionOperator}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="bg-amber-50 p-4 border-b border-amber-100">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
              <DollarSign size={20} /> 2. Energy & Cost Metrics
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-xs text-gray-500 uppercase mb-1">Energy Consumed</div>
              <div className="text-2xl font-bold text-black">{energyConsumed.toFixed(1)}</div>
              <div className="text-xs text-gray-400">kWh (Est.)</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-xs text-gray-500 uppercase mb-1">Daily Cost</div>
              <div className="text-2xl font-bold text-green-600">₹{dailyCost.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Operating Cost</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-xs text-gray-500 uppercase mb-1">Monthly O&M</div>
              <div className="text-2xl font-bold text-blue-600">₹{monthlyProjection.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Projected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WaterQualityDashboard = ({ data, logWaterTest }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const pipelineQualities = data.pipelineQualities || [];
  const tankQuality = {
    turbidity: data.qualityTurbidity || 0,
    pH: data.qualityPH || 7,
    chlorine: data.qualityChlorine || 0,
    TDS: data.qualityTDS || 0,
  };
  const wqi = Math.round(
    (tankQuality.pH >= 6.5 && tankQuality.pH <= 8.5 ? 25 : 0) +
    (tankQuality.turbidity <= 5 ? 25 : 0) +
    (tankQuality.chlorine >= 0.2 && tankQuality.chlorine <= 1.0 ? 25 : 0) +
    (tankQuality.TDS <= 500 ? 15 : 0) +
    (data.qualityTemperature <= 28 ? 10 : 0)
  );

  const avgPipelineDeviation = pipelineQualities.length
    ? formatMetric(
      pipelineQualities.reduce((sum, pq) => sum + pq.deviation, 0) / pipelineQualities.length,
      1,
      0
    )
    : 0;
  const highestDeviationPipeline = pipelineQualities.reduce(
    (prev, curr) => (curr.deviation > (prev?.deviation ?? -Infinity) ? curr : prev),
    null
  );
  const pipelinesNeedingAttention = pipelineQualities.filter(p => p.deviation > 10).length;

  const pipelineChartData = pipelineQualities.map(pq => ({
    pipeline: pq.shortName || pq.pipelineName,
    tankPH: formatMetric(tankQuality.pH, 2, 0),
    pipelinePH: pq.outlet.pH,
    tankTurbidity: formatMetric(tankQuality.turbidity, 2, 0),
    pipelineTurbidity: pq.outlet.turbidity,
    tankChlorine: formatMetric(tankQuality.chlorine, 2, 0),
    pipelineChlorine: pq.outlet.chlorine,
  }));

  const deviationChartData = pipelineQualities.map(pq => ({
    pipeline: pq.shortName || pq.pipelineName,
    deviation: pq.deviation,
  }));

  const formatDisplay = (value, decimals = 2) => {
    const num = Number(value);
    if (Number.isFinite(num)) {
      return num.toFixed(decimals);
    }
    return '—';
  };

  const schedule = [
    { type: 'Field Test', test: 'Chlorine Residual', frequency: 'Daily 6:00 AM', last: 'Today 06:05', next: 'Tomorrow' },
    { type: 'Lab Test', test: 'Complete Potable Panel', frequency: 'Weekly Monday', last: 'Mon 18 Nov', next: 'Mon 25 Nov' },
    { type: 'External Lab', test: 'Microbiological', frequency: 'Monthly 1st week', last: '05 Nov', next: '05 Dec' },
  ];

  const labResults = [
    { id: 'LAB-241118A', date: '18 Nov 2024', parameter: 'pH', result: 7.4, status: 'Within Range' },
    { id: 'LAB-241118B', date: '18 Nov 2024', parameter: 'Turbidity', result: 2.1, status: 'Within Range' },
    { id: 'LAB-241118C', date: '18 Nov 2024', parameter: 'Chlorine', result: 0.15, status: 'Low - Dose' },
    { id: 'LAB-241018D', date: '10 Oct 2024', parameter: 'Coliform', result: 0, status: 'Compliant' },
  ];

  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedDoc(file.name);
      alert('Document attached (mock).');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <FlaskConical size={32} className="text-purple-600" /> Water Quality Intelligence
          </h2>
          <p className="text-sm text-gray-500">Continuous monitoring, compliance tracking, lab records & escalation</p>
        </div>
        <div className={`px-5 py-3 rounded-2xl font-bold text-lg border-2 ${wqi >= 80 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          WQI Score: {wqi}/100
        </div>
      </div>

      {/* Core Metrics */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center justify-between">
          <h3 className="font-bold text-purple-900 flex items-center gap-2">
            <Beaker size={18} /> Core Parameters & Acceptable Ranges
          </h3>
          <button onClick={() => logWaterTest('Manual Sample Collected')} className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl">Record Field Test</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QualityCard label="pH Level" value={data.qualityPH} unit="pH" safeMin={6.5} safeMax={8.5} icon={Beaker} />
          <QualityCard label="Turbidity" value={data.qualityTurbidity} unit="NTU" safeMax={5} icon={Wind} />
          <QualityCard label="Chlorine" value={data.qualityChlorine} unit="mg/L" safeMin={0.2} safeMax={1.0} icon={Droplet} />
          <QualityCard label="TDS" value={data.qualityTDS} unit="ppm" safeMax={500} icon={Layers} />
          <QualityCard label="Temperature" value={data.qualityTemperature || 24} unit="°C" safeMax={28} icon={Thermometer} />
          <QualityCard label="Coliform" value={data.qualityColiform || 0} unit="CFU" safeMax={0} icon={Microscope} />
        </div>
      </div>

      {pipelineQualities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-emerald-700 uppercase">Avg Pipeline Deviation</p>
            <p className="text-3xl font-black text-emerald-600">{avgPipelineDeviation}%</p>
            <p className="text-xs text-emerald-700">vs main tank quality</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 uppercase">Highest Deviation</p>
            <p className="text-lg font-black text-amber-600">
              {highestDeviationPipeline?.shortName || 'All Stable'}
            </p>
            <p className="text-xs text-amber-600">
              {highestDeviationPipeline ? `${highestDeviationPipeline.deviation}% variance` : 'No active alerts'}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-red-700 uppercase">Pipelines Needing Attention</p>
            <p className="text-3xl font-black text-red-600">{pipelinesNeedingAttention}</p>
            <p className="text-xs text-red-600">Deviation &gt; 10% from tank</p>
          </div>
        </div>
      )}

      {/* Pipeline Comparisons */}
      {pipelineQualities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> Tank vs Pipeline (pH & Turbidity)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pipeline" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tankPH" stroke="#6366f1" strokeDasharray="5 5" name="Tank pH" />
                  <Line type="monotone" dataKey="pipelinePH" stroke="#ec4899" strokeWidth={2} name="Pipeline pH" />
                  <Line type="monotone" dataKey="tankTurbidity" stroke="#0ea5e9" strokeDasharray="5 5" name="Tank Turbidity" />
                  <Line type="monotone" dataKey="pipelineTurbidity" stroke="#f97316" strokeWidth={2} name="Pipeline Turbidity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <BarChart3 size={18} /> Quality Deviation by Pipeline
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pipeline" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deviation" fill="#f87171" name="Deviation (%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Alert Threshold Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-black flex items-center gap-2">
          <AlertCircle size={18} /> Alert Threshold Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'pH', min: 6.5, max: 8.5 },
            { label: 'Turbidity', min: 0, max: 5 },
            { label: 'Chlorine', min: 0.2, max: 1 },
            { label: 'TDS', min: 0, max: 500 },
          ].map(param => (
            <div key={param.label} className="border rounded-xl p-3 bg-gray-50">
              <p className="font-bold text-gray-700">{param.label}</p>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" defaultValue={param.min} className="w-full border rounded-lg px-2 py-1" />
                <span>-</span>
                <input type="number" defaultValue={param.max} className="w-full border rounded-lg px-2 py-1" />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">Save Thresholds</button>
      </div>

      {pipelineQualities.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Layers size={16} /> Pipeline Quality Breakdown
            </h3>
            <span className="text-xs text-gray-500">Values shown as Outlet (Inlet)</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs text-gray-600">
              <tr>
                <th className="p-3 text-left font-semibold">Pipeline</th>
                <th className="p-3 text-left font-semibold">pH</th>
                <th className="p-3 text-left font-semibold">Turbidity (NTU)</th>
                <th className="p-3 text-left font-semibold">Chlorine (mg/L)</th>
                <th className="p-3 text-left font-semibold">TDS (ppm)</th>
                <th className="p-3 text-left font-semibold">Δ vs Tank</th>
                <th className="p-3 text-left font-semibold">Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pipelineQualities.map(pq => {
                const turbidityDelta = formatDisplay((pq.outlet.turbidity ?? tankQuality.turbidity) - tankQuality.turbidity);
                const chlorineDelta = formatDisplay((pq.outlet.chlorine ?? tankQuality.chlorine) - tankQuality.chlorine);
                const phDelta = formatDisplay((pq.outlet.pH ?? tankQuality.pH) - tankQuality.pH);
                const tdsDelta = formatDisplay((pq.outlet.TDS ?? tankQuality.TDS) - tankQuality.TDS, 0);
                return (
                  <tr key={pq.pipelineId}>
                    <td className="p-3 font-semibold text-gray-800">{pq.pipelineName}</td>
                    <td className="p-3 text-gray-700">{formatDisplay(pq.outlet.pH)} <span className="text-xs text-gray-500">({formatDisplay(pq.inlet.pH)})</span></td>
                    <td className="p-3 text-gray-700">{formatDisplay(pq.outlet.turbidity)} <span className="text-xs text-gray-500">({formatDisplay(pq.inlet.turbidity)})</span></td>
                    <td className="p-3 text-gray-700">{formatDisplay(pq.outlet.chlorine)} <span className="text-xs text-gray-500">({formatDisplay(pq.inlet.chlorine)})</span></td>
                    <td className="p-3 text-gray-700">{formatDisplay(pq.outlet.TDS, 0)} <span className="text-xs text-gray-500">({formatDisplay(pq.inlet.TDS, 0)})</span></td>
                    <td className="p-3 text-gray-700 text-xs">
                      pH {phDelta}, Turb {turbidityDelta}, Cl {chlorineDelta}, TDS {tdsDelta}
                    </td>
                    <td className={`p-3 font-bold ${pq.deviation > 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {pq.deviation}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule and Documents */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-indigo-50 flex items-center justify-between">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
              <CalendarClock size={18} /> Quality Test Schedule
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">Last Lab Test: {data.lastWaterTest || '18 Nov 2024'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Test</th>
                  <th className="p-3 text-left font-semibold">Frequency</th>
                  <th className="p-3 text-left font-semibold">Last</th>
                  <th className="p-3 text-left font-semibold">Next</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedule.map(item => (
                  <tr key={item.test}>
                    <td className="p-3 font-bold text-black">{item.type}</td>
                    <td className="p-3 text-black">{item.test}</td>
                    <td className="p-3 text-gray-500">{item.frequency}</td>
                    <td className="p-3 text-gray-500">{item.last}</td>
                    <td className="p-3 text-black font-semibold">{item.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-black flex items-center gap-2">
            <Upload size={18} /> Quality Certifications
          </h3>
          <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500 cursor-pointer hover:border-blue-300 transition-colors">
            <input type="file" className="hidden" onChange={handleDocumentUpload} />
            {selectedDoc ? (
              <span className="font-semibold text-blue-600">{selectedDoc}</span>
            ) : (
              <>
                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                Upload lab certificate (PDF/JPG)
              </>
            )}
          </label>
          <div className="text-xs text-gray-500 flex flex-col gap-1">
            <span>• Latest BIS Certification: <strong className="text-black">Valid till Mar 2025</strong></span>
            <span>• Last NABL Lab Report: <strong className="text-black">#LAB-241118A</strong></span>
          </div>
        </div>
      </div>

      {/* Lab Results & Actions */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-black flex items-center gap-2">
            <Table size={18} /> Lab Test Results Database
          </h3>
          <div className="flex gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-lg border bg-gray-100 font-bold text-black flex items-center gap-1">
              <Download size={12} /> Download CSV
            </button>
            <button className="px-3 py-1.5 rounded-lg border bg-blue-50 font-bold text-blue-600 flex items-center gap-1">
              <Share2 size={12} /> Share with Authorities
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left font-semibold">Sample ID</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Parameter</th>
                <th className="p-3 text-left font-semibold">Result</th>
                <th className="p-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {labResults.map(result => (
                <tr key={result.id}>
                  <td className="p-3 font-mono text-xs text-gray-500">{result.id}</td>
                  <td className="p-3 text-gray-500">{result.date}</td>
                  <td className="p-3 text-black font-semibold">{result.parameter}</td>
                  <td className="p-3">{result.result}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-2xs font-bold ${result.status.includes('Within') ? 'bg-emerald-50 text-emerald-700' : result.status.includes('Low') ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ForecastingDashboard = ({ data, flow24h }) => {
  const pumpWearIndex = data.pumpEfficiency > 0 ? 100 - data.pumpEfficiency : 0;
  const leakProb = data.pumpFlowRate < 400 && data.pumpStatus === 'RUNNING' ? 85 : 5;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <TrendingUp size={28} className="text-fuchsia-600" /> Predictive Maintenance
        </h2>
        <div className="text-sm text-gray-500">AI Confidence: 85%</div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="bg-fuchsia-50 p-4 border-b border-fuchsia-100">
          <h3 className="font-bold text-fuchsia-800 flex items-center gap-2">
            <Wind size={20} /> 1. Flow Pattern Analytics
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flow24h}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: 'Flow (L/m)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="avg" fill="#fae8ff" stroke="none" name="Daily Avg Trend" />
                <Line type="monotone" dataKey="flow" stroke="#d946ef" strokeWidth={2} name="Hourly Fluctuation" dot={false} />
                <Scatter name="Anomalous Event" data={flow24h.filter(d => d.anomaly)} fill="red" shape="cross" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
          <div className="bg-orange-50 p-4 border-b border-orange-100">
            <h3 className="font-bold text-orange-800 flex items-center gap-2">
              <AlertTriangle size={20} /> 2. Fault Prediction Indicators
            </h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-3 rounded-lg border flex flex-col items-center">
              <div className="text-xs font-bold text-gray-500 uppercase mb-2">Leak Probability</div>
              <GaugeChart value={data.predFlowDropPercent} max={100} label="% Risk" color="#ef4444" />
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border flex flex-col items-center">
              <div className="text-xs font-bold text-gray-500 uppercase mb-2">Pump Wear</div>
              <GaugeChart value={data.predEnergySpikePercent} max={100} label="% Wear" color="#f59e0b" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="bg-blue-900 p-4 border-b border-amber-500">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CalendarClock size={20} /> 3. Scheduling
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <CountdownCard title="Pump Service" targetDate={data.nextPumpService} icon={Wrench} />
            <CountdownCard title="Valve Service" targetDate={data.nextValveService} icon={AlertCircle} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsDashboard = ({ data, history, flow24h, alerts, tickets }) => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [comparisonEnabled, setComparisonEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [autoSchedule, setAutoSchedule] = useState(false);

  const templates = [
    { id: 'daily', title: 'Daily Operations Summary', description: 'Production, distribution and complaints snapshot', icon: Clipboard },
    { id: 'weekly', title: 'Weekly Water Supply', description: 'Supply hours vs demand fulfilment', icon: Calendar },
    { id: 'maintenance', title: 'Monthly Maintenance Log', description: 'Work orders and inspections', icon: Wrench },
    { id: 'alerts', title: 'Alert Response Time', description: 'Detection to closure timeline', icon: AlertCircle },
    { id: 'quality', title: 'Water Quality Trends', description: 'pH, turbidity and chlorine compliance', icon: Beaker },
    { id: 'energy', title: 'Energy Consumption', description: 'kWh, peak/off-peak, cost per KL', icon: Zap },
  ];

  const weeklySupplyData = flow24h.slice(0, 7).map((entry, idx) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx],
    supply: Math.round(85 + Math.random() * 15),
    demand: Math.round(90 + Math.random() * 10),
  }));

  const alertResponseData = alerts.slice(0, 5).map((alert, idx) => ({
    name: alert.area || `Zone ${idx + 1}`,
    detection: Math.round(5 + Math.random() * 10),
    dispatch: Math.round(15 + Math.random() * 20),
    resolution: Math.round(30 + Math.random() * 40),
  }));

  const saveSchedule = () => {
    setAutoSchedule(true);
  };

  const exportReport = (format) => {
    setExportFormat(format);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <FileBarChart size={32} className="text-indigo-600" /> Reports & Analytics Studio
          </h2>
          <p className="text-sm text-gray-500">Generate on-demand and scheduled reports with multi-format export</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="text-xs text-gray-500 font-bold uppercase">Date Range</label>
          <div className="flex flex-wrap gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded-xl text-sm" />
            <span className="text-xs text-gray-400 flex items-center">to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded-xl text-sm" />
            <label className="flex items-center gap-2 text-xs font-semibold text-black bg-gray-100 px-3 py-2 rounded-xl">
              <input type="checkbox" checked={comparisonEnabled} onChange={(e) => setComparisonEnabled(e.target.checked)} />
              Compare prev. period
            </label>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map(template => {
          const Icon = template.icon;
          const active = selectedReport === template.id;
          return (
            <button
              key={template.id}
              onClick={() => setSelectedReport(template.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${active ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-black">{template.title}</h3>
              </div>
              <p className="text-xs text-gray-500">{template.description}</p>
            </button>
          );
        })}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-black flex items-center gap-2">
              <BarChart3 size={18} /> Weekly Supply vs Demand
            </h3>
            <span className="text-xs text-gray-400">Liters x 1000</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySupplyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="supply" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Supply" />
                <Bar dataKey="demand" fill="#f97316" radius={[6, 6, 0, 0]} name="Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-black flex items-center gap-2">
              <Activity size={18} /> Alert Response Analysis
            </h3>
            <span className="text-xs text-gray-400">Minutes</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={alertResponseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="detection" stackId="a" fill="#22c55e" name="Detection" />
                <Bar dataKey="dispatch" stackId="a" fill="#3b82f6" name="Dispatch" />
                <Bar dataKey="resolution" stackId="a" fill="#f97316" name="Resolution" />
                <Line type="monotone" dataKey="resolution" stroke="#ef4444" strokeWidth={2} dot />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export & Scheduling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <FileText size={18} /> Export Options
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['pdf', 'excel', 'csv'].map(format => (
              <button
                key={format}
                onClick={() => exportReport(format)}
                className={`py-3 rounded-xl border font-bold text-sm uppercase ${exportFormat === format ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-black'}`}
              >
                {format}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <button className="px-4 py-2 rounded-xl bg-gray-50 border text-black font-bold flex items-center gap-2">
              <Download size={14} /> Download Report
            </button>
            <button className="px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold flex items-center gap-2">
              <Share2 size={14} /> Share with Authorities
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <CalendarClock size={18} /> Automated Scheduling
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" checked={autoSchedule} onChange={(e) => setAutoSchedule(e.target.checked)} />
              Enable scheduled emails
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500 mb-1">Frequency</p>
                <select className="w-full border rounded-xl px-3 py-2">
                  <option>Daily 7:00 AM</option>
                  <option>Weekly Monday</option>
                  <option>Monthly 1st</option>
                </select>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Recipients</p>
                <input type="text" placeholder="ops@district.gov.in" className="w-full border rounded-xl px-3 py-2" />
              </div>
            </div>
            <button onClick={saveSchedule} className="w-full py-3 rounded-full bg-green-600 text-white font-bold text-sm mt-2 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">Save Schedule</button>
          </div>
        </div>
      </div>

      {/* Custom Widgets */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black flex items-center gap-2">
            <LayoutDashboard size={18} /> Custom Dashboard Widgets
          </h3>
          <button className="px-4 py-2 text-xs font-bold rounded-xl border bg-gray-50">Add Widget</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 uppercase mb-2">Population Projection</p>
            <p className="text-3xl font-bold text-black">+4.2%</p>
            <p className="text-xs text-gray-400">Expected demand increase next year</p>
          </div>
          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 uppercase mb-2">Compliance Score</p>
            <p className="text-3xl font-bold text-emerald-600">92%</p>
            <p className="text-xs text-gray-400">Water quality compliance</p>
          </div>
          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 uppercase mb-2">Report Turnaround</p>
            <p className="text-3xl font-bold text-blue-600">14 min</p>
            <p className="text-xs text-gray-400">Average generation time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountabilityDashboard = ({ data, logs, alerts, complaints, responseTimeData }) => {
  const isWaterSafe = data.qualityPH >= 6.5 && data.qualityPH <= 8.5 && data.qualityTurbidity < 5;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black flex items-center gap-2">
        <FileCheck size={28} className="text-slate-600" /> Accountability & Governance
      </h2>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <LayoutDashboard size={20} /> 1. Governance Overview (Today)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-xs text-gray-500 uppercase mb-1">Water Supply</div>
            <div className="text-2xl font-bold text-blue-700">{data.dailySupplyHours.toFixed(1)} <span className="text-sm font-normal">hrs</span></div>
            <div className="text-xs text-blue-400">Target: 4.0 hrs</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="text-xs text-gray-500 uppercase mb-1">Tank Status</div>
            <div className="text-2xl font-bold text-indigo-700">{data.tankLevel.toFixed(0)}%</div>
            <div className="text-xs text-indigo-400">{data.tankLevel > 50 ? 'Good Level' : 'Needs Filling'}</div>
          </div>
          <div className={`p-4 rounded-xl border ${isWaterSafe ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className="text-xs text-gray-500 uppercase mb-1">Quality Status</div>
            <div className={`text-2xl font-bold ${isWaterSafe ? 'text-emerald-700' : 'text-red-700'}`}>{isWaterSafe ? 'SAFE' : 'UNSAFE'}</div>
          </div>
          <div className={`p-4 rounded-xl border ${alerts.length === 0 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="text-xs text-gray-500 uppercase mb-1">Active Alerts</div>
            <div className="text-2xl font-bold text-black">{alerts.length}</div>
            <div className="text-xs text-gray-500">Pending Resolution</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
            <Users size={20} /> 2. Operator Audit Log
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 sticky top-0">
                <tr>
                  <th className="p-2">Time</th>
                  <th className="p-2">Operator</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map(log => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-xs">{log.timestamp.split(',')[1]}</td>
                    <td className="p-2 font-medium text-blue-600">{log.operator}</td>
                    <td className="p-2 text-black">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const GISDashboard = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <Map size={28} className="text-emerald-600" /> GIS Mapping & Pipeline Network
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex justify-between items-center">
            <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-2">
              <MapPin size={16} /> Pipeline Network View (Padur, Chennai)
            </h3>
            <span className="text-xs bg-white px-2 py-1 rounded border text-emerald-600 font-bold">Interactive Map</span>
          </div>

          <div className="flex-1 relative bg-slate-100">
            <PipelineMapViewer
              pipelineData={samplePipelineData}
              infrastructureData={sampleInfrastructureData}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm flex flex-col">
          <div className="bg-red-50 p-4 border-b border-red-100">
            <h3 className="font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle size={18} /> Active Hazard Registry
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {HAZARD_LOGS.map(hazard => (
              <div key={hazard.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-black">{hazard.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${hazard.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {hazard.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin size={10} /> {hazard.area}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EnergyDashboard = ({ data, history }) => {
  const electricityRate = 7.25; // ₹ per kWh
  const pumpPowerKW = Number(data.pumpPower ?? 0);
  const pumpEfficiency = Number(data.pumpEfficiency ?? 0);
  const powerFactor = Number(data.powerFactor ?? 0);
  const dailyEnergyKWh = Number(data.dailyEnergyKWh ?? 0);
  const dailyWaterLiters = Number(data.dailyWaterDistributed ?? 20000);
  const dailyEnergyCost = dailyEnergyKWh * electricityRate;
  const monthlyEnergyCost = dailyEnergyCost * 30;
  const energyPerKL = dailyWaterLiters > 0 ? (dailyEnergyKWh / (dailyWaterLiters / 1000)).toFixed(2) : '0.00';
  const carbonFactor = 0.82; // kg CO2 per kWh
  const carbonFootprint = (dailyEnergyKWh * carbonFactor).toFixed(1);

  const energyTrend = history.slice(-24).map((point, idx) => {
    const load = Number(point.pumpPower ?? 0);
    return {
      ...point,
      pumpPower: load,
      hour: `${idx + 1}`,
      peak: idx >= 8 && idx <= 18 ? load + 2 : Math.max(0, load - 1),
    };
  });

  const peakData = [
    { name: 'Peak (6 AM - 10 PM)', value: 65, color: '#f97316' },
    { name: 'Off-Peak', value: 35, color: '#3b82f6' },
  ];

  const recommendations = [
    'Shift backwash cycles to off-peak hours',
    'Clean pump suction filters to improve efficiency',
    'Tune VFD profiles for booster pumps',
    'Calibrate flow meters to reduce over-pumping',
  ];

  const renewableContribution = {
    solar: 18, grid: 72, generator: 10,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <Zap size={32} className="text-amber-500" /> Energy & Power Intelligence
          </h2>
          <p className="text-sm text-gray-500">Track consumption, costs, efficiency and sustainability metrics</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">Motor Efficiency {pumpEfficiency.toFixed(0)}%</span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">Power Factor {powerFactor.toFixed(2)}</span>
          <span className="px-3 py-1 rounded-full bg-gray-50 text-black">Load {pumpPowerKW.toFixed(1)} kW</span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border-2 border-amber-100 bg-amber-50/60">
          <p className="text-xs text-amber-700 font-bold uppercase">Real-time Consumption</p>
          <p className="text-4xl font-black text-amber-600">{pumpPowerKW.toFixed(1)}<span className="text-lg font-normal"> kW</span></p>
          <p className="text-xs text-amber-700">Live motor load</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-green-200 bg-green-50/60">
          <p className="text-xs text-green-800 font-bold uppercase">Daily Energy</p>
          <p className="text-4xl font-black text-green-700">{dailyEnergyKWh.toFixed(1)}<span className="text-lg font-normal"> kWh</span></p>
          <p className="text-xs text-green-800">₹ {dailyEnergyCost.toFixed(0)} per day</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/60">
          <p className="text-xs text-emerald-700 font-bold uppercase">Energy per KL</p>
          <p className="text-4xl font-black text-emerald-600">{energyPerKL}<span className="text-lg font-normal"> kWh/kL</span></p>
          <p className="text-xs text-emerald-700">Benchmark: 0.45</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-700 font-bold uppercase">Carbon Footprint</p>
          <p className="text-4xl font-black text-slate-700">{carbonFootprint}<span className="text-lg font-normal"> kg CO₂</span></p>
          <p className="text-xs text-slate-500">Scope-2 daily emissions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black flex items-center gap-2">
              <Activity size={18} /> 24h Energy Load & Peak Analysis
            </h3>
            <span className="text-xs text-gray-400">kW</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pumpPower" stroke="#f59e0b" fillOpacity={0.3} fill="#f59e0b" name="Actual Load" />
                <Line type="monotone" dataKey="peak" stroke="#ef4444" strokeWidth={2} name="Peak Threshold" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <PieChartIcon size={18} /> Peak vs Off-Peak Usage
          </h3>
          <div className="flex flex-col items-center">
            <PieChart width={220} height={220}>
              <Pie
                data={peakData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {peakData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="flex flex-col gap-2 text-xs text-black">
              {peakData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-bold">{item.name}</span> <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cost & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <DollarSign size={18} /> Cost & Efficiency Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">Daily Operating Cost</p>
              <p className="text-2xl font-bold text-black">₹ {dailyEnergyCost.toFixed(0)}</p>
              <p className="text-xs text-gray-400">Based on current tariff</p>
            </div>
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">Monthly Projection</p>
              <p className="text-2xl font-bold text-blue-600">₹ {monthlyEnergyCost.toLocaleString()}</p>
              <p className="text-xs text-gray-400">At current load</p>
            </div>
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">Benchmark Comparison</p>
              <p className="text-2xl font-bold text-emerald-600">{energyPerKL} kWh/kL</p>
              <p className="text-xs text-emerald-600">State Avg 0.55</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Energy-Saving Recommendations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {recommendations.map(rec => (
                <div key={rec} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800 flex items-center gap-2">
                  <Leaf size={16} /> {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-black flex items-center gap-2">
            <Sun size={18} /> Renewable & Backup Status
          </h3>
          <div className="text-xs text-gray-500">
            <p>Solar Contribution</p>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-yellow-400" style={{ width: `${renewableContribution.solar}%` }}></div>
            </div>
            <p className="mt-1 text-black font-bold">{renewableContribution.solar}% of daily demand</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border rounded-xl p-3 bg-gray-50">
              <p className="text-gray-500">Grid Uptime</p>
              <p className="text-xl font-bold text-black">98.7%</p>
            </div>
            <div className="border rounded-xl p-3 bg-gray-50">
              <p className="text-gray-500">Generator Fuel</p>
              <p className="text-xl font-bold text-amber-600">74%</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p>Backup Readiness</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700">Generator - READY</span>
              <span className="px-2 py-1 rounded-full text-2xs font-bold bg-blue-50 text-blue-700">Battery - 3.5h</span>
            </div>
          </div>
          <button className="w-full py-2 rounded-xl bg-gray-100 text-black text-xs font-bold">Download Energy Report</button>
        </div>
      </div>

      {/* Load Shedding & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Calendar size={18} /> Load Shedding Schedule
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { window: '06:00 - 07:00', impact: 'Auto start generator', status: 'Mitigated' },
              { window: '14:00 - 15:30', impact: 'Reduce booster speed', status: 'Upcoming' },
              { window: '22:00 - 23:00', impact: 'Shift flushing operations', status: 'Planned' },
            ].map(slot => (
              <div key={slot.window} className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-black">{slot.window}</p>
                  <p className="text-xs text-gray-500">{slot.impact}</p>
                </div>
                <span className={`text-2xs font-bold px-3 py-1 rounded-full ${slot.status === 'Mitigated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{slot.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Gauge size={18} /> Comparison with Similar Systems
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Energy / kL</span>
              <span className="font-bold text-black">{energyPerKL} vs 0.55 (State Avg)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Peak Demand</span>
              <span className="font-bold text-black">{pumpPowerKW.toFixed(1)} kW vs 45 kW</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Solar Contribution</span>
              <span className="font-bold text-black">{renewableContribution.solar}% vs 12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Generator Runtime</span>
              <span className="font-bold text-black">2.5h vs 3.0h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketingDashboard = ({ tickets, resolveTicket, data }) => {
  const [filter, setFilter] = useState('All');
  const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <Ticket size={28} className="text-blue-600" /> User Complaint Help Desk
        </h2>
        <button className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95">
          <PlusCircle size={16} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex gap-2 items-center">
            <Filter size={16} className="text-gray-500" />
            {['All', 'Open', 'Resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-green-100 text-green-800 border border-green-600' : 'text-black hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="p-4 font-semibold">Ticket ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Issue</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTickets.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-500 text-xs font-bold">{t.id}</td>
                    <td className="p-4 text-black text-xs">{t.date}</td>
                    <td className="p-4 font-medium">{t.user}</td>
                    <td className="p-4 text-black max-w-xs truncate">{t.issue}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${t.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : t.priority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${t.status === 'Open' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {t.status === 'Open' && (
                        <button
                          onClick={() => resolveTicket(t.id)}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-1 ml-auto shadow-sm transition-all"
                        >
                          <CheckSquare size={12} /> Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={20} /> System Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-700 font-bold flex items-center gap-2"><AlertCircle size={16} /> Open High Priority</span>
                <span className="text-xl font-bold text-red-800">{tickets.filter(t => t.status === 'Open' && t.priority === 'High').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-800 font-bold flex items-center gap-2"><Ticket size={16} /> Total Open</span>
                <span className="text-xl font-bold text-green-900">{tickets.filter(t => t.status === 'Open').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Star size={20} /> Community Sentiment
            </h3>
            <div className="text-center py-4">
              <div className="text-5xl font-black text-yellow-500">{data.communityFeedbackScore}</div>
              <div className="flex justify-center gap-1 mt-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={24} fill={s <= Math.round(data.communityFeedbackScore) ? "#eab308" : "#e5e7eb"} className={s <= Math.round(data.communityFeedbackScore) ? "text-yellow-500" : "text-gray-200"} />
                ))}
              </div>
              <div className="text-xs text-gray-500">Based on recent ticket resolutions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PARENT ---

const MainDashboard = ({ data, history, flow24h, alerts, logs, togglePump, toggleValve, forceAnomaly, activeTab, setActiveTab, user, logInspection, logWaterTest, complaints, responseTimeData, tickets, resolveTicket, language, offlineMode, lastSync, systemState, onTogglePump, onToggleValve, onSchedulePumpTimer, onSchedulePumpStop, onCancelPumpSchedule }) => {
  const { t } = useTranslation();
  const userRole = user?.role || 'technician';

  // --- TAB RENDERING ---
  if (activeTab === 'infrastructure') return <InfrastructureDashboard
    data={data}
    history={history}
    systemState={systemState}
    onTogglePump={onTogglePump}
    onToggleValve={onToggleValve}
    onSchedulePumpTimer={onSchedulePumpTimer}
    onSchedulePumpStop={onSchedulePumpStop}
    onCancelPumpSchedule={onCancelPumpSchedule}
  />;

  if (activeTab === 'daily') return <DailyOperationDashboard data={data} user={user} logInspection={logInspection} history={history} systemState={systemState} />;
  if (activeTab === 'quality') return <WaterQualityDashboard data={data} logWaterTest={logWaterTest} systemState={systemState} />;
  if (activeTab === 'forecasting') return <ForecastingDashboard data={data} flow24h={flow24h} systemState={systemState} />;
  if (activeTab === 'reports') return <ReportsDashboard data={data} history={history} flow24h={flow24h} alerts={alerts} tickets={tickets} systemState={systemState} />;
  if (activeTab === 'accountability') return <AccountabilityDashboard data={data} logs={logs} alerts={alerts} complaints={complaints} responseTimeData={responseTimeData} systemState={systemState} />;

  if (activeTab === 'gis') {
    return <GISDashboard systemState={systemState} />;
  }

  if (activeTab === 'energy') return <EnergyDashboard data={data} history={history} systemState={systemState} />;
  if (activeTab === 'ticketing') return <TicketingDashboard tickets={tickets} resolveTicket={resolveTicket} data={data} systemState={systemState} />;

  // Detail pages
  if (activeTab === 'pump-details') {
    return <PumpDetails onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'tank-details') {
    return <WaterTankDetails onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'pipelines-overview') {
    return <PipelinesOverview
      onBack={() => setActiveTab('overview')}
      onNavigateToPipeline={(tab) => setActiveTab(tab)}
    />;
  }

  if (activeTab?.startsWith('pipeline-details-')) {
    const pipelineId = activeTab.replace('pipeline-details-', '');
    return <PipelineDetails pipelineId={pipelineId} onBack={() => setActiveTab('pipelines-overview')} />;
  }

  // --- ROLE-BASED OVERVIEW DASHBOARD ---
  if (userRole === 'public') {
    return <GuestDashboard language={language} t={t} offlineMode={offlineMode} lastSync={lastSync} />;
  }

  // Researchers get analytics and data export tools
  if (userRole === 'researcher') {
    return <ResearcherDashboard sensors={data} systemState={simulation.state} history={history} />;
  }

  // Technicians get full operational dashboard (default)
  if (userRole === 'technician' && activeTab === 'overview') {
    return (
      <TechnicianDashboard
        sensors={data}
        offlineMode={offlineMode}
        lastSync={lastSync}
        activeView={activeTab}
        setActiveView={setActiveTab}
        systemState={systemState}
      />
    );
  }

  // --- OVERVIEW DASHBOARD (Fallback) ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">{t('nav.console')}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <WifiOff size={14} /> Offline-First Mode Active
          </p>
        </div>
        <div className="flex gap-2">
          {/* Feature: Next Supply Card */}
          <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-500 text-amber-900 text-xs font-bold flex items-center gap-2">
            <Clock size={14} />
            <div>
              <div className="uppercase opacity-70 text-2xs">{t('metrics.nextSupply')}</div>
              <div className="text-sm">{getNextDistributionTime()}</div>
            </div>
          </div>
          {/* Only Tech/Research can force anomalies */}
          {userRole === 'technician' && (
            <button onClick={() => forceAnomaly('LEAK')} className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs font-bold border border-red-200">
              Simulate Leak
            </button>
          )}
        </div>
      </div>

      {/* CRITICAL METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label={t('metrics.pumpStatus')} value={data.pumpStatus} unit="" icon={Power} />
        <StatCard label={t('metrics.flowRate')} value={data.pumpFlowRate} unit="L/min" icon={Wind} />
        <StatCard label={t('metrics.pressure')} value={data.pipePressure} unit="Bar" icon={Activity} />
        <StatCard label={t('metrics.tankLevel')} value={data.tankLevel} unit="%" icon={Droplet} />
        <StatCard label={t('metrics.tds')} value={data.qualityTDS} unit="ppm" icon={Layers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CHART + ENERGY OVERLAY */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Activity size={20} /> {t('nav.overview')} - Real-time
            </h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="text-amber-600 flex items-center gap-1"><Zap size={12} /> {data.pumpPower.toFixed(1)} kW</span>
              <span className="text-red-600 flex items-center gap-1"><Thermometer size={12} /> {data.pumpMotorTemp.toFixed(1)}°C</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 8]} />
                <Tooltip />
                <Area type="monotone" dataKey="pipePressure" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GIS ALERT FEED WIDGET */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
            <MapPin size={18} className="text-emerald-600" /> GIS Alert Feed
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {HAZARD_LOGS.slice(0, 3).map(log => (
              <div key={log.id} className="p-3 bg-gray-50 border rounded-lg text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-red-700">{log.type}</span>
                  <span className="text-xs text-gray-500">{log.time.split(',')[1]}</span>
                </div>
                <div className="text-xs text-black flex items-center gap-1">
                  <MapPin size={10} /> {log.area}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('gis')}
            className="mt-4 w-full py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded hover:bg-emerald-100 transition-colors"
          >
            {t('actions.viewFullMap')}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- APP SHELL ---

const App = () => {
  // Get auth and language from context
  const { user, login, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { offlineMode, lastSync } = useOffline();
  const { t } = useTranslation();

  // Local component states
  const [activeTab, setActiveTab] = useState('overview');

  // Accessibility States
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState('normal'); // 'small', 'normal', 'large', 'xlarge'
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
  }, [highContrast]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'normal';
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);

  // Use Live Simulation Data - appears as real IoT data
  const simulation = useSimulationData(true); // Auto-start enabled

  // Transform simulation state to match existing data structure
  const transformStateToData = (state) => {
    const defaultData = {
      pumpStatus: 'OFF',
      pumpFlowRate: 0,
      pipePressure: 0,
      tankLevel: 0,
      pumpPower: 0,
      pumpMotorTemp: 25,
      pumpRunningHours: 0,
      pumpEfficiency: 85,
      powerFactor: 0.95,
      qualityTDS: 0,
      qualityPH: 7,
      qualityTurbidity: 0,
      qualityChlorine: 0,
      qualityTemperature: 26,
      qualityColiform: 0,
      lastInspectionDate: '--',
      lastInspectionOperator: 'TECH-OPS-01',
      lastWaterTest: '--',
      dailyEnergyKWh: 0,
      dailyWaterDistributed: 0,
      predFlowDropPercent: 5,
      predEnergySpikePercent: 5,
      nextPumpService: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextValveService: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      flowRate: 0,
      pressure: 0,
      powerConsumption: 0,
      turbidity: 0,
      chlorine: 0,
      pH: 7,
      efficiency: 0,
      leakage: 0,
      communityFeedbackScore: 4.2,
      dailySupplyHours: 4.5,
      pipelineQualities: [],
      pumpSchedule: {
        mode: 'MANUAL',
        timerRemainingMs: 0,
        timerEnd: null
      },
      pumpScheduleMode: 'MANUAL',
      pumpScheduleRemainingMs: 0,
      pumpScheduleStopsAt: null,
    };

    if (!state) return defaultData;

    const tank = state.overheadTank || {};
    const pump = state.pumpHouse || {};
    const metrics = state.systemMetrics || {};
    const quality = tank.waterQuality || {};
    const pipelines = state.pipelines || [];
    const pumpSchedule = state.pumpSchedule || {};

    const runtimeHours = pump.pumpStatus === 'ON' ? 10 : 6;
    const avgFlow = metrics.totalFlowRate || pump.pumpFlowOutput || 0;
    const pumpLoad = pump.powerConsumption || 0;

    const dailyEnergyKWh = formatMetric(pumpLoad * runtimeHours, 1, 0);
    const dailyWaterDistributed = Math.max(5000, Math.round(avgFlow * 60 * runtimeHours));
    const predFlowDropPercent = Math.min(95, Math.max(5, (metrics.totalLeakage || 0) * 2));
    const predEnergySpikePercent = Math.min(
      95,
      Math.max(5, pump.motorTemperature ? (pump.motorTemperature - 25) * 2 : 15)
    );

    const formatDate = (date) =>
      new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);

    const pipelineQualities = pipelines.map(pipeline => {
      const inletQuality = pipeline.inlet?.qualitySensor || {};
      const outletQuality = pipeline.outlet?.qualitySensor || {};
      const shortName = pipeline.pipelineName?.split(' - ').pop() || `Pipeline ${pipeline.pipelineId}`;

      return {
        pipelineId: pipeline.pipelineId,
        pipelineName: pipeline.pipelineName || `Pipeline ${pipeline.pipelineId}`,
        shortName,
        valveStatus: pipeline.valveStatus,
        deviation: formatMetric(pipeline.qualityDeviation ?? 0, 1, 0),
        inlet: {
          turbidity: formatMetric(inletQuality.turbidity ?? quality.turbidity, 2, quality.turbidity),
          pH: formatMetric(inletQuality.pH ?? quality.pH, 2, quality.pH),
          chlorine: formatMetric(inletQuality.chlorine ?? quality.chlorine, 2, quality.chlorine),
          TDS: formatMetric(inletQuality.TDS ?? quality.TDS, 0, quality.TDS),
        },
        outlet: {
          turbidity: formatMetric(outletQuality.turbidity ?? inletQuality.turbidity ?? quality.turbidity, 2, quality.turbidity),
          pH: formatMetric(outletQuality.pH ?? inletQuality.pH ?? quality.pH, 2, quality.pH),
          chlorine: formatMetric(outletQuality.chlorine ?? inletQuality.chlorine ?? quality.chlorine, 2, quality.chlorine),
          TDS: formatMetric(outletQuality.TDS ?? inletQuality.TDS ?? quality.TDS, 0, quality.TDS),
        },
      };
    });

    return {
      ...defaultData,
      pumpStatus: pump.pumpStatus || 'OFF',
      pumpFlowRate: pump.pumpFlowOutput || 0,
      pipePressure: pump.pumpPressureOutput || 0,
      tankLevel: tank.tankLevel || 0,
      pumpPower: pumpLoad,
      pumpMotorTemp: pump.motorTemperature || 25,
      pumpRunningHours: pump.pumpRunningHours || 0,
      pumpEfficiency: pump.pumpEfficiency ?? 85,
      powerFactor: pump.powerFactor ?? 0.95,
      qualityTDS: quality.TDS || 0,
      qualityPH: quality.pH || 7,
      qualityTurbidity: quality.turbidity || 0,
      qualityChlorine: quality.chlorine || 0,
      qualityTemperature: tank.temperature ?? 26,
      qualityColiform: quality.coliform ?? 0,
      lastInspectionDate: formatDate(new Date()),
      lastInspectionOperator: 'TECH-OPS-01',
      lastWaterTest: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      dailyEnergyKWh,
      dailyWaterDistributed,
      predFlowDropPercent,
      predEnergySpikePercent,
      nextPumpService: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextValveService: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      pipelineQualities,
      // Additional fields for compatibility
      flowRate: avgFlow,
      pressure: pump.pumpPressureOutput || 0,
      powerConsumption: pumpLoad,
      turbidity: quality.turbidity || 0,
      chlorine: quality.chlorine || 0,
      pH: quality.pH || 7,
      efficiency: metrics.systemEfficiency || 0,
      leakage: metrics.totalLeakage || 0,
      pumpSchedule,
      pumpScheduleMode: pumpSchedule.mode || 'MANUAL',
      pumpScheduleRemainingMs: pumpSchedule.timerRemainingMs || 0,
      pumpScheduleStopsAt: pumpSchedule.timerEnd ? new Date(pumpSchedule.timerEnd).toISOString() : null,
    };
  };

  const data = transformStateToData(simulation.state);

  // Create history data from simulation
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (simulation.state) {
      const pump = simulation.state.pumpHouse || {};
      const tank = simulation.state.overheadTank || {};

      const newHistoryPoint = {
        time: new Date().toLocaleTimeString(),
        pipePressure: pump.pumpPressureOutput || 0,
        flowRate: pump.pumpFlowOutput || 0,
        tankLevel: tank.tankLevel || 0,
        pumpPower: pump.powerConsumption || 0,
      };
      setHistory(prev => {
        const updated = [...prev, newHistoryPoint];
        return updated.slice(-20); // Keep last 20 points
      });
    }
  }, [simulation.state?.lastUpdated]);

  // Flow 24h data
  const flow24h = history.map((h, i) => ({
    hour: i,
    flow: h.flowRate || 0,
  }));

  // Alerts from simulation
  const alerts = simulation.alerts || [];

  // Logs (empty for now, can be enhanced)
  const logs = [];

  // Control functions from simulation
  const handleTogglePump = () => {
    simulation.togglePump();
  };

  const handleToggleValve = (pipelineId) => {
    simulation.toggleValve(pipelineId);
  };

  // Keep old functions for compatibility
  const togglePump = handleTogglePump;
  const toggleValve = handleToggleValve;
  const forceAnomaly = () => { };
  const setData = () => { };
  const logInspection = () => { }; // Can be enhanced
  const logWaterTest = () => { }; // Can be enhanced
  const mlPrediction = null; // Can be enhanced
  const complaints = []; // Can be enhanced
  const responseTimeData = []; // Can be enhanced
  const tickets = []; // Can be enhanced
  const resolveTicket = () => { }; // Can be enhanced

  const handleLogin = (userData, selectedLanguage) => {
    login(userData);
    changeLanguage(selectedLanguage);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('overview');
  };

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => (
    <MainDashboard
      data={data}
      history={history}
      flow24h={flow24h}
      alerts={alerts}
      logs={logs}
      togglePump={togglePump}
      toggleValve={toggleValve}
      forceAnomaly={forceAnomaly}
      activeTab={activeTab}
      activeView={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      logInspection={logInspection}
      logWaterTest={logWaterTest}
      complaints={complaints}
      responseTimeData={responseTimeData}
      tickets={tickets}
      resolveTicket={resolveTicket}
      language={language}
      offlineMode={offlineMode}
      lastSync={lastSync}
      systemState={simulation.state}
      onTogglePump={simulation.togglePump}
      onToggleValve={simulation.toggleValve}
      onSchedulePumpTimer={simulation.schedulePumpTimer}
      onSchedulePumpStop={simulation.schedulePumpStop}
      onCancelPumpSchedule={simulation.cancelPumpSchedule}
    />
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${highContrast ? 'contrast-150' : ''
        } ${reducedMotion ? '[&_*]:transition-none [&_*]:animate-none' : ''
        }`}
    >
      {/* Top Navbar - Matching Login Page Design */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 shadow-2xl border-b-4 border-amber-500">
        {/* Main Navigation Bar */}
        <div className="max-w-full mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6">

            {/* Left Section: Logos & Branding */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Jalsense Logo */}
              <div className="bg-white rounded-xl shadow-xl p-3 border-4 border-amber-500 transform hover:scale-110 transition-all duration-300">
                <img
                  src={jalsenseLogoUrl}
                  alt="Jalsense Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Panchayat Info */}
              <div className="hidden xl:flex flex-col bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border-l-4 border-amber-500 shadow-lg">
                <div className="flex items-center gap-2">
                  <Landmark size={14} className="text-amber-400" />
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Gram Panchayat
                  </div>
                </div>
                <div className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shivpur</div>
              </div>
            </div>

            {/* Center Section: Primary Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-4xl">
              {user.role === 'public' ? (
                <>
                  <button
                    onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'overview'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Activity size={16} />
                    <span>{t('nav.overview')}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('energy'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'energy'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Zap size={16} />
                    <span>{t('nav.energy')}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('ticketing'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'ticketing'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Ticket size={16} />
                    <span>{t('nav.ticketing')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'overview'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Activity size={16} />
                    <span className="hidden xl:inline">{t('nav.overview')}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('quality'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'quality'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <FlaskConical size={16} />
                    <span className="hidden xl:inline">{t('nav.quality')}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <TrendingUp size={16} />
                    <span className="hidden xl:inline">{t('nav.analytics')}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('gis'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${activeTab === 'gis'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
                      }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Map size={16} />
                    <span className="hidden xl:inline">{t('nav.gis')}</span>
                  </button>
                </>
              )}
            </nav>

            {/* Right Section: Mobile Menu Toggle Only */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 transition-all duration-300 text-white transform hover:scale-110 shadow-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed User Menu Button - Bottom Left */}
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-2xl border-4 border-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
        title="User Menu"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-700 font-black text-lg shadow-lg">
            {user.name.charAt(0)}
          </div>
          {offlineMode && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
              <WifiOff size={10} className="text-white" />
            </div>
          )}
        </div>
      </button>

      {/* User Menu Popup */}
      {showUserMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowUserMenu(false)}
          />

          {/* Menu Panel */}
          <div className="fixed bottom-24 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border-4 border-green-600 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 p-6 border-b-4 border-amber-500">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-black text-2xl shadow-xl border-4 border-white">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-black text-white uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>{user.name}</p>
                  <p className="text-sm capitalize text-amber-400 font-bold">{user.role}</p>
                </div>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="text-white/60 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {/* Language Selector */}
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <label className="block text-xs font-black text-blue-950 uppercase mb-2 tracking-widest flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <Languages size={14} /> {t('language.selectorLabel')}
                </label>
                <LanguageSelector size="sm" hideLabel={false} />
              </div>

              {/* Accessibility Button */}
              <button
                onClick={() => {
                  setShowAccessibility(!showAccessibility);
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border-2 border-amber-300 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105"
              >
                <Settings size={20} className="text-amber-600" />
                <span className="text-sm font-bold text-amber-900 uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {t('accessibility.button')}
                </span>
              </button>

              {/* Offline Status */}
              {offlineMode && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500 text-white">
                  <WifiOff size={20} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide">{t('offline.mode')}</p>
                    <p className="text-xs opacity-90">Last sync: {lastSync}</p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-xl"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <LogOut size={20} />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </>
      )}   {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Activity size={18} /> {t('nav.overview')}
            </button>
            <button onClick={() => { setActiveTab('infrastructure'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'infrastructure' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Server size={18} /> {t('nav.infrastructure')}
            </button>
            <button onClick={() => { setActiveTab('operations'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'operations' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <ClipboardList size={18} /> {t('nav.operations')}
            </button>
            <button onClick={() => { setActiveTab('maintenance'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'maintenance' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Wrench size={18} /> {t('nav.maintenance')}
            </button>
            <button onClick={() => { setActiveTab('finance'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'finance' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <DollarSign size={18} /> {t('nav.finance')}
            </button>
            <button onClick={() => { setActiveTab('quality'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'quality' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <FlaskConical size={18} /> {t('nav.quality')}
            </button>
            <button onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <TrendingUp size={18} /> {t('nav.analytics')}
            </button>
            <button onClick={() => { setActiveTab('calendar'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Calendar size={18} /> {t('nav.calendar')}
            </button>
            <button onClick={() => { setActiveTab('help-desk'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'help-desk' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Ticket size={18} /> {t('nav.helpDesk')}
            </button>
            <button onClick={() => { setActiveTab('gis'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'gis' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Map size={18} /> {t('nav.gis')}
            </button>
            <button onClick={() => { setActiveTab('energy'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'energy' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Zap size={18} /> {t('nav.energy')}
            </button>

            {/* Mobile: Logout Button */}
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all mt-4">
              <LogOut size={18} /> {t('nav.logout')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="flex-1 p-6 bg-gray-50">
        <Suspense fallback={<div className="text-center text-gray-500 py-20">Loading dashboard...</div>}>
          {renderContent()}
        </Suspense>
      </div>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-green-600 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-6 border-b-4 border-amber-500 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase tracking-wide flex items-center gap-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <Settings size={28} className="text-amber-400" /> Accessibility Settings
              </h2>
              <button
                onClick={() => setShowAccessibility(false)}
                className="text-white hover:text-amber-400 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Text Size Slider */}
              <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {t('accessibility.textSize')}
                  </label>
                  <span className="text-sm font-bold text-gray-700">{(textSize * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={textSize}
                  onChange={(e) => setTextSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold">
                  <span>A-</span>
                  <span>A+</span>
                </div>
              </div>

              {/* Dark Mode */}
              <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {t('accessibility.darkMode')}
                  </label>
                  <p className="text-xs text-black">{t('accessibility.darkModeHint')}</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-16 h-8 rounded-full transition-all duration-300 relative ${darkMode ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${darkMode ? 'transform translate-x-8' : ''
                    }`}></div>
                </button>
              </div>

              {/* High Contrast */}
              <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {t('accessibility.highContrast')}
                  </label>
                  <p className="text-xs text-black">{t('accessibility.highContrastHint')}</p>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-16 h-8 rounded-full transition-all duration-300 relative ${highContrast ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${highContrast ? 'transform translate-x-8' : ''
                    }`}></div>
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {t('accessibility.reducedMotion')}
                  </label>
                  <p className="text-xs text-black">{t('accessibility.reducedMotionHint')}</p>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-16 h-8 rounded-full transition-all duration-300 relative ${reducedMotion ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${reducedMotion ? 'transform translate-x-8' : ''
                    }`}></div>
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-600">
                <p className="text-sm text-blue-900 font-semibold">
                  ℹ️ These settings help make the platform more accessible for users with visual impairments or motion sensitivity.
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setTextSize('normal');
                  setDarkMode(false);
                  setHighContrast(false);
                  setReducedMotion(false);
                }}
                className="w-full py-3 rounded-full bg-gray-600 text-white font-black uppercase tracking-widest hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      <VoiceAssistant data={data} alerts={alerts} />
    </div>
  );
};

export default App;
