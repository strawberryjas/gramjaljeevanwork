import { useState, useEffect } from 'react';
import { useStickyState } from './useStickyState';
import { INITIAL_SENSORS, THRESHOLDS } from '../constants/thresholds';
import {
  generateMock24hFlow,
  generateMockTickets,
  generateResponseTimeData,
} from '../constants/mockData';

// IoT Simulation Engine Hook
export const useIoTSimulation = (active, user) => {
  const [data, setData] = useStickyState(INITIAL_SENSORS, 'gjj_sensor_data_v18');
  const [logs, setLogs] = useStickyState([], 'gjj_operator_logs');
  const [tickets, setTickets] = useStickyState(generateMockTickets(), 'gjj_tickets');

  const [history, setHistory] = useState([]);
  const [flow24h] = useState(generateMock24hFlow());
  const [responseTimeData] = useState(generateResponseTimeData());
  const [alerts, setAlerts] = useState([]);
  const [mlPrediction, setMlPrediction] = useState({ anomalyScore: 0, status: 'HEALTHY' });

  const addLog = (action, category = 'SYSTEM') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      operator: user?.name || 'System',
      role: user?.role || 'System',
      action: action,
      category: category,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50));
  };

  const resolveTicket = (id) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)));
    addLog(`Resolved Ticket ${id}`, 'SUPPORT');
  };

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const noise = (mag) => (Math.random() - 0.5) * mag;
        const isRunning = prev.pumpStatus === 'RUNNING';
        const isOpen = prev.valveStatus === 'OPEN';

        let targetFlow = 0;
        let targetPressure = 0.5;
        const voltage = 220 + noise(5);

        if (isRunning) {
          if (isOpen) {
            targetFlow = 450;
            targetPressure = 4.2;
          } else {
            targetFlow = 0;
            targetPressure = 6.5;
          }
        }

        const flowDropFactor = Math.random() > 0.98 ? 0.8 : 1.0;
        const currentFlow = targetFlow * flowDropFactor + noise(10);
        const powerConsumption = isRunning ? (currentFlow * targetPressure) / 300 : 0;
        const efficiency = isRunning ? Math.min(95, (currentFlow / 450) * 90 + noise(2)) : 0;
        const timeStepHours = 2 / 60;
        const energyStep = (powerConsumption * timeStepHours) / 10;

        const idealFlow = 450;
        const dropPercent = isRunning
          ? Math.max(0, ((idealFlow - currentFlow) / idealFlow) * 100)
          : 0;
        const idealEnergy = 12.5;
        const spikePercent = isRunning
          ? Math.max(0, ((powerConsumption - idealEnergy) / idealEnergy) * 100)
          : 0;
        const actualFillRate = 5;
        const expectedFillRate = 6;
        const delayPercent = Math.max(
          0,
          ((expectedFillRate - actualFillRate) / expectedFillRate) * 100
        );

        const newData = {
          ...prev,
          pumpRunningHours: isRunning
            ? prev.pumpRunningHours + timeStepHours
            : prev.pumpRunningHours,
          dailyEnergyKWh: prev.dailyEnergyKWh + energyStep,

          pumpMotorTemp: isRunning
            ? Math.min(90, prev.pumpMotorTemp + 0.5)
            : Math.max(30, prev.pumpMotorTemp - 0.5),
          pumpFlowRate: Math.max(0, currentFlow),
          pipePressure: Math.max(0, targetPressure + noise(0.2)),
          tankLevel: Math.max(
            0,
            Math.min(100, prev.tankLevel + (isRunning && isOpen ? 0.05 : -0.02))
          ),

          pumpVoltage: voltage,
          pumpPower: powerConsumption,
          pumpEfficiency: efficiency,
          powerFactor: 0.92 + noise(0.05),

          areaFlowA: Math.max(0, currentFlow * 0.5 + noise(5)),
          areaFlowB: Math.max(0, currentFlow * 0.3 + noise(5)),
          areaFlowC: Math.max(0, currentFlow * 0.2 + noise(5)),

          tankTimeFill: isRunning && prev.tankLevel < 100 ? (100 - prev.tankLevel) * 2.5 : 0,
          tankTimeEmpty: !isRunning && prev.tankLevel > 0 ? prev.tankLevel * 5 : 0,
          tankOverflow: prev.tankLevel > 98,

          predFlowDropPercent: dropPercent,
          predEnergySpikePercent: spikePercent,
          predTempTrend: prev.pumpMotorTemp > 80 ? 'Rising' : 'Stable',
          predTankDelayPercent: delayPercent,
          predLowFlowEvents: dropPercent > 20 ? prev.predLowFlowEvents + 1 : prev.predLowFlowEvents,

          pipeLeakDropDetected: isRunning && currentFlow < THRESHOLDS.flowLeakThreshold,
          pipeBurstDetected: isRunning && targetPressure < 2.0,
          leakHighRunHours: prev.pumpRunningHours > 10,

          qualityPH: Math.max(0, Math.min(14, 7.2 + noise(0.1))),
          qualityTurbidity: Math.max(0, 2.1 + noise(0.2)),
          qualityChlorine: Math.max(0, 0.5 + noise(0.05)),
          qualityTDS: Math.max(0, 250 + noise(5)),
          qualityIron: 0.1 + Math.abs(noise(0.01)),
          qualityFluoride: 0.8 + Math.abs(noise(0.02)),
        };

        const newAlerts = [];
        if (newData.pipeLeakDropDetected)
          newAlerts.push({
            id: 'leak',
            type: 'critical',
            msg: 'Sudden Flow Drop: Possible Leak',
            category: 'NETWORK',
          });
        if (newData.pipeBurstDetected)
          newAlerts.push({
            id: 'burst',
            type: 'critical',
            msg: 'Sudden Pressure Loss: Burst Pipe',
            category: 'NETWORK',
          });
        if (newData.pumpMotorTemp > THRESHOLDS.tempHigh)
          newAlerts.push({
            id: 'temp',
            type: 'warning',
            msg: 'Pump Overheating',
            category: 'PUMP',
          });
        if (newData.tankOverflow)
          newAlerts.push({
            id: 'overflow',
            type: 'warning',
            msg: 'Tank Overflow Warning',
            category: 'TANK',
          });

        setAlerts((prevAlerts) => {
          const ids = new Set(prevAlerts.map((a) => a.id));
          const uniqueNew = newAlerts.filter((a) => !ids.has(a.id));
          return [...uniqueNew, ...prevAlerts].slice(0, 5);
        });

        let score = 0;
        if (newData.pumpMotorTemp > 80) score += 40;
        if (newData.predFlowDropPercent > 20) score += 30;
        setMlPrediction({
          anomalyScore: score,
          status: score > 50 ? 'ANOMALY DETECTED' : 'OPTIMAL',
        });

        return newData;
      });

      setHistory((prev) => {
        const newEntry = {
          time: new Date().toLocaleTimeString([], { hour12: false }),
          ...data,
        };
        return [...prev, newEntry].slice(-30);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [active, data]);

  const togglePump = () => {
    const newStatus = data.pumpStatus === 'RUNNING' ? 'STOPPED' : 'RUNNING';
    const now = new Date().toLocaleString();
    setData((prev) => ({
      ...prev,
      pumpStatus: newStatus,
      pumpLastStartTime: newStatus === 'RUNNING' ? now : prev.pumpLastStartTime,
      pumpLastStopTime: newStatus === 'STOPPED' ? now : prev.pumpLastStopTime,
      dailyDistributionCycles:
        newStatus === 'RUNNING' ? prev.dailyDistributionCycles + 1 : prev.dailyDistributionCycles,
    }));
    addLog(`Switched Pump ${newStatus}`, 'OPERATION');
  };

  const toggleValve = () => {
    const newStatus = data.valveStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    setData((prev) => ({
      ...prev,
      valveStatus: newStatus,
      valveLastOpTime: (Math.random() * 2 + 0.5).toFixed(1),
    }));
    addLog(`Switched Outlet Valve ${newStatus}`, 'OPERATION');
  };

  const forceAnomaly = (type) => {
    addLog(`SIMULATION: Triggered ${type} Anomaly`, 'TEST');
    if (type === 'LEAK') {
      setData((prev) => ({ ...prev, pumpFlowRate: 300 }));
    }
  };

  const logInspection = (details) => {
    const now = new Date().toLocaleString();
    setData((prev) => ({
      ...prev,
      lastInspectionDate: now,
      lastInspectionOperator: user.name,
      lastVisualLeakCheck: details,
    }));
    addLog(`Routine Inspection: ${details}`, 'INSPECTION');
  };

  const logWaterTest = (location) => {
    const now = new Date().toLocaleString();
    setData((prev) => ({
      ...prev,
      lastTestTime: now,
      lastTestLocation: location,
      lastTestOperator: user?.name || 'Unknown',
    }));
    addLog(`Water Quality Test Logged @ ${location}`, 'QUALITY');
  };

  return {
    data,
    history,
    flow24h,
    tickets,
    responseTimeData,
    alerts,
    mlPrediction,
    logs,
    togglePump,
    toggleValve,
    forceAnomaly,
    setData,
    logInspection,
    logWaterTest,
    resolveTicket,
  };
};
