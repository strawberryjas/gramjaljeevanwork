/**
 * React Hook for Live Water Supply Simulation Data
 *
 * Provides real-time access to the simulation engine state.
 * All UI components should use this hook to get live data.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getSystemState,
  getLiveState,
  getRealtimeHistory,
  startSimulation,
  stopSimulation,
  subscribe,
  togglePump,
  toggleValve,
  toggleTankInlet,
  toggleTankOutlet,
  acknowledgeAlert,
  clearAlerts,
  isSimulationRunning,
  setPumpTimer,
  schedulePumpStop,
  cancelPumpSchedule,
  forceSimulationState,
} from '../utils/simulationEngine';

/**
 * Main hook for accessing live simulation data
 * @param {boolean} autoStart - Whether to automatically start the simulation (default: true)
 * @returns {Object} Live state, controls, and utility functions
 */
export function useSimulationData(autoStart = true) {
  const [state, setState] = useState(getLiveState());
  const [isLive, setIsLive] = useState(false);
  const unsubscribeRef = useRef(null);

  // Subscribe to live updates
  useEffect(() => {
    if (autoStart) {
      // Start simulation and subscribe to updates
      const cleanup = startSimulation((newState) => {
        setState(newState);
      });
      setIsLive(true);

      return () => {
        cleanup();
        setIsLive(false);
      };
    }
  }, [autoStart]);

  // Manual start/stop controls
  const start = useCallback(() => {
    if (!isSimulationRunning()) {
      const cleanup = startSimulation((newState) => {
        setState(newState);
      });
      unsubscribeRef.current = cleanup;
      setIsLive(true);
    }
  }, []);

  const stop = useCallback(() => {
    stopSimulation();
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsLive(false);
  }, []);

  // Control functions
  const handleTogglePump = useCallback(() => {
    const result = togglePump();
    setState(getLiveState());
    return result;
  }, []);

  const handleToggleValve = useCallback((pipelineId) => {
    const result = toggleValve(pipelineId);
    setState(getLiveState());
    return result;
  }, []);

  const handleToggleTankInlet = useCallback(() => {
    const result = toggleTankInlet();
    setState(getLiveState());
    return result;
  }, []);

  const handleToggleTankOutlet = useCallback(() => {
    const result = toggleTankOutlet();
    setState(getLiveState());
    return result;
  }, []);

  const handleAcknowledgeAlert = useCallback((alertId) => {
    acknowledgeAlert(alertId);
    setState(getLiveState());
  }, []);

  const handleClearAlerts = useCallback(() => {
    clearAlerts();
    setState(getLiveState());
  }, []);

  const handleSetPumpTimer = useCallback((minutes, options) => {
    const result = setPumpTimer(minutes, options);
    setState(getLiveState());
    return result;
  }, []);

  const handleSchedulePumpStop = useCallback((stopTime, options) => {
    const result = schedulePumpStop(stopTime, options);
    setState(getLiveState());
    return result;
  }, []);

  const handleCancelPumpSchedule = useCallback((reason) => {
    const result = cancelPumpSchedule(reason);
    setState(getLiveState());
    return result;
  }, []);

  // Refresh state manually
  const refresh = useCallback(() => {
    setState(getLiveState());
  }, []);

  // Get historical data
  const getHistory = useCallback(() => {
    return getRealtimeHistory();
  }, []);

  // Force simulation state (for Control Center)
  const handleForceSimulationState = useCallback((component, state, customValues) => {
    console.log('🔧 useSimulationData: handleForceSimulationState called', { component, state, customValues });
    const result = forceSimulationState(component, state, customValues);
    console.log('🔧 useSimulationData: forceSimulationState returned, updating state');
    setState(getLiveState());
    console.log('🔧 useSimulationData: state updated');
    return result;
  }, []);

  return {
    // Live state
    state,
    isLive,

    // Convenience accessors
    tank: state.overheadTank,
    pump: state.pumpHouse,
    pipelines: state.pipelines,
    mcu: state.controlUnit,
    metrics: state.systemMetrics,
    alerts: state.systemMetrics?.alerts || [],
    systemStatus: state.systemStatus,
    pumpSchedule: state.pumpSchedule,

    // Quick access values
    tankLevel: state.overheadTank?.tankLevel || 0,
    pumpStatus: state.pumpHouse?.pumpStatus || 'OFF',
    totalFlow: state.systemMetrics?.totalFlowRate || 0,
    avgPressure: state.systemMetrics?.averagePressure || 0,
    efficiency: state.systemMetrics?.systemEfficiency || 0,

    // Control functions
    togglePump: handleTogglePump,
    toggleValve: handleToggleValve,
    toggleTankInlet: handleToggleTankInlet,
    toggleTankOutlet: handleToggleTankOutlet,
    acknowledgeAlert: handleAcknowledgeAlert,
    clearAlerts: handleClearAlerts,
    schedulePumpTimer: handleSetPumpTimer,
    schedulePumpStop: handleSchedulePumpStop,
    cancelPumpSchedule: handleCancelPumpSchedule,
    forceSimulationState: handleForceSimulationState,

    // Simulation control
    startSimulation: start,
    stopSimulation: stop,
    refresh,
    getHistory,

    // Raw access
    getLiveState,
  };
}

/**
 * Hook for getting specific pipeline data
 * @param {number} pipelineId - The pipeline ID (1-5)
 */
export function usePipeline(pipelineId) {
  const { state, toggleValve } = useSimulationData();

  const pipeline = state.pipelines?.find((p) => p.pipelineId === pipelineId) || null;

  const toggle = useCallback(() => {
    return toggleValve(pipelineId);
  }, [pipelineId, toggleValve]);

  return {
    pipeline,
    valveStatus: pipeline?.valveStatus || 'CLOSED',
    inletFlow: pipeline?.inlet?.flowSensor?.value || 0,
    outletFlow: pipeline?.outlet?.flowSensor?.value || 0,
    inletPressure: pipeline?.inlet?.pressureSensor?.value || 0,
    outletPressure: pipeline?.outlet?.pressureSensor?.value || 0,
    leakageProbability: pipeline?.leakageProbability || 0,
    qualityDeviation: pipeline?.qualityDeviation || 0,
    toggleValve: toggle,
  };
}

/**
 * Hook for tank monitoring
 */
export function useTank() {
  const { tank, toggleTankInlet, toggleTankOutlet } = useSimulationData();

  return {
    level: tank?.tankLevel || 0,
    capacity: tank?.tankCapacity || 50000,
    volume: tank?.currentVolume || 0,
    inletStatus: tank?.inletValveStatus || 'CLOSED',
    outletStatus: tank?.outletValveStatus || 'CLOSED',
    quality: tank?.waterQuality || {},
    temperature: tank?.temperature || 0,
    fillRate: tank?.fillRate || 0,
    drainRate: tank?.drainRate || 0,
    toggleInlet: toggleTankInlet,
    toggleOutlet: toggleTankOutlet,
  };
}

/**
 * Hook for pump monitoring
 */
export function usePump() {
  const { pump, togglePump } = useSimulationData();

  return {
    status: pump?.pumpStatus || 'OFF',
    flowOutput: pump?.pumpFlowOutput || 0,
    pressureOutput: pump?.pumpPressureOutput || 0,
    runningHours: pump?.pumpRunningHours || 0,
    powerConsumption: pump?.powerConsumption || 0,
    efficiency: pump?.pumpEfficiency || 0,
    motorTemp: pump?.motorTemperature || 0,
    vibration: pump?.vibrationLevel || 0,
    voltage: pump?.operatingVoltage || 0,
    current: pump?.operatingCurrent || 0,
    toggle: togglePump,
  };
}

/**
 * Hook for water quality monitoring
 */
export function useWaterQuality() {
  const { tank, pipelines } = useSimulationData();

  const tankQuality = tank?.waterQuality || {};

  const pipelineQualities =
    pipelines?.map((p) => ({
      pipelineId: p.pipelineId,
      pipelineName: p.pipelineName,
      inlet: p.inlet?.qualitySensor || {},
      outlet: p.outlet?.qualitySensor || {},
      deviation: p.qualityDeviation || 0,
    })) || [];

  return {
    tankQuality,
    turbidity: tankQuality.turbidity || 0,
    pH: tankQuality.pH || 7,
    chlorine: tankQuality.chlorine || 0,
    TDS: tankQuality.TDS || 0,
    pipelineQualities,
  };
}

/**
 * Hook for alerts and notifications
 */
export function useAlerts() {
  const { alerts, acknowledgeAlert, clearAlerts } = useSimulationData();

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged);
  const warningAlerts = alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged);
  const infoAlerts = alerts.filter((a) => a.severity === 'INFO' && !a.acknowledged);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return {
    all: alerts,
    critical: criticalAlerts,
    warnings: warningAlerts,
    info: infoAlerts,
    unacknowledgedCount,
    acknowledge: acknowledgeAlert,
    clear: clearAlerts,
  };
}

/**
 * Hook for MCU/Control Unit monitoring
 */
export function useMCU() {
  const { mcu } = useSimulationData();

  return {
    health: mcu?.MCUHealth || 0,
    uptime: mcu?.MCUUptime || 0,
    networkStatus: mcu?.networkStatus || 'DISCONNECTED',
    signalStrength: mcu?.signalStrength || 0,
    commandsReceived: mcu?.MCUCommandsReceived || 0,
    commandsExecuted: mcu?.MCUCommandsExecuted || 0,
    commandsFailed: mcu?.MCUCommandsFailed || 0,
    lastCommand: mcu?.lastCommand || null,
    executedCommands: mcu?.executedCommands || [],
    pendingCommands: mcu?.pendingCommands || [],
    pumpRelay: mcu?.pumpRelayStatus || 'OFF',
    valveRelays: mcu?.valveRelays || {},
  };
}

/**
 * Hook for system metrics overview
 */
export function useSystemMetrics() {
  const { metrics, systemStatus } = useSimulationData();

  return {
    status: systemStatus,
    totalFlow: metrics?.totalFlowRate || 0,
    avgPressure: metrics?.averagePressure || 0,
    efficiency: metrics?.systemEfficiency || 0,
    totalLeakage: metrics?.totalLeakage || 0,
    avgQualityDeviation: metrics?.averageQualityDeviation || 0,
    householdsServed: metrics?.totalHouseholdsServed || 0,
    dailyWaterSupplied: metrics?.dailyWaterSupplied || 0,
  };
}

// Default export
export default useSimulationData;
