import React, { useState } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Power, Gauge, Zap, Thermometer, Activity, ArrowLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatDuration = (ms = 0) => {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  return `${seconds}s`;
};

const toLocalInputValue = (date) => {
  if (!(date instanceof Date)) return '';
  const pad = (num) => `${num}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatStopLabel = (value) => {
  if (!value) return '—';
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const PumpDetails = ({ onBack }) => {
  const {
    state,
    togglePump,
    isLive,
    schedulePumpTimer,
    schedulePumpStop,
    cancelPumpSchedule
  } = useSimulationData();

  const pump = state?.pumpHouse || {};
  const isPumpOn = pump.pumpStatus === 'ON';
  const schedule = state?.pumpSchedule || {};
  const isTimerActive = schedule.mode === 'TIMER';
  const isStopScheduled = schedule.mode === 'SCHEDULED';
  const countdownLabel = formatDuration(schedule.timerRemainingMs);
  const stopLabel = formatStopLabel(schedule.timerEnd);

  const [timerMinutes, setTimerMinutes] = useState(15);
  const [scheduledStop, setScheduledStop] = useState(() => toLocalInputValue(new Date(Date.now() + 30 * 60 * 1000)));

  const handleTimerStart = () => {
    const minutes = Math.max(1, Number(timerMinutes) || 0);
    const result = schedulePumpTimer(minutes);
    if (!result?.success) {
      console.warn('Unable to start pump timer', result?.reason);
    }
  };

  const handleScheduleStop = () => {
    if (!scheduledStop) return;
    const result = schedulePumpStop(scheduledStop);
    if (!result?.success) {
      console.warn('Unable to schedule pump stop', result?.reason);
    }
  };

  const handleClearSchedule = () => {
    cancelPumpSchedule('USER_CLEAR');
  };

  // Create history data for charts
  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    pressure: (pump.pumpPressureOutput || 0) + Math.random() * 0.5,
    flow: (pump.pumpFlowOutput || 0) + Math.random() * 10,
    power: (pump.powerConsumption || 0) + Math.random() * 0.5,
    efficiency: (pump.pumpEfficiency || 0) + Math.random() * 2,
  }));

  const pumpMetrics = [
    {
      label: 'Status',
      value: pump.pumpStatus || 'OFF',
      icon: Power,
      color: isPumpOn ? 'green' : 'gray',
      unit: ''
    },
    {
      label: 'Flow Rate',
      value: (pump.pumpFlowOutput || 0).toFixed(1),
      icon: Activity,
      color: 'blue',
      unit: 'L/min'
    },
    {
      label: 'Pressure',
      value: (pump.pumpPressureOutput || 0).toFixed(2),
      icon: Gauge,
      color: 'emerald',
      unit: 'Bar'
    },
    {
      label: 'Power Consumption',
      value: (pump.powerConsumption || 0).toFixed(2),
      icon: Zap,
      color: 'purple',
      unit: 'kW'
    },
    {
      label: 'Motor Temperature',
      value: (pump.motorTemperature || 25).toFixed(1),
      icon: Thermometer,
      color: pump.motorTemperature > 65 ? 'red' : 'amber',
      unit: '°C'
    },
    {
      label: 'Efficiency',
      value: (pump.pumpEfficiency || 0).toFixed(1),
      icon: CheckCircle,
      color: pump.pumpEfficiency > 70 ? 'green' : 'amber',
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
              <Power className="text-green-600" size={28} />
              Pump Station Details
            </h2>
            <p className="text-sm text-slate-500">Complete pump monitoring and control</p>
          </div>
        </div>
        {isLive && (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            LIVE
          </span>
        )}
      </div>

      {/* Pump Scheduler - Moved from Dashboard */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-inner space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pump Scheduler</p>
            <p className="text-sm text-slate-300">Define runtime or schedule automatic shutdown</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600">
              Mode: {schedule.mode || 'MANUAL'}
            </span>
            {(schedule.timerRemainingMs > 0 || isStopScheduled) && (
              <span className={`px-3 py-1 rounded-full border ${isTimerActive ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100' : 'border-blue-400 bg-blue-500/20 text-blue-100'}`}>
                {isTimerActive ? `Stops in ${countdownLabel}` : `Auto stop ${stopLabel}`}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">Run for (minutes)</label>
            <div className="mt-1 flex gap-2">
              <input
                type="number"
                min={1}
                max={240}
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleTimerStart}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors"
              >
                Start
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">Stop at (local time)</label>
            <div className="mt-1 flex gap-2">
              <input
                type="datetime-local"
                value={scheduledStop || ''}
                onChange={(e) => setScheduledStop(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleScheduleStop}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-400 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase text-slate-400 font-semibold">Next Auto Stop</p>
              <p className="text-2xl font-black">{isTimerActive ? countdownLabel : stopLabel}</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {schedule.lastEvent?.type ? `Last: ${schedule.lastEvent.type.replace(/_/g, ' ')}` : 'Awaiting instruction'}
            </p>
            <button
              onClick={handleClearSchedule}
              className="mt-3 text-xs font-bold text-rose-200 hover:text-rose-400 text-left"
            >
              Clear schedule
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          System failsafe will always cut the pump at 100% tank level, even if a timer is running.
        </p>
      </div>

      {/* Pump Control Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isPumpOn
                ? 'bg-green-500 shadow-lg shadow-green-300 animate-pulse'
                : 'bg-slate-400'
                }`}
            >
              <Power size={40} className={`text-white ${isPumpOn ? 'animate-spin-slow' : ''}`} />
            </div>
            <div>
              <p className="text-sm text-slate-300">Current Status</p>
              <p className="text-3xl font-black">{pump.pumpStatus || 'OFF'}</p>
              <p className="text-xs text-slate-400 mt-1">
                Running Hours: {pump.pumpRunningHours || 0}h |
                Power Factor: {(pump.powerFactor || 0.95).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={togglePump}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${isPumpOn
              ? 'bg-red-600 hover:bg-red-700 shadow-lg'
              : 'bg-green-600 hover:bg-green-700 shadow-lg'
              }`}
          >
            {isPumpOn ? 'Turn OFF Pump' : 'Turn ON Pump'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pumpMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = metric.color === 'green' ? 'text-green-600' :
            metric.color === 'red' ? 'text-red-600' :
              metric.color === 'amber' ? 'text-amber-600' :
                metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'emerald' ? 'text-emerald-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                      'text-gray-600';

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
        {/* Pressure & Flow Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-emerald-600" />
            Pressure & Flow Rate
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="pressure" stroke="#10b981" fillOpacity={1} fill="url(#colorPressure)" name="Pressure (Bar)" />
              <Area yAxisId="right" type="monotone" dataKey="flow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFlow)" name="Flow (L/min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Power & Efficiency Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-purple-600" />
            Power & Efficiency
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={2} name="Power (kW)" />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          Pump Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Pump ID</span>
              <span className="text-sm font-bold text-black">PUMP-001</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Running Hours</span>
              <span className="text-sm font-bold text-black">{pump.pumpRunningHours || 0} hours</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Voltage</span>
              <span className="text-sm font-bold text-black">{(pump.voltage || 220).toFixed(1)} V</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Power Factor</span>
              <span className="text-sm font-bold text-black">{(pump.powerFactor || 0.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Discharge Rate</span>
              <span className="text-sm font-bold text-black">{(pump.pumpDischargeRate || 0).toFixed(1)} L/min</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600">Last Maintenance</span>
              <span className="text-sm font-bold text-black">7 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



