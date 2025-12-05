import React, { useMemo } from 'react';
import { ArrowLeft, Wrench, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useSimulationData } from '../../hooks/useSimulationData';
import MaintenanceCard from '../shared/MaintenanceCard';

const HOUR_LIMITS = {
  day: 24,
  week: 168,
  month: 720,
};

export const MaintenanceDashboard = ({ onBack }) => {
  const { state, isLive } = useSimulationData();

  const pump = state?.pumpHouse || {};
  const tank = state?.overheadTank || {};
  const quality = tank?.waterQuality || {};

  // Pump maintenance metrics
  const pumpMaintenanceMetrics = useMemo(
    () => [
      {
        label: 'Operation Cycles',
        value: pump.operationCycles?.toLocaleString() || '0',
        subtext: 'Total on/off cycles',
      },
      {
        label: 'Running Hours',
        value: `${(pump.pumpRunningHours || 0).toFixed(1)} hrs`,
        subtext: 'Lifetime runtime',
      },
      {
        label: 'Vibration Level',
        value: `${pump.vibration?.toFixed(1) || '0'} mm/s`,
        subtext: pump.vibration > 8 ? '⚠️ High' : '✓ Normal',
      },
      {
        label: 'Motor Temperature',
        value: `${pump.motorTemperature?.toFixed(1) || '0'}°C`,
        subtext: pump.motorTemperature > 65 ? '⚠️ Hot' : '✓ Normal',
      },
    ],
    [pump.operationCycles, pump.pumpRunningHours, pump.vibration, pump.motorTemperature]
  );

  // Tank maintenance metrics
  const tankMaintenanceMetrics = useMemo(
    () => [
      {
        label: 'Last Cleaning',
        value: new Date(tank.lastCleaningDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        }),
        subtext: `${Math.ceil((Date.now() - tank.lastCleaningDate) / (24 * 60 * 60 * 1000))} days ago`,
      },
      {
        label: 'Tank Capacity',
        value: `${(tank.tankCapacity / 1000).toFixed(0)} kL`,
        subtext: 'Maximum volume',
      },
      {
        label: 'Current Level',
        value: `${tank.tankLevel?.toFixed(1) || 0}%`,
        subtext: tank.tankLevel < 20 ? '⚠️ Low' : '✓ Good',
      },
      {
        label: 'Water Quality',
        value: quality.pH >= 6.5 && quality.pH <= 8.5 ? 'Safe' : 'Alert',
        subtext: `pH ${quality.pH?.toFixed(1)}`,
      },
    ],
    [tank.lastCleaningDate, tank.tankCapacity, tank.tankLevel, quality.pH]
  );

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
              <Wrench className="text-orange-600" size={28} />
              Maintenance Management
            </h2>
            <p className="text-sm text-slate-500">
              Comprehensive maintenance schedules and system health monitoring
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Systems */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm md:text-lg font-semibold text-slate-600 uppercase">
              Total Systems
            </h3>
            <Wrench size={24} className="md:w-8 md:h-8 text-blue-600" />
          </div>
          <p className="text-4xl md:text-4xl font-black text-blue-600">2</p>
          <p className="text-xs md:text-base text-slate-500 mt-1">Pump & Tank</p>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm md:text-lg font-semibold text-slate-600 uppercase">
              Next Scheduled
            </h3>
            <Calendar size={24} className="md:w-8 md:h-8 text-amber-600" />
          </div>
          <p className="text-4xl md:text-4xl font-black text-amber-600">
            {Math.min(
              pump.nextMaintenanceDate
                ? Math.ceil(
                    (new Date(pump.nextMaintenanceDate) - Date.now()) / (24 * 60 * 60 * 1000)
                  )
                : 999,
              tank.nextMaintenanceDate
                ? Math.ceil(
                    (new Date(tank.nextMaintenanceDate) - Date.now()) / (24 * 60 * 60 * 1000)
                  )
                : 999
            )}
          </p>
          <p className="text-xs md:text-base text-slate-500 mt-1">days away</p>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm md:text-lg font-semibold text-slate-600 uppercase">
              System Health
            </h3>
            <CheckCircle size={24} className="md:w-8 md:h-8 text-green-600" />
          </div>
          <p className="text-4xl md:text-6xl font-black text-green-600">Good</p>
          <p className="text-xs md:text-base text-slate-500 mt-1">All systems operational</p>
        </div>
      </div>

      {/* Pump Maintenance Section */}
      <MaintenanceCard
        title="Pump Station Maintenance Schedule"
        lastMaintenanceDate={pump.lastMaintenanceDate}
        nextMaintenanceDate={pump.nextMaintenanceDate}
        maintenanceIntervalDays={pump.maintenanceIntervalDays}
        maintenanceHistory={pump.maintenanceHistory}
        type="pump"
        additionalMetrics={pumpMaintenanceMetrics}
      />

      {/* Tank Maintenance Section */}
      <MaintenanceCard
        title="Water Tank Maintenance Schedule"
        lastMaintenanceDate={tank.lastMaintenanceDate}
        nextMaintenanceDate={tank.nextMaintenanceDate}
        maintenanceIntervalDays={tank.maintenanceIntervalDays}
        maintenanceHistory={tank.maintenanceHistory}
        type="tank"
        additionalMetrics={tankMaintenanceMetrics}
      />

      {/* Maintenance Tips */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl p-6 border-2 border-slate-200">
        <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-3">
          <AlertTriangle size={24} className="text-orange-600" />
          Maintenance Best Practices
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              Pump Maintenance
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Check motor temperature regularly</li>
              <li>• Monitor vibration levels</li>
              <li>• Inspect seals for leaks</li>
              <li>• Lubricate bearings as needed</li>
              <li>• Clean filters monthly</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-blue-600" />
              Tank Maintenance
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Clean tank every 6 months</li>
              <li>• Check water quality weekly</li>
              <li>• Inspect for cracks or leaks</li>
              <li>• Test overflow systems</li>
              <li>• Monitor sediment levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
