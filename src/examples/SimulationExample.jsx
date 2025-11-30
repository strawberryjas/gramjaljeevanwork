/**
 * Example: How to use the Water Supply Simulation in React Components
 * 
 * This example shows how any page can connect to the live simulation
 * and display real-time IoT-like data.
 */

import React from 'react';
import { useSimulationData, usePump, useTank, usePipeline, useWaterQuality, useAlerts } from '../hooks/useSimulationData';

// ============================================================================
// EXAMPLE 1: Full System Overview
// ============================================================================

export const SystemOverview = () => {
  const { 
    state, 
    isLive, 
    tankLevel, 
    pumpStatus, 
    totalFlow, 
    avgPressure,
    togglePump,
    toggleValve 
  } = useSimulationData();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">System Overview</h2>
      
      {/* Status Indicator */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 ${
        isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        {isLive ? 'LIVE' : 'OFFLINE'}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Tank Level</p>
          <p className="text-2xl font-bold text-blue-600">{tankLevel.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Pump Status</p>
          <p className={`text-2xl font-bold ${pumpStatus === 'ON' ? 'text-green-600' : 'text-gray-600'}`}>
            {pumpStatus}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Flow</p>
          <p className="text-2xl font-bold text-purple-600">{totalFlow.toFixed(0)} L/min</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-gray-600">Pressure</p>
          <p className="text-2xl font-bold text-amber-600">{avgPressure.toFixed(2)} bar</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          onClick={togglePump}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            pumpStatus === 'ON' 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {pumpStatus === 'ON' ? 'Turn Pump OFF' : 'Turn Pump ON'}
        </button>

        {[1, 2, 3, 4, 5].map(id => (
          <button 
            key={id}
            onClick={() => toggleValve(id)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-bold"
          >
            Toggle Valve {id}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Tank Monitor Component
// ============================================================================

export const TankMonitor = () => {
  const { level, capacity, volume, inletStatus, outletStatus, quality, toggleInlet, toggleOutlet } = useTank();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Tank Status</h2>
      
      {/* Tank Visual */}
      <div className="relative w-32 h-48 border-4 border-blue-600 rounded-b-lg mx-auto mb-4 overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500"
          style={{ height: `${level}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-blue-300 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white drop-shadow-lg">{level.toFixed(1)}%</span>
        </div>
      </div>

      {/* Tank Info */}
      <div className="space-y-2 text-sm">
        <p><strong>Capacity:</strong> {capacity.toLocaleString()} L</p>
        <p><strong>Current Volume:</strong> {volume.toLocaleString()} L</p>
        <p><strong>Inlet Valve:</strong> {inletStatus}</p>
        <p><strong>Outlet Valve:</strong> {outletStatus}</p>
      </div>

      {/* Water Quality */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Water Quality</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>Turbidity: {quality.turbidity?.toFixed(2)} NTU</p>
          <p>pH: {quality.pH?.toFixed(2)}</p>
          <p>Chlorine: {quality.chlorine?.toFixed(2)} mg/L</p>
          <p>TDS: {quality.TDS?.toFixed(0)} ppm</p>
        </div>
      </div>

      {/* Valve Controls */}
      <div className="flex gap-2 mt-4">
        <button onClick={toggleInlet} className="px-4 py-2 bg-blue-600 text-white rounded">
          {inletStatus === 'OPEN' ? 'Close Inlet' : 'Open Inlet'}
        </button>
        <button onClick={toggleOutlet} className="px-4 py-2 bg-blue-600 text-white rounded">
          {outletStatus === 'OPEN' ? 'Close Outlet' : 'Open Outlet'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Pump Monitor Component
// ============================================================================

export const PumpMonitor = () => {
  const { status, flowOutput, pressureOutput, runningHours, powerConsumption, motorTemp, toggle } = usePump();

  const isRunning = status === 'ON';

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Pump Status
        <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Status</p>
          <p className={`text-xl font-bold ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>{status}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Flow Output</p>
          <p className="text-xl font-bold">{flowOutput.toFixed(0)} L/min</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Pressure</p>
          <p className="text-xl font-bold">{pressureOutput.toFixed(2)} bar</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Power</p>
          <p className="text-xl font-bold">{powerConsumption.toFixed(1)} kW</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Motor Temp</p>
          <p className={`text-xl font-bold ${motorTemp > 55 ? 'text-red-600' : 'text-gray-700'}`}>
            {motorTemp.toFixed(1)}°C
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Running Hours</p>
          <p className="text-xl font-bold">{runningHours.toFixed(1)} hrs</p>
        </div>
      </div>

      <button 
        onClick={toggle}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
          isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isRunning ? 'STOP PUMP' : 'START PUMP'}
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Pipeline Monitor Component
// ============================================================================

export const PipelineMonitor = ({ pipelineId }) => {
  const { 
    pipeline, 
    valveStatus, 
    inletFlow, 
    outletFlow, 
    inletPressure, 
    outletPressure, 
    leakageProbability, 
    toggleValve 
  } = usePipeline(pipelineId);

  if (!pipeline) return <div>Pipeline not found</div>;

  const flowLoss = inletFlow - outletFlow;
  const hasLeakage = leakageProbability > 20;

  return (
    <div className={`p-6 rounded-lg shadow ${hasLeakage ? 'bg-red-50 border-2 border-red-300' : 'bg-white'}`}>
      <h2 className="text-lg font-bold mb-2">{pipeline.pipelineName}</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-bold rounded ${
          valveStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          Valve: {valveStatus}
        </span>
        {hasLeakage && (
          <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-700 animate-pulse">
            ⚠ Leakage Risk: {leakageProbability}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500">Inlet Flow</p>
          <p className="font-bold">{inletFlow} L/min</p>
        </div>
        <div>
          <p className="text-gray-500">Outlet Flow</p>
          <p className="font-bold">{outletFlow} L/min</p>
        </div>
        <div>
          <p className="text-gray-500">Inlet Pressure</p>
          <p className="font-bold">{inletPressure.toFixed(2)} bar</p>
        </div>
        <div>
          <p className="text-gray-500">Outlet Pressure</p>
          <p className="font-bold">{outletPressure.toFixed(2)} bar</p>
        </div>
        <div>
          <p className="text-gray-500">Flow Loss</p>
          <p className={`font-bold ${flowLoss > 5 ? 'text-red-600' : 'text-gray-700'}`}>
            {flowLoss.toFixed(1)} L/min
          </p>
        </div>
        <div>
          <p className="text-gray-500">Length</p>
          <p className="font-bold">{pipeline.pipelineLength}m</p>
        </div>
      </div>

      <button 
        onClick={toggleValve}
        className={`w-full py-2 rounded font-bold text-white ${
          valveStatus === 'OPEN' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {valveStatus === 'OPEN' ? 'Close Valve' : 'Open Valve'}
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Alerts Panel
// ============================================================================

export const AlertsPanel = () => {
  const { all, critical, warnings, unacknowledgedCount, acknowledge, clear } = useAlerts();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">System Alerts</h2>
        {unacknowledgedCount > 0 && (
          <span className="px-2 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
            {unacknowledgedCount}
          </span>
        )}
      </div>

      {all.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No active alerts</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {all.map(alert => (
            <div 
              key={alert.id}
              className={`p-3 rounded-lg flex items-start gap-3 ${
                alert.acknowledged ? 'bg-gray-50 opacity-60' :
                alert.severity === 'CRITICAL' ? 'bg-red-50 border-l-4 border-red-600' :
                alert.severity === 'WARNING' ? 'bg-amber-50 border-l-4 border-amber-600' :
                'bg-blue-50 border-l-4 border-blue-600'
              }`}
            >
              <div className="flex-1">
                <p className={`font-bold text-sm ${
                  alert.severity === 'CRITICAL' ? 'text-red-700' :
                  alert.severity === 'WARNING' ? 'text-amber-700' :
                  'text-blue-700'
                }`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {!alert.acknowledged && (
                <button 
                  onClick={() => acknowledge(alert.id)}
                  className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Dismiss
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {all.length > 0 && (
        <button 
          onClick={clear}
          className="mt-4 w-full py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded"
        >
          Clear All Alerts
        </button>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Complete Dashboard (All Components Together)
// ============================================================================

export const CompleteDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Water Supply Monitoring System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <TankMonitor />
          <PumpMonitor />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <SystemOverview />
          <AlertsPanel />
        </div>

        {/* Right Column - Pipelines */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Pipeline Status</h2>
          {[1, 2, 3, 4, 5].map(id => (
            <PipelineMonitor key={id} pipelineId={id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteDashboard;

