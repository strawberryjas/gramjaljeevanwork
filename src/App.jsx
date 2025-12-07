import React, { Suspense, lazy, useEffect, useState, useRef, useMemo } from 'react';
import {
  Activity,
  Droplet,
  AlertTriangle,
  Wind,
  Zap,
  Clipboard,
  LogOut,
  MapPin,
  Clock,
  WifiOff,
  Server,
  Layers,
  ClipboardList,
  PenTool,
  Wrench,
  DollarSign,
  FlaskConical,
  Beaker,
  Microscope,
  TrendingUp,
  CalendarClock,
  Calendar,
  AlertCircle,
  Users,
  Star,
  FileCheck,
  LayoutDashboard,
  Table,
  FileText,
  Thermometer,
  Power,
  Map,
  Ticket,
  CheckSquare,
  Filter,
  PlusCircle,
  X,
  Languages,
  Landmark,
  Play,
  Square,
  Settings,
  Download,
  FileBarChart,
  Upload,
  Share2,
  Leaf,
  Sun,
  Gauge,
  BarChart3,
  PieChart as PieChartIcon,
  Menu,
  Search,
  ArrowLeft,
  ArrowRight,
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
  ComposedChart,
  Legend,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Import shared components
import { LoginScreen } from './components/auth/LoginScreen';
import { VoiceAssistant } from './components/VoiceAssistant';
import { StatCard } from './components/shared/StatCard';
import { GaugeChart } from './components/shared/GaugeChart';
import { QualityCard } from './components/shared/QualityCard';
import { CountdownCard } from './components/shared/CountdownCard';
import { PipelineMapViewer } from './components/PipelineMapViewer';
import { Navigation } from './components/Navigation';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import MaintenanceCard from './components/shared/MaintenanceCard';
import { SidebarNavigation } from './components/SidebarNavigation';
import IconImage from './components/IconImage';
import { TabbedPanel, CardSection, MetricCard } from './components/CardLayout';
import {
  NotificationContainer,
  ConfirmationDialog,
  RecentActionsLog,
  useNotifications,
  useActionLog,
} from './components/ActionFeedback';
import { PumpToggle, ValveToggle, TankValveToggle, ToggleSwitch } from './components/ToggleSwitch';
import {
  AnimatedButton,
  InteractiveCard,
  StatusBadge,
  AnimatedProgressBar,
} from './components/AnimatedInteractions';
const GuestDashboard = lazy(() =>
  import('./components/dashboards/GuestDashboard').then((module) => ({
    default: module.GuestDashboard,
  }))
);
const TechnicianDashboard = lazy(() =>
  import('./components/dashboards/TechnicianDashboard').then((module) => ({
    default: module.TechnicianDashboard,
  }))
);
const ResearcherDashboard = lazy(() =>
  import('./components/dashboards/ResearcherDashboard').then((module) => ({
    default: module.ResearcherDashboard,
  }))
);
const ServiceRequestDashboard = lazy(() =>
  import('./components/dashboards/ServiceRequestDashboard').then((module) => ({
    default: module.ServiceRequestDashboard,
  }))
);
const ComplaintSubmission = lazy(() =>
  import('./components/dashboards/ComplaintSubmission').then((module) => ({
    default: module.ComplaintSubmission,
  }))
);
const ControlCenter = lazy(() =>
  import('./components/dashboards/ControlCenter').then((module) => ({
    default: module.ControlCenter,
  }))
);
const MaintenanceDashboard = lazy(() =>
  import('./components/dashboards/MaintenanceDashboard').then((module) => ({
    default: module.default,
  }))
);
const PumpDetails = lazy(() =>
  import('./components/dashboards/PumpDetails').then((module) => ({
    default: module.PumpDetails,
  }))
);
const PipelineDetails = lazy(() =>
  import('./components/dashboards/PipelineDetails').then((module) => ({
    default: module.PipelineDetails,
  }))
);
const WaterTankDetails = lazy(() =>
  import('./components/dashboards/WaterTankDetails').then((module) => ({
    default: module.WaterTankDetails,
  }))
);
const PipelinesOverview = lazy(() =>
  import('./components/dashboards/PipelinesOverview').then((module) => ({
    default: module.PipelinesOverview,
  }))
);
const ValvesDashboard = lazy(() =>
  import('./components/dashboards/ValvesDashboard').then((module) => ({
    default: module.ValvesDashboard,
  }))
);

// Import utilities and constants
import { HAZARD_LOGS } from './constants/mockData';
import { LANGUAGES } from './constants/translations';
import {
  transformStateToData,
  toLocalInputString,
  formatMetric,
  formatDurationLabel,
} from './utils/appUtils';
import { getNextDistributionTime } from './utils/helpers';
import { samplePipelineData, sampleInfrastructureData } from './data/samplePipelineData';

// Import hooks
import { useSimulationData } from './hooks/useSimulationData';
import { useAuth, useLanguage, useOffline } from './hooks/useAppState';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './components/LanguageSelector';
import { LanguageSelectorDropdown } from './components/LanguageSelectorDropdown';

const ministryLogoUrl = '/ministry-logo.svg';
const jalsenseLogoUrl = '/jalsense-logo.svg';
const ALERT_TYPE_TO_TAB = {
  LEAKAGE: 'pipeline',
  PRESSURE: 'pipeline',
  QUALITY: 'quality',
  PUMP_TIMER: 'pump-station',
  TANK_LOW: 'water-tank',
  TANK_FULL: 'water-tank',
  TANK_OVERFLOW: 'water-tank',
  PUMP_OVERHEAT: 'pump-station',
};

/**
 * GRAM JAL JEEVAN - Rural Piped Water Supply O&M System
 * V18.1 - Refactored Architecture Edition
 * Features: Modular dashboard components, separated concerns, optimized rendering
 */

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
            <button
              onClick={handleInspection}
              className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
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
              <div className="text-2xl font-bold text-blue-600">
                ₹{monthlyProjection.toFixed(0)}
              </div>
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
      (data.qualityHardness <= 300 ? 10 : 0) +
      (data.qualityEC <= 750 ? 10 : 0)
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
  const pipelinesNeedingAttention = pipelineQualities.filter((p) => p.deviation > 10).length;

  const pipelineChartData = pipelineQualities.map((pq) => ({
    pipeline: pq.shortName || pq.pipelineName,
    tankPH: formatMetric(tankQuality.pH, 2, 0),
    pipelinePH: pq.outlet.pH,
    tankTurbidity: formatMetric(tankQuality.turbidity, 2, 0),
    pipelineTurbidity: pq.outlet.turbidity,
    tankChlorine: formatMetric(tankQuality.chlorine, 2, 0),
    pipelineChlorine: pq.outlet.chlorine,
  }));

  const deviationChartData = pipelineQualities.map((pq) => ({
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
    {
      type: 'Field Test',
      test: 'Chlorine Residual',
      frequency: 'Daily 6:00 AM',
      last: 'Today 06:05',
      next: 'Tomorrow',
    },
    {
      type: 'Lab Test',
      test: 'Complete Potable Panel',
      frequency: 'Weekly Monday',
      last: 'Mon 18 Nov',
      next: 'Mon 25 Nov',
    },
    {
      type: 'External Lab',
      test: 'Microbiological',
      frequency: 'Monthly 1st week',
      last: '05 Nov',
      next: '05 Dec',
    },
  ];

  const labResults = [
    {
      id: 'LAB-241118A',
      date: '18 Nov 2024',
      parameter: 'pH',
      result: 7.4,
      status: 'Within Range',
    },
    {
      id: 'LAB-241118B',
      date: '18 Nov 2024',
      parameter: 'Turbidity',
      result: 2.1,
      status: 'Within Range',
    },
    {
      id: 'LAB-241118C',
      date: '18 Nov 2024',
      parameter: 'Chlorine',
      result: 0.15,
      status: 'Low - Dose',
    },
    {
      id: 'LAB-241018D',
      date: '10 Oct 2024',
      parameter: 'Hardness',
      result: 180,
      status: 'Compliant',
    },
    { id: 'LAB-241018E', date: '10 Oct 2024', parameter: 'EC', result: 450, status: 'Compliant' },
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
          <p className="text-sm text-gray-500">
            Continuous monitoring, compliance tracking, lab records & escalation
          </p>
        </div>
        <div
          className={`px-5 py-3 rounded-2xl font-bold text-lg border-2 ${wqi >= 80 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}
        >
          WQI Score: {wqi}/100
        </div>
      </div>

      {/* Core Metrics */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center justify-between">
          <h3 className="font-bold text-purple-900 flex items-center gap-2">
            <Beaker size={18} /> Core Parameters & Acceptable Ranges
          </h3>
          <button
            onClick={() => logWaterTest('Manual Sample Collected')}
            className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
          >
            Record Field Test
          </button>
        </div>
        <div className="p-2 md:p-6 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          <QualityCard
            label="pH Level"
            value={data.qualityPH}
            unit="pH"
            safeMin={6.5}
            safeMax={8.5}
            icon={Beaker}
          />
          <QualityCard
            label="Turbidity"
            value={data.qualityTurbidity}
            unit="NTU"
            safeMax={5}
            icon={Wind}
          />
          <QualityCard
            label="Chlorine"
            value={data.qualityChlorine}
            unit="mg/L"
            safeMin={0.2}
            safeMax={1.0}
            icon={Droplet}
          />
          <QualityCard label="TDS" value={data.qualityTDS} unit="ppm" safeMax={500} icon={Layers} />
          <QualityCard
            label="Temperature"
            value={data.qualityTemperature || 25}
            unit="°C"
            safeMin={10}
            safeMax={30}
            icon={Thermometer}
          />
          <QualityCard
            label="Hardness"
            value={data.qualityHardness || 180}
            unit="mg/L"
            safeMax={300}
            icon={Beaker}
          />
          <QualityCard
            label="EC"
            value={data.qualityEC || 450}
            unit="µS/cm"
            safeMax={750}
            icon={Activity}
          />
        </div>
      </div>

      {/* Pipeline Quality Breakdown - Moved to Top */}
      {pipelineQualities.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-1 md:gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border md:border-2 border-emerald-300 rounded-md md:rounded-2xl p-1.5 md:p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-0.5 md:mb-2">
                <p className="text-[7px] md:text-xs font-bold text-emerald-700 uppercase tracking-tight md:tracking-wide leading-tight">
                  Avg Deviation
                </p>
                <TrendingUp size={10} className="text-emerald-600 hidden md:block md:w-5 md:h-5" />
              </div>
              <p className="text-base md:text-4xl font-black text-emerald-700 mb-0 md:mb-1">
                {avgPipelineDeviation}%
              </p>
              <p className="text-[6px] md:text-xs text-emerald-600 font-semibold leading-tight">
                vs tank
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border md:border-2 border-amber-300 rounded-md md:rounded-2xl p-1.5 md:p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-0.5 md:mb-2">
                <p className="text-[7px] md:text-xs font-bold text-amber-700 uppercase tracking-tight md:tracking-wide leading-tight">
                  Highest
                </p>
                <AlertCircle size={10} className="text-amber-600 hidden md:block md:w-5 md:h-5" />
              </div>
              <p className="text-[10px] md:text-2xl font-black text-amber-700 mb-0 md:mb-1">
                {highestDeviationPipeline?.shortName || 'All Stable'}
              </p>
              <p className="text-[6px] md:text-xs text-amber-600 font-semibold leading-tight">
                {highestDeviationPipeline ? `${highestDeviationPipeline.deviation}%` : 'No alerts'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 border md:border-2 border-red-300 rounded-md md:rounded-2xl p-1.5 md:p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-0.5 md:mb-2">
                <p className="text-[7px] md:text-xs font-bold text-red-700 uppercase tracking-tight md:tracking-wide leading-tight">
                  Attention
                </p>
                <AlertTriangle size={10} className="text-red-600 hidden md:block md:w-5 md:h-5" />
              </div>
              <p className="text-base md:text-4xl font-black text-red-700 mb-0 md:mb-1">
                {pipelinesNeedingAttention}
              </p>
              <p className="text-[6px] md:text-xs text-red-600 font-semibold leading-tight">
                &gt;10% dev
              </p>
            </div>
          </div>

          {/* Pipeline Quality Breakdown Table */}
          <div className="bg-white rounded-lg md:rounded-2xl border md:border-2 border-indigo-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 md:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white flex items-center gap-1 md:gap-3 text-sm md:text-xl">
                  <Layers size={16} className="md:w-6 md:h-6" /> Pipeline Quality Breakdown
                </h3>
                <p className="text-indigo-100 text-[9px] md:text-sm mt-0.5 md:mt-1">
                  Detailed water quality parameters across distribution network
                </p>
              </div>
              <span className="px-2 py-1 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full text-[8px] md:text-xs text-white font-bold border border-white/30">
                {pipelineQualities.length} Active Pipelines
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                  <tr className="border-b md:border-b-2 border-slate-200">
                    <th className="p-1 md:p-4 text-left font-bold text-slate-700 text-[9px] md:text-sm">
                      Pipeline
                    </th>
                    <th className="p-1 md:p-4 text-left font-bold text-slate-700 text-[9px] md:text-sm">
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <Droplet size={10} className="md:w-3.5 md:h-3.5" /> pH
                      </div>
                    </th>
                    <th className="p-1 md:p-4 text-left font-bold text-slate-700 text-[9px] md:text-sm">
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <Wind size={10} className="md:w-3.5 md:h-3.5" /> Turb
                      </div>
                    </th>
                    <th className="p-1 md:p-4 text-left font-bold text-slate-700 text-[9px] md:text-sm">
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <Layers size={10} className="md:w-3.5 md:h-3.5" /> TDS
                      </div>
                    </th>
                    <th className="p-1 md:p-4 text-left font-bold text-slate-700 text-[9px] md:text-sm">
                      Status
                    </th>
                    <th className="p-1 md:p-4 text-center font-bold text-slate-700 text-[9px] md:text-sm">
                      Dev
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pipelineQualities.map((pq, idx) => {
                    const isAlert = pq.deviation > 10;
                    const isWarning = pq.deviation > 5 && pq.deviation <= 10;
                    return (
                      <tr
                        key={pq.pipelineId}
                        className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <td className="p-1 md:p-4">
                          <div className="flex items-center gap-1 md:gap-3">
                            <div
                              className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-white text-[8px] md:text-sm ${
                                isAlert
                                  ? 'bg-red-500'
                                  : isWarning
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                              }`}
                            >
                              P{pq.pipelineId}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-[9px] md:text-sm">
                                {pq.pipelineName}
                              </p>
                              <p className="text-[7px] md:text-xs text-slate-500">{pq.shortName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-1 md:p-4">
                          <div className="space-y-0 md:space-y-1">
                            <p className="font-bold text-slate-800 text-[9px] md:text-base">
                              {formatDisplay(pq.outlet.pH)}
                            </p>
                            <p className="text-[7px] md:text-xs text-slate-500">
                              In: {formatDisplay(pq.inlet.pH)}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 md:p-4">
                          <div className="space-y-0 md:space-y-1">
                            <p className="font-bold text-slate-800 text-[9px] md:text-base">
                              {formatDisplay(pq.outlet.turbidity)}{' '}
                              <span className="text-[7px] md:text-xs text-slate-500">NTU</span>
                            </p>
                            <p className="text-[7px] md:text-xs text-slate-500">
                              In: {formatDisplay(pq.inlet.turbidity)}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 md:p-4">
                          <div className="space-y-0 md:space-y-1">
                            <p className="font-bold text-slate-800 text-[9px] md:text-base">
                              {formatDisplay(pq.outlet.TDS, 0)}{' '}
                              <span className="text-[7px] md:text-xs text-slate-500">ppm</span>
                            </p>
                            <p className="text-[7px] md:text-xs text-slate-500">
                              In: {formatDisplay(pq.inlet.TDS, 0)}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 md:p-4">
                          <span
                            className={`inline-flex items-center gap-0.5 md:gap-1 px-1 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-xs font-bold ${
                              isAlert
                                ? 'bg-red-100 text-red-700 border border-red-300'
                                : isWarning
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            }`}
                          >
                            {isAlert ? '⚠' : isWarning ? '⚡' : '✓'}{' '}
                            <span className="hidden md:inline">
                              {isAlert ? 'Alert' : isWarning ? 'Warning' : 'Good'}
                            </span>
                          </span>
                        </td>
                        <td className="p-1 md:p-4 text-center">
                          <div className="flex flex-col items-center gap-0.5 md:gap-2">
                            <span
                              className={`text-sm md:text-2xl font-black ${
                                isAlert
                                  ? 'text-red-600'
                                  : isWarning
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                              }`}
                            >
                              {pq.deviation}%
                            </span>
                            <div className="w-full bg-slate-200 rounded-full h-1 md:h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isAlert
                                    ? 'bg-red-600'
                                    : isWarning
                                      ? 'bg-amber-600'
                                      : 'bg-emerald-600'
                                }`}
                                style={{ width: `${Math.min(100, pq.deviation * 5)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="bg-slate-50 p-2 md:p-4 border-t md:border-t-2 border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-6">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[8px] md:text-xs font-semibold text-slate-600">
                      Good (&lt;5%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[8px] md:text-xs font-semibold text-slate-600">
                      Warning (5-10%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                    <span className="text-[8px] md:text-xs font-semibold text-slate-600">
                      Alert (&gt;10%)
                    </span>
                  </div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500 italic">
                  Deviation calculated from main tank baseline quality
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quality Deviation Chart */}
      {pipelineQualities.length > 0 && (
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
                <Bar
                  dataKey="deviation"
                  fill="#f87171"
                  name="Deviation (%)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

const ForecastingDashboard = ({ data, flow24h, systemState }) => {
  const pumpWearIndex = data.pumpEfficiency > 0 ? 100 - data.pumpEfficiency : 0;
  const leakProb = data.pumpFlowRate < 400 && data.pumpStatus === 'RUNNING' ? 85 : 5;
  const pumpEfficiencyScore = Number.isFinite(data.pumpEfficiency) ? data.pumpEfficiency : 0;
  const earlyDetectionScore = Math.max(0, Math.min(100, 100 - leakProb + 10));
  const nextServiceLabel = data.nextPumpService
    ? new Date(data.nextPumpService).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : 'Schedule Soon';
  const resilienceScore = Math.max(60, Math.min(100, pumpEfficiencyScore + (100 - leakProb) * 0.3));
  const predictiveInsights = [
    {
      title: 'Pump Efficiency',
      metric: `${pumpEfficiencyScore.toFixed(0)}%`,
      detail: 'Optimized VFD tuning keeps energy per liter low',
    },
    {
      title: 'Early Fault Detection',
      metric: `${earlyDetectionScore.toFixed(0)}%`,
      detail: 'Flow/pressure anomalies flagged before escalation',
    },
    {
      title: 'Timely Maintenance',
      metric: nextServiceLabel,
      detail: 'Automated reminders keep crews on schedule',
    },
    {
      title: 'System Resilience',
      metric: `${resilienceScore.toFixed(0)}%`,
      detail: 'Reducing system failures with predictive triggers',
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <TrendingUp size={28} className="text-fuchsia-600" /> Predictive Maintenance
        </h2>
        <div className="text-sm text-gray-500">AI Confidence: 85%</div>
      </div>
      <div className="bg-white rounded-lg md:rounded-xl border shadow-sm">
        <div className="bg-fuchsia-50 p-2 md:p-4 border-b border-fuchsia-100">
          <h3 className="font-bold text-fuchsia-800 text-[11px] md:text-base flex items-center gap-1 md:gap-2">
            <Wind size={14} className="md:w-5 md:h-5" /> 1. Flow Pattern Analytics
          </h3>
        </div>
        <div className="p-2 md:p-6">
          <div className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flow24h} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="timeLabel"
                  interval={2}
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                  width={35}
                />
                <Tooltip
                  contentStyle={{ fontSize: '11px', padding: '4px 8px' }}
                  labelStyle={{ fontSize: '10px' }}
                />
                <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '8px' }} iconSize={10} />
                <Area type="monotone" dataKey="avg" fill="#fae8ff" stroke="none" name="Avg" />
                <Line
                  type="monotone"
                  dataKey="flow"
                  stroke="#d946ef"
                  strokeWidth={1.5}
                  name="Flow"
                  dot={false}
                />
                <Scatter
                  name="Anomaly"
                  data={flow24h.filter((d) => d.anomaly)}
                  fill="red"
                  shape="circle"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg md:rounded-xl border shadow-sm">
          <div className="bg-orange-50 p-2 md:p-4 border-b border-orange-100">
            <h3 className="font-bold text-orange-800 text-[11px] md:text-base flex items-center gap-1 md:gap-2">
              <AlertTriangle size={14} className="md:w-5 md:h-5" /> 2. Fault Prediction Indicators
            </h3>
          </div>
          <div className="p-3 md:p-6 grid grid-cols-2 gap-3 md:gap-6">
            <div className="bg-gray-50 p-2 md:p-3 rounded-lg border flex flex-col items-center">
              <div className="text-[8px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">
                Leak Probability
              </div>
              <GaugeChart
                value={data.predFlowDropPercent}
                max={100}
                label="% Risk"
                color="#ef4444"
              />
            </div>
            <div className="bg-gray-50 p-2 md:p-3 rounded-lg border flex flex-col items-center">
              <div className="text-[8px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">
                Pump Wear
              </div>
              <GaugeChart
                value={data.predEnergySpikePercent}
                max={100}
                label="% Wear"
                color="#f59e0b"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border md:border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="bg-blue-900 p-2 md:p-4 border-b border-amber-500">
            <h3 className="font-bold text-white text-[11px] md:text-base flex items-center gap-1 md:gap-2">
              <CalendarClock size={14} className="md:w-5 md:h-5" /> 3. Scheduling
            </h3>
          </div>
          <div className="p-3 md:p-6 space-y-2 md:space-y-4">
            <CountdownCard title="Pump Service" targetDate={data.nextPumpService} icon={Wrench} />
            <CountdownCard
              title="Valve Service"
              targetDate={data.nextValveService}
              icon={AlertCircle}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-fuchsia-50 p-2 md:p-4 border-b border-fuchsia-100">
          <h3 className="font-bold text-fuchsia-800 text-[11px] md:text-base flex items-center gap-1 md:gap-2">
            <TrendingUp size={14} className="md:w-[18px] md:h-[18px]" /> Predictive Insights
          </h3>
          <p className="text-[8px] md:text-xs text-fuchsia-500 uppercase tracking-wide">
            Actions that protect uptime
          </p>
        </div>
        <div className="p-3 md:p-6 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4">
          {predictiveInsights.map((insight) => (
            <div
              key={insight.title}
              className="p-2 md:p-4 rounded-lg md:rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-lg transition duration-200"
            >
              <p className="text-[7px] md:text-2xs text-gray-400 uppercase tracking-wider">
                {insight.title}
              </p>
              <p className="text-base md:text-3xl font-black text-black mt-1 md:mt-2">
                {insight.metric}
              </p>
              <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{insight.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Early Fault Detection System */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg md:rounded-2xl border md:border-2 border-red-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 md:p-5">
          <h3 className="font-black text-white flex items-center gap-1 md:gap-3 text-sm md:text-xl">
            <AlertTriangle size={16} className="md:w-6 md:h-6" /> Early Fault Detection System
          </h3>
          <p className="text-red-100 text-[9px] md:text-sm mt-0.5 md:mt-1">
            Real-time anomaly detection across all system components
          </p>
        </div>

        <div className="p-3 md:p-6 space-y-3 md:space-y-6">
          {/* Pump Station Health */}
          <div className="bg-white rounded-lg md:rounded-xl border md:border-2 border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-slate-800 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
              <h4 className="font-bold text-white text-[10px] md:text-base flex items-center gap-1 md:gap-2">
                <Power size={14} className="md:w-[18px] md:h-[18px]" /> Pump Station Diagnostics
              </h4>
              <span
                className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-bold ${data.pumpEfficiency > 75 ? 'bg-green-500 text-white' : data.pumpEfficiency > 50 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}
              >
                {data.pumpEfficiency > 75
                  ? '✓ HEALTHY'
                  : data.pumpEfficiency > 50
                    ? '⚠ MONITOR'
                    : '✕ CRITICAL'}
              </span>
            </div>
            <div className="p-2 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Motor Temperature
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.motorTemp > 65 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {data.motorTemp || 45}°C
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.motorTemp > 65 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(100, ((data.motorTemp || 45) / 80) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.motorTemp > 65 ? '⚠ Overheating detected' : '✓ Normal operating range'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Vibration Level
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.vibration > 8 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {(data.vibration || 3).toFixed(1)} mm/s
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.vibration > 8 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(100, ((data.vibration || 3) / 10) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.vibration > 8 ? '⚠ Bearing wear suspected' : '✓ Stable operation'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Power Draw
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.powerConsumption > 10 ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {(data.powerConsumption || 7.5).toFixed(1)} kW
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.powerConsumption > 10 ? 'bg-amber-600' : 'bg-green-600'}`}
                    style={{
                      width: `${Math.min(100, ((data.powerConsumption || 7.5) / 12) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.powerConsumption > 10
                    ? '⚠ Efficiency drop detected'
                    : '✓ Optimal consumption'}
                </p>
              </div>
            </div>
          </div>

          {/* Water Tank Monitoring */}
          <div className="bg-white rounded-lg md:rounded-xl border md:border-2 border-blue-200 shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
              <h4 className="font-bold text-white text-[10px] md:text-base flex items-center gap-1 md:gap-2">
                <Droplet size={14} className="md:w-[18px] md:h-[18px]" /> Water Tank Health
              </h4>
              <span
                className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-bold ${data.tankLevel > 30 && data.tankLevel < 95 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}
              >
                {data.tankLevel > 30 && data.tankLevel < 95 ? '✓ OPTIMAL' : '⚠ ATTENTION'}
              </span>
            </div>
            <div className="p-2 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Water Level
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.tankLevel < 20 ? 'text-red-600' : data.tankLevel > 90 ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {(data.tankLevel || 65).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.tankLevel < 20 ? 'bg-red-600' : data.tankLevel > 90 ? 'bg-amber-600' : 'bg-green-600'}`}
                    style={{ width: `${data.tankLevel || 65}%` }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.tankLevel < 20
                    ? '⚠ Low water alert'
                    : data.tankLevel > 90
                      ? '⚠ Near capacity'
                      : '✓ Normal range'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Flow Rate
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.pumpFlowRate < 300 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {(data.pumpFlowRate || 450).toFixed(0)} L/min
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.pumpFlowRate < 300 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(100, ((data.pumpFlowRate || 450) / 600) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.pumpFlowRate < 300 ? '⚠ Possible blockage' : '✓ Normal flow'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-sm font-semibold text-slate-600">
                    Temperature
                  </span>
                  <span
                    className={`text-sm md:text-lg font-black ${data.tankTemp > 30 ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {(data.tankTemp || 26).toFixed(1)}°C
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2">
                  <div
                    className={`h-1.5 md:h-2 rounded-full transition-all ${data.tankTemp > 30 ? 'bg-amber-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(100, ((data.tankTemp || 26) / 40) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[8px] md:text-xs text-slate-500">
                  {data.tankTemp > 30 ? '⚠ Elevated temperature' : '✓ Normal temperature'}
                </p>
              </div>
            </div>
          </div>

          {/* Water Quality Sensors */}
          <div className="bg-white rounded-lg md:rounded-xl border md:border-2 border-cyan-200 shadow-lg overflow-hidden">
            <div className="bg-cyan-600 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
              <h4 className="font-bold text-white text-[10px] md:text-base flex items-center gap-1 md:gap-2">
                <FlaskConical size={14} className="md:w-[18px] md:h-[18px]" /> Water Quality
                Monitoring
              </h4>
              <span
                className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-bold ${data.pH >= 6.5 && data.pH <= 8.5 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}
              >
                {data.pH >= 6.5 && data.pH <= 8.5 ? '✓ SAFE' : '⚠ CHECK'}
              </span>
            </div>
            <div className="p-2 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2 bg-cyan-50 rounded-lg p-2 md:p-3">
                <span className="text-[8px] md:text-xs font-bold text-cyan-700">pH Level</span>
                <p className="text-sm md:text-2xl font-black text-slate-900">
                  {(data.pH || 7.2).toFixed(2)}
                </p>
                <div className="w-full bg-cyan-200 rounded-full h-1 md:h-2">
                  <div
                    className={`h-1 md:h-2 rounded-full transition-all ${data.pH >= 6.5 && data.pH <= 8.5 ? 'bg-green-600' : 'bg-amber-600'}`}
                    style={{ width: `${((data.pH || 7.2) / 14) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[7px] md:text-2xs text-cyan-600">
                  {data.pH >= 6.5 && data.pH <= 8.5 ? '✓ Within range' : '⚠ Out of range'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2 bg-cyan-50 rounded-lg p-2 md:p-3">
                <span className="text-[8px] md:text-xs font-bold text-cyan-700">Turbidity</span>
                <p className="text-sm md:text-2xl font-black text-slate-900">
                  {(data.turbidity || 1.2).toFixed(2)} NTU
                </p>
                <div className="w-full bg-cyan-200 rounded-full h-1 md:h-2">
                  <div
                    className={`h-1 md:h-2 rounded-full transition-all ${data.turbidity < 5 ? 'bg-green-600' : 'bg-red-600'}`}
                    style={{ width: `${Math.min(100, ((data.turbidity || 1.2) / 10) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[7px] md:text-2xs text-cyan-600">
                  {data.turbidity < 5 ? '✓ Excellent' : '⚠ High'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2 bg-cyan-50 rounded-lg p-2 md:p-3">
                <span className="text-[8px] md:text-xs font-bold text-cyan-700">Chlorine</span>
                <p className="text-sm md:text-2xl font-black text-slate-900">
                  {(data.chlorine || 0.5).toFixed(2)} mg/L
                </p>
                <div className="w-full bg-cyan-200 rounded-full h-1 md:h-2">
                  <div
                    className={`h-1 md:h-2 rounded-full transition-all ${data.chlorine >= 0.2 && data.chlorine <= 1.0 ? 'bg-green-600' : 'bg-amber-600'}`}
                    style={{ width: `${((data.chlorine || 0.5) / 2) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[7px] md:text-2xs text-cyan-600">
                  {data.chlorine >= 0.2 && data.chlorine <= 1.0
                    ? '✓ Safe level'
                    : '⚠ Adjust dosage'}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2 bg-cyan-50 rounded-lg p-2 md:p-3">
                <span className="text-[8px] md:text-xs font-bold text-cyan-700">TDS</span>
                <p className="text-sm md:text-2xl font-black text-slate-900">
                  {(data.TDS || 245).toFixed(0)} ppm
                </p>
                <div className="w-full bg-cyan-200 rounded-full h-1 md:h-2">
                  <div
                    className={`h-1 md:h-2 rounded-full transition-all ${data.TDS < 500 ? 'bg-green-600' : 'bg-amber-600'}`}
                    style={{ width: `${Math.min(100, ((data.TDS || 245) / 1000) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[7px] md:text-2xs text-cyan-600">
                  {data.TDS < 500 ? '✓ Good' : '⚠ High'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsDashboard = ({ data, history, flow24h, alerts, tickets, systemState }) => {
  return (
    <div>ReportsDashboard - To be implemented</div>
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
            <div className="text-2xl font-bold text-blue-700">
              {data.dailySupplyHours.toFixed(1)} <span className="text-sm font-normal">hrs</span>
            </div>
            <div className="text-xs text-blue-400">Target: 4.0 hrs</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="text-xs text-gray-500 uppercase mb-1">Tank Status</div>
            <div className="text-2xl font-bold text-indigo-700">{data.tankLevel.toFixed(0)}%</div>
            <div className="text-xs text-indigo-400">
              {data.tankLevel > 50 ? 'Good Level' : 'Needs Filling'}
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${isWaterSafe ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}
          >
            <div className="text-xs text-gray-500 uppercase mb-1">Quality Status</div>
            <div
              className={`text-2xl font-bold ${isWaterSafe ? 'text-emerald-700' : 'text-red-700'}`}
            >
              {isWaterSafe ? 'SAFE' : 'UNSAFE'}
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${alerts.length === 0 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'}`}
          >
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
                {logs.slice(0, 10).map((log) => (
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

const EnergyDashboard = ({ data, history }) => {
  const electricityRate = 7.25; // ₹ per kWh
  const pumpPowerKW = Number(data.pumpPower ?? 0);
  const pumpEfficiency = Number(data.pumpEfficiency ?? 0);
  const powerFactor = Number(data.powerFactor ?? 0);
  const dailyEnergyKWh = Number(data.dailyEnergyKWh ?? 0);
  const dailyWaterLiters = Number(data.dailyWaterDistributed ?? 20000);
  const dailyEnergyCost = dailyEnergyKWh * electricityRate;
  const monthlyEnergyCost = dailyEnergyCost * 30;
  const energyPerKL =
    dailyWaterLiters > 0 ? (dailyEnergyKWh / (dailyWaterLiters / 1000)).toFixed(2) : '0.00';
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
    solar: 18,
    grid: 72,
    generator: 10,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div>
          <h2 className="text-lg md:text-3xl font-bold text-black flex items-center gap-2 md:gap-3">
            <Zap size={20} className="text-amber-500 md:w-8 md:h-8" /> Energy & Power Intelligence
          </h2>
          <p className="text-[10px] md:text-sm text-gray-500">
            Track consumption, costs, efficiency and sustainability metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-2 text-[8px] md:text-xs font-semibold">
          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-50 text-emerald-700">
            Motor Efficiency {pumpEfficiency.toFixed(0)}%
          </span>
          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-50 text-blue-700">
            Power Factor {powerFactor.toFixed(2)}
          </span>
          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gray-50 text-black">
            Load {pumpPowerKW.toFixed(1)} kW
          </span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4">
        <div className="p-2 md:p-5 rounded-lg md:rounded-2xl border md:border-2 border-amber-100 bg-amber-50/60">
          <p className="text-[8px] md:text-xs text-amber-700 font-bold uppercase">
            Real-time Consumption
          </p>
          <p className="text-base md:text-4xl font-black text-amber-600">
            {pumpPowerKW.toFixed(1)}
            <span className="text-[10px] md:text-lg font-normal"> kW</span>
          </p>
          <p className="text-[8px] md:text-xs text-amber-700">Live motor load</p>
        </div>
        <div className="p-2 md:p-5 rounded-lg md:rounded-2xl border md:border-2 border-green-200 bg-green-50/60">
          <p className="text-[8px] md:text-xs text-green-800 font-bold uppercase">Daily Energy</p>
          <p className="text-base md:text-4xl font-black text-green-700">
            {dailyEnergyKWh.toFixed(1)}
            <span className="text-[10px] md:text-lg font-normal"> kWh</span>
          </p>
          <p className="text-[8px] md:text-xs text-green-800">
            ₹ {dailyEnergyCost.toFixed(0)} per day
          </p>
        </div>
        <div className="p-2 md:p-5 rounded-lg md:rounded-2xl border md:border-2 border-emerald-100 bg-emerald-50/60">
          <p className="text-[8px] md:text-xs text-emerald-700 font-bold uppercase">
            Energy per KL
          </p>
          <p className="text-base md:text-4xl font-black text-emerald-600">
            {energyPerKL}
            <span className="text-[10px] md:text-lg font-normal"> kWh/kL</span>
          </p>
          <p className="text-[8px] md:text-xs text-emerald-700">Benchmark: 0.45</p>
        </div>
        <div className="p-2 md:p-5 rounded-lg md:rounded-2xl border md:border-2 border-slate-100 bg-slate-50/60">
          <p className="text-[8px] md:text-xs text-slate-700 font-bold uppercase">
            Carbon Footprint
          </p>
          <p className="text-base md:text-4xl font-black text-slate-700">
            {carbonFootprint}
            <span className="text-[10px] md:text-lg font-normal"> kg CO₂</span>
          </p>
          <p className="text-[8px] md:text-xs text-slate-500">Scope-2 daily emissions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-6">
        <div className="xl:col-span-2 bg-white rounded-lg md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-6">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="font-bold text-black text-[11px] md:text-base flex items-center gap-1 md:gap-2">
              <Activity size={14} className="md:w-[18px] md:h-[18px]" /> 24h Energy Load & Peak
              Analysis
            </h3>
            <span className="text-[9px] md:text-xs text-gray-400">kW</span>
          </div>
          <div className="h-48 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pumpPower"
                  stroke="#f59e0b"
                  fillOpacity={0.3}
                  fill="#f59e0b"
                  name="Actual Load"
                />
                <Line
                  type="monotone"
                  dataKey="peak"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Peak Threshold"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-6">
          <h3 className="font-bold text-black text-[11px] md:text-base mb-2 md:mb-4 flex items-center gap-1 md:gap-2">
            <PieChartIcon size={14} className="md:w-[18px] md:h-[18px]" /> Peak vs Off-Peak Usage
          </h3>
          <div className="flex flex-col items-center">
            <PieChart width={160} height={160} className="md:w-[220px] md:h-[220px]">
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
              {peakData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-bold">{item.name}</span> <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cost & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-6">
          <h3 className="font-bold text-black text-[11px] md:text-base mb-2 md:mb-4 flex items-center gap-1 md:gap-2">
            <DollarSign size={14} className="md:w-[18px] md:h-[18px]" /> Cost & Efficiency Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-[9px] md:text-sm">
            <div className="border rounded-lg md:rounded-xl p-2 md:p-4 bg-gray-50">
              <p className="text-[8px] md:text-xs text-gray-500 uppercase">Daily Operating Cost</p>
              <p className="text-base md:text-2xl font-bold text-black">
                ₹ {dailyEnergyCost.toFixed(0)}
              </p>
              <p className="text-[7px] md:text-xs text-gray-400">Based on current tariff</p>
            </div>
            <div className="border rounded-lg md:rounded-xl p-2 md:p-4 bg-gray-50">
              <p className="text-[8px] md:text-xs text-gray-500 uppercase">Monthly Projection</p>
              <p className="text-base md:text-2xl font-bold text-blue-600">
                ₹ {monthlyEnergyCost.toLocaleString()}
              </p>
              <p className="text-[7px] md:text-xs text-gray-400">At current load</p>
            </div>
            <div className="border rounded-lg md:rounded-xl p-2 md:p-4 bg-gray-50 col-span-2 md:col-span-1">
              <p className="text-[8px] md:text-xs text-gray-500 uppercase">Benchmark Comparison</p>
              <p className="text-base md:text-2xl font-bold text-emerald-600">
                {energyPerKL} kWh/kL
              </p>
              <p className="text-[7px] md:text-xs text-emerald-600">State Avg 0.55</p>
            </div>
          </div>
          <div className="mt-3 md:mt-6">
            <p className="text-[8px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">
              Energy-Saving Recommendations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-[9px] md:text-sm">
              {recommendations.map((rec) => (
                <div
                  key={rec}
                  className="p-2 md:p-3 rounded-lg md:rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800 flex items-center gap-1 md:gap-2"
                >
                  <Leaf size={12} className="md:w-4 md:h-4" /> {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-6 space-y-2 md:space-y-4">
          <h3 className="font-bold text-black text-[11px] md:text-base flex items-center gap-1 md:gap-2">
            <Sun size={14} className="md:w-[18px] md:h-[18px]" /> Renewable & Backup Status
          </h3>
          <div className="text-[9px] md:text-xs text-gray-500">
            <p>Solar Contribution</p>
            <div className="w-full h-2 md:h-3 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${renewableContribution.solar}%` }}
              ></div>
            </div>
            <p className="mt-1 text-black font-bold">
              {renewableContribution.solar}% of daily demand
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3 text-[9px] md:text-xs">
            <div className="border rounded-lg md:rounded-xl p-2 md:p-3 bg-gray-50">
              <p className="text-gray-500">Grid Uptime</p>
              <p className="text-base md:text-xl font-bold text-black">98.7%</p>
            </div>
            <div className="border rounded-lg md:rounded-xl p-2 md:p-3 bg-gray-50">
              <p className="text-gray-500">Generator Fuel</p>
              <p className="text-base md:text-xl font-bold text-amber-600">74%</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p>Backup Readiness</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700">
                Generator - READY
              </span>
              <span className="px-2 py-1 rounded-full text-2xs font-bold bg-blue-50 text-blue-700">
                Battery - 3.5h
              </span>
            </div>
          </div>
          <button className="w-full py-2 rounded-xl bg-gray-100 text-black text-xs font-bold">
            Download Energy Report
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketingDashboard = ({ tickets, resolveTicket, data }) => {
  return (
    <div>TicketingDashboard - To be implemented</div>
  );
};

const GISDashboard = ({ systemState }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <Map size={28} className="text-emerald-600" /> GIS Mapping & Pipeline Network
        </h2>
      </div>
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <PipelineMapViewer />
      </div>
    </div>
  );
};

const MainDashboard = ({
  data,
  history,
  flow24h,
  alerts,
  logs,
  togglePump,
  toggleValve,
  forceAnomaly,
  activeTab,
  setActiveTab,
  user,
  logInspection,
  logWaterTest,
  complaints,
  responseTimeData,
  tickets,
  resolveTicket,
  language,
  offlineMode,
  lastSync,
  systemState,
  onTogglePump,
  onToggleValve,
  onSchedulePumpTimer,
  onSchedulePumpStop,
  onCancelPumpSchedule,
  globalSearchQuery,
  forceSimulationState,
}) => {
  const { t } = useTranslation();
  const userRole = user?.role || 'technician';

  // --- TAB RENDERING ---
  // Infrastructure sub-pages with specific components
  if (activeTab === 'pump-station') {
    return <PumpDetails onBack={() => setActiveTab('infrastructure')} />;
  }

  if (activeTab === 'water-tank') {
    return <WaterTankDetails onBack={() => setActiveTab('infrastructure')} />;
  }

  if (activeTab === 'pipeline') {
    return (
      <PipelinesOverview
        onBack={() => setActiveTab('infrastructure')}
        onNavigateToPipeline={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === 'valves') {
    return <ValvesDashboard onBack={() => setActiveTab('operator')} />;
  }

  // Removed network-map and infrastructure tabs - redirecting to operator dashboard
  if (activeTab === 'network-map' || activeTab === 'infrastructure') {
    setActiveTab('operator');
    return null;
  }

  if (activeTab === 'daily')
    return (
      <DailyOperationDashboard
        data={data}
        user={user}
        logInspection={logInspection}
        history={history}
        systemState={systemState}
      />
    );
  if (activeTab === 'quality')
    return (
      <WaterQualityDashboard data={data} logWaterTest={logWaterTest} systemState={systemState} />
    );
  if (activeTab === 'service-requests')
    return <ServiceRequestDashboard userRole={userRole} globalSearchQuery={globalSearchQuery} />;
  if (activeTab === 'control-center')
    return (
      <ControlCenter
        systemState={systemState}
        onTogglePump={togglePump}
        onToggleValve={toggleValve}
        forceAnomaly={forceAnomaly}
        onSimulateState={forceSimulationState}
      />
    );
  if (activeTab === 'maintenance')
    return <MaintenanceDashboard onBack={() => setActiveTab('overview')} />;
  if (activeTab === 'forecasting')
    return <ForecastingDashboard data={data} flow24h={flow24h} systemState={systemState} />;
  if (activeTab === 'reports' && userRole === 'researcher')
    return (
      <ReportsDashboard
        data={data}
        history={history}
        flow24h={flow24h}
        alerts={alerts}
        tickets={tickets}
        systemState={systemState}
      />
    );
  if (activeTab === 'accountability')
    return (
      <AccountabilityDashboard
        data={data}
        logs={logs}
        alerts={alerts}
        complaints={complaints}
        responseTimeData={responseTimeData}
        systemState={systemState}
      />
    );
  if (activeTab === 'analytics')
    return <ForecastingDashboard data={data} flow24h={flow24h} systemState={systemState} />;

  if (activeTab === 'gis') {
    return <GISDashboard systemState={systemState} />;
  }

  if (activeTab === 'energy')
    return <EnergyDashboard data={data} history={history} systemState={systemState} />;
  if (activeTab === 'ticketing')
    return (
      <TicketingDashboard
        tickets={tickets}
        resolveTicket={resolveTicket}
        data={data}
        systemState={systemState}
      />
    );

  // Detail pages
  if (activeTab === 'pump-details') {
    return <PumpDetails onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'tank-details') {
    return <WaterTankDetails onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'pipelines-overview') {
    return (
      <PipelinesOverview
        onBack={() => setActiveTab('overview')}
        onNavigateToPipeline={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab?.startsWith('pipeline-details-')) {
    const pipelineId = activeTab.replace('pipeline-details-', '');
    return (
      <PipelineDetails pipelineId={pipelineId} onBack={() => setActiveTab('pipelines-overview')} />
    );
  }

  // --- ROLE-BASED OVERVIEW DASHBOARD ---
  // Guest users see their dashboard or complaint submission
  if (userRole === 'public') {
    if (activeTab === 'complaints') {
      return <ComplaintSubmission offlineMode={offlineMode} lastSync={lastSync} />;
    }
    return (
      <GuestDashboard language={language} t={t} offlineMode={offlineMode} lastSync={lastSync} />
    );
  }

  // Researchers get analytics and data export tools
  if (userRole === 'researcher') {
    return <ResearcherDashboard sensors={data} systemState={systemState} history={history} />;
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
  // Redirect to technician dashboard as default
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
};

// Loading fallback component
const App = () => {
  // ===== AUTH & CONTEXT =====
  const { user, login, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { offlineMode, lastSync } = useOffline();
  const { t } = useTranslation();

  // ===== MAIN APP STATE =====
  // Default to Infrastructure → Overview (id 'overview')
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  // ===== ACTION FEEDBACK STATE =====
  const { notifications, removeNotification, success } = useNotifications();
  const { actions, addAction, clearActions } = useActionLog();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    isDangerous: false,
  });
  const [showActionsLog, setShowActionsLog] = useState(false);

  // ===== ACCESSIBILITY STATE =====
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(1); // Default 1.0 = 100%
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ===== THEME MANAGEMENT =====
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.fontSize = `${textSize * 16}px`;
  }, [textSize]);

  // ===== SEARCH SYSTEM =====
  const searchableItems = [
    { keyword: 'overview', title: 'System Overview', tab: 'overview', icon: '📊' },
    { keyword: 'pump', title: 'Pump Station', tab: 'pump-station', icon: '⚙️' },
    { keyword: 'motor', title: 'Pump Station', tab: 'pump-station', icon: '⚙️' },
    { keyword: 'tank', title: 'Water Tank', tab: 'water-tank', icon: '💧' },
    { keyword: 'water level', title: 'Water Tank', tab: 'water-tank', icon: '💧' },
    { keyword: 'pipeline', title: 'Pipeline Network', tab: 'pipeline', icon: '🔧' },
    { keyword: 'valve', title: 'Valves Control', tab: 'valves', icon: '🚰' },
    { keyword: 'quality', title: 'Water Quality', tab: 'quality', icon: '🧪' },
    { keyword: 'ph', title: 'Water Quality - pH', tab: 'quality', icon: '🧪' },
    { keyword: 'turbidity', title: 'Water Quality - Turbidity', tab: 'quality', icon: '🧪' },
    { keyword: 'chlorine', title: 'Water Quality - Chlorine', tab: 'quality', icon: '🧪' },
    {
      keyword: 'service request',
      title: 'Service Requests & Complaints',
      tab: 'service-requests',
      icon: '📝',
    },
    {
      keyword: 'complaint',
      title: 'Service Requests & Complaints',
      tab: 'service-requests',
      icon: '📝',
    },
    {
      keyword: 'request',
      title: 'Service Requests & Complaints',
      tab: 'service-requests',
      icon: '📝',
    },
    { keyword: 'ward', title: 'Service Requests by Ward', tab: 'service-requests', icon: '🏘️' },
    {
      keyword: 'accountability',
      title: 'Accountability Dashboard',
      tab: 'accountability',
      icon: '✅',
    },
    { keyword: 'energy', title: 'Energy Monitoring', tab: 'energy', icon: '⚡' },
    { keyword: 'power', title: 'Energy Monitoring', tab: 'energy', icon: '⚡' },
    { keyword: 'analytics', title: 'Analytics & Forecasting', tab: 'analytics', icon: '📈' },
    { keyword: 'forecast', title: 'Analytics & Forecasting', tab: 'analytics', icon: '📈' },
    { keyword: 'gis', title: 'GIS Mapping', tab: 'gis', icon: '🗺️' },
    { keyword: 'map', title: 'GIS Mapping', tab: 'gis', icon: '🗺️' },
    { keyword: 'reports', title: 'Reports', tab: 'reports', icon: '📄' },
  ];

  // Search functionality
  useEffect(() => {
    if (globalSearchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = globalSearchQuery.toLowerCase();
    const matches = searchableItems.filter(
      (item) =>
        item.keyword.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)
    );

    // Remove duplicates based on tab
    const uniqueMatches = matches.reduce((acc, current) => {
      const exists = acc.find((item) => item.tab === current.tab);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    setSearchResults(uniqueMatches.slice(0, 6)); // Show max 6 results
    setShowSearchResults(true);
  }, [globalSearchQuery]);

  const handleSearchResultClick = (tab) => {
    setActiveTab(tab);
    setGlobalSearchQuery('');
    setShowSearchResults(false);
  };

  // ===== SIMULATION DATA =====
  const simulation = useSimulationData();
  const data = transformStateToData(simulation.state);

  // ===== HISTORY TRACKING =====
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (simulation.state) {
      const pump = simulation.state.pumpHouse || {};
      const tank = simulation.state.overheadTank || {};
      const nowTimestamp = new Date();

      const newHistoryPoint = {
        time: nowTimestamp.toLocaleTimeString(),
        timestamp: nowTimestamp.toISOString(),
        pipePressure: pump.pumpPressureOutput || 0,
        flowRate: pump.pumpFlowOutput || 0,
        tankLevel: tank.tankLevel || 0,
        pumpPower: pump.powerConsumption || 0,
      };
      setHistory((prev) => {
        const updated = [...prev, newHistoryPoint];
        return updated.slice(-20); // Keep last 20 points
      });
    }
  }, [simulation.state?.lastUpdated]);

  // Flow 24h data
  const flow24h = useMemo(() => {
    const hourlyBuckets = Array.from({ length: 24 }, () => []);
    history.forEach((point) => {
      if (!point.timestamp) return;
      const timestamp = new Date(point.timestamp);
      if (Number.isNaN(timestamp.getTime())) return;
      hourlyBuckets[timestamp.getHours()].push(point.flowRate || 0);
    });

    const pumpIsActive = data.pumpStatus === 'ON' || data.pumpStatus === 'RUNNING';
    const baseFlow = Math.max(0, data.pumpFlowRate || 0);
    const fallbackFlow = pumpIsActive ? Math.max(60, baseFlow) : Math.max(0, baseFlow * 0.2);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const computed = hourlyBuckets.map((bucket, hour) => {
      const hourLabelDate = new Date(startOfDay);
      hourLabelDate.setHours(hour);
      const bucketAvg = bucket.length
        ? bucket.reduce((sum, value) => sum + value, 0) / bucket.length
        : null;
      const value = bucketAvg ?? fallbackFlow;
      return {
        timeLabel: hourLabelDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        flow: Math.round(value),
      };
    });

    const totalFlow = computed.reduce((sum, entry) => sum + entry.flow, 0);
    const avgFlow = computed.length ? totalFlow / computed.length : 0;
    const avgRounded = Math.round(avgFlow);

    return computed.map((entry) => ({ ...entry, avg: avgRounded }));
  }, [history, data.pumpFlowRate, data.pumpStatus]);

  // Alerts from simulation
  const alerts = simulation.alerts || [];
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  // Only show critical/red alerts in the top banner
  const criticalAlerts = activeAlerts.filter(
    (alert) => alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
  );
  const alertTargetIds = Array.from(
    new Set(activeAlerts.map((alert) => ALERT_TYPE_TO_TAB[alert.type] || 'overview'))
  );
  const alertTargetsSet = new Set(alertTargetIds);
  const primaryAlert = criticalAlerts[0] || null;
  const primaryAlertTarget = primaryAlert
    ? ALERT_TYPE_TO_TAB[primaryAlert.type] || 'overview'
    : null;

  // Logs (empty for now, can be enhanced)
  const logs = [];

  // Control functions from simulation
  const handleTogglePump = () => {
    const currentState = simulation.state?.pumpHouse?.pumpStatus || 'STOPPED';
    const willStop = currentState === 'RUNNING';

    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: willStop ? '⏹ Stop Pump?' : '▶ Start Pump?',
      message: willStop
        ? 'Are you sure you want to STOP the main pump? This will halt water supply to all connected pipelines.'
        : 'Are you sure you want to START the main pump? The system will begin pumping water according to the current schedule.',
      isDangerous: willStop,
      action: () => {
        simulation.togglePump();
        addAction(
          `Pump ${willStop ? 'Stopped' : 'Started'}`,
          `Main pump ${willStop ? 'stopped' : 'started'} successfully`,
          'success'
        );
        success(`Pump ${willStop ? 'stopped' : 'started'} successfully`);
        setConfirmDialog({
          isOpen: false,
          title: '',
          message: '',
          action: null,
          isDangerous: false,
        });
      },
    });
  };

  const handleToggleValve = (pipelineId) => {
    const pipeline = simulation.state?.pipelines?.find((p) => p.pipelineId === pipelineId);
    const currentState = pipeline?.valveStatus || 'CLOSED';
    const willClose = currentState === 'OPEN';

    // Show confirmation dialog for critical valve operations
    setConfirmDialog({
      isOpen: true,
      title: willClose ? '🔒 Close Valve?' : '🔓 Open Valve?',
      message: willClose
        ? `Are you sure you want to CLOSE valve on Pipeline ${pipelineId}? This will stop water flow to this pipeline.`
        : `Are you sure you want to OPEN valve on Pipeline ${pipelineId}? Water will flow if the pump is running.`,
      isDangerous: willClose,
      action: () => {
        simulation.toggleValve(pipelineId);
        addAction(
          `Pipeline ${pipelineId} Valve ${willClose ? 'Closed' : 'Opened'}`,
          `Valve on pipeline ${pipelineId} ${willClose ? 'closed' : 'opened'} successfully`,
          'success'
        );
        success(`Valve on pipeline ${pipelineId} ${willClose ? 'closed' : 'opened'}`);
        setConfirmDialog({
          isOpen: false,
          title: '',
          message: '',
          action: null,
          isDangerous: false,
        });
      },
    });
  };

  // Keep old functions for compatibility
  const togglePump = handleTogglePump;
  const toggleValve = handleToggleValve;
  const forceAnomaly = () => {};
  const setData = () => {};
  const logInspection = () => {}; // Can be enhanced
  const logWaterTest = () => {}; // Can be enhanced
  const mlPrediction = null; // Can be enhanced
  const complaints = []; // Can be enhanced
  const responseTimeData = []; // Can be enhanced
  const tickets = []; // Can be enhanced
  const resolveTicket = () => {}; // Can be enhanced

  const handleLogin = (userData, selectedLanguage) => {
    login(userData);
    changeLanguage(selectedLanguage);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('overview');
  };

  // Scroll to top whenever activeTab changes (must be before early return)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Early return for non-authenticated users
  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => (
    <div className="w-full max-w-full overflow-hidden">
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
        globalSearchQuery={globalSearchQuery}
        forceSimulationState={simulation.forceSimulationState}
      />
    </div>
  );

  // Navigation logic for back/forward buttons
  const tabOrder = user?.role === 'public' 
    ? [] 
    : user?.role === 'researcher'
    ? ['overview', 'pump-station', 'water-tank', 'pipeline', 'valves', 'quality', 'analytics']
    : ['overview', 'pump-station', 'water-tank', 'pipeline', 'valves', 'quality', 'maintenance', 'service-requests', 'reports', 'accountability', 'energy', 'analytics', 'gis'];

  const currentTabIndex = tabOrder.indexOf(activeTab);
  const canGoBack = currentTabIndex > 0;
  const canGoForward = currentTabIndex >= 0 && currentTabIndex < tabOrder.length - 1;

  const handleNavigateBack = () => {
    if (canGoBack) {
      setActiveTab(tabOrder[currentTabIndex - 1]);
    }
  };

  const handleNavigateForward = () => {
    if (canGoForward) {
      setActiveTab(tabOrder[currentTabIndex + 1]);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${
        highContrast ? 'contrast-150' : ''
      } ${reducedMotion ? '[&_*]:transition-none [&_*]:animate-none' : ''}`}
    >
      {/* Floating Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-[60] lg:hidden p-2 bg-white/60 backdrop-blur-md border border-gray-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-blue-600" />
        </button>
      )}

      {/* NEW: Sidebar Navigation - Collapsible */}
      <SidebarNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        offlineMode={offlineMode}
        lastSync={lastSync}
        alertBlinkTargets={alertTargetsSet}
        onAccessibility={() => setShowAccessibility(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area - Government Design */}
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{
          background:
            'linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end))',
        }}
      >
        {/* Floating Search Bar with Language Selector */}
        <div className="sticky top-4 z-50 px-2 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
            {/* Navigation Arrows - Left Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNavigateBack}
                disabled={!canGoBack}
                className={`p-2 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 transition-all duration-300 ${
                  canGoBack 
                    ? 'hover:border-blue-300 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                aria-label="Go to previous page"
              >
                <ArrowLeft size={18} className={canGoBack ? 'text-blue-600' : 'text-gray-400'} />
              </button>
              <button
                onClick={handleNavigateForward}
                disabled={!canGoForward}
                className={`p-2 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 transition-all duration-300 ${
                  canGoForward 
                    ? 'hover:border-blue-300 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                aria-label="Go to next page"
              >
                <ArrowRight size={18} className={canGoForward ? 'text-blue-600' : 'text-gray-400'} />
              </button>
            </div>

            {/* Search Bar and Language Selector - Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar */}
            <div
              className={`relative transition-all duration-300 ${showSearchResults ? 'flex-1' : 'flex-none'}`}
            >
              {!showSearchResults ? (
                <button
                  onClick={() => setShowSearchResults(true)}
                  className="p-2 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-300"
                >
                  <Search size={18} className="text-blue-600" />
                </button>
              ) : (
                <div className="relative">
                  <div
                    className={`relative transition-all duration-300 bg-white shadow-lg`}
                    style={{ borderRadius: '12px' }}
                  >
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={globalSearchQuery}
                      onChange={(e) => {
                        setGlobalSearchQuery(e.target.value);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          if (!globalSearchQuery) {
                            setShowSearchResults(false);
                          }
                        }, 200);
                      }}
                      autoFocus
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 rounded-xl focus:outline-none text-sm transition-all duration-300 bg-white"
                      style={{
                        border: globalSearchQuery
                          ? '2px solid #3b82f6'
                          : '1px solid rgba(209, 213, 219, 0.5)',
                      }}
                    />
                    {globalSearchQuery && (
                      <button
                        onClick={() => {
                          setGlobalSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      <div className="p-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 px-3">Search Results</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <button
                            key={`${result.tab}-${index}`}
                            onClick={() => handleSearchResultClick(result.tab)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left group"
                          >
                            <span className="text-2xl">{result.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500">{result.keyword}</p>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 0 && globalSearchQuery && (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-gray-500">
                            No results found for &ldquo;{globalSearchQuery}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <LanguageSelectorDropdown />
            </div>
          </div>
        </div>

        {primaryAlert && user?.role !== 'public' && (
          <div className="mx-4 mt-4 mb-2 px-4 py-3 rounded-2xl border-l-4 border-red-500 bg-red-50 shadow-sm flex items-center gap-4 animate-blink">
            <AlertTriangle size={18} className="text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">{primaryAlert.message}</p>
              <p className="text-xs uppercase tracking-wider text-red-500">
                {primaryAlert.severity} · {criticalAlerts.length} critical alert
                {criticalAlerts.length > 1 ? 's' : ''} · {primaryAlert.type}
              </p>
            </div>
            <button
              onClick={() => {
                if (primaryAlertTarget) {
                  setActiveTab(primaryAlertTarget);
                }
                setSidebarOpen(true);
              }}
              className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-red-500 bg-white text-red-600 hover:bg-red-100 transition-colors"
            >
              View Alert
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-2 sm:px-4 lg:px-6">
          <Suspense fallback={<div className="p-4 sm:p-8 text-center">{t('common.loading')}</div>}>
            {renderContent()}
          </Suspense>
        </div>
      </div>

      {/* ACTION FEEDBACK COMPONENTS */}
      {/* Notification Container */}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        actionLabel="Confirm"
        onConfirm={() => {
          if (confirmDialog.action) {
            confirmDialog.action();
          }
        }}
        onCancel={() => {
          setConfirmDialog({
            isOpen: false,
            title: '',
            message: '',
            action: null,
            isDangerous: false,
          });
        }}
        isDangerous={confirmDialog.isDangerous}
      />

      {/* Recent Actions Log Panel */}
      <RecentActionsLog
        actions={actions}
        isOpen={showActionsLog}
        onClose={() => setShowActionsLog(false)}
      />

      {/* Accessibility Panel Modal */}
      <AccessibilityPanel
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      {/* Voice Assistant */}
      <VoiceAssistant data={data} alerts={alerts} />
    </div>
  );
};

export default App;
