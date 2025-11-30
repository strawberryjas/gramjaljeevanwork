/**
 * Water Supply Simulation Engine
 * 
 * This engine provides realistic IoT-like behavior for a rural water supply system.
 * All values react logically like real hardware - the user should never know it's simulated.
 */

// ============================================================================
// GLOBAL STATE - Single Source of Truth
// ============================================================================

let systemState = {
  systemId: "GJJ-RWS-001",
  systemName: "Gram Jal Jeevan - Rural Water Supply System",
  lastUpdated: new Date().toISOString(),
  systemStatus: "OPERATIONAL",

  overheadTank: {
    tankId: "OHT-001",
    tankLevel: 72.5,
    tankCapacity: 50000,
    currentVolume: 36250,
    inletValveStatus: "OPEN",
    outletValveStatus: "OPEN",
    waterQuality: {
      turbidity: 1.2,
      pH: 7.3,
      chlorine: 0.8,
      TDS: 320
    },
    temperature: 28.5,
    fillRate: 0,
    drainRate: 0,
    isFilling: false
  },

  controlUnit: {
    mcuId: "MCU-001",
    pumpRelayStatus: "ON",
    valveRelays: {
      pipeline1: "OPEN",
      pipeline2: "OPEN",
      pipeline3: "OPEN",
      pipeline4: "CLOSED",
      pipeline5: "OPEN"
    },
    qualitySensorStatus: "ACTIVE",
    pressureSensorStatus: "ACTIVE",
    flowSensorStatus: "ACTIVE",
    MCUHealth: 98.5,
    MCUUptime: 864000,
    MCUCommandsReceived: 1547,
    MCUCommandsExecuted: 1542,
    MCUCommandsFailed: 5,
    lastCommand: null,
    executedCommands: [],
    pendingCommands: [],
    networkStatus: "CONNECTED",
    signalStrength: -42,
    lastHeartbeat: new Date().toISOString()
  },

  pumpHouse: {
    pumpId: "PUMP-001",
    pumpStatus: "ON",
    pumpRunningHours: 1247.5,
    powerConsumption: 8.2,
    pumpPressureOutput: 4.5,
    pumpFlowOutput: 420,
    pumpEfficiency: 85,
    motorTemperature: 42.3,
    vibrationLevel: 2.1,
    operatingVoltage: 415,
    operatingCurrent: 12.5,
    powerFactor: 0.85
  },

  pipelines: [
    createPipeline(1, "Main Distribution - Ward 1", 1250, 200, "OPEN", 85, 4.2, 82, 3.8, 5, 245),
    createPipeline(2, "Secondary Line - Ward 2", 980, 150, "OPEN", 68, 4.0, 60, 3.2, 12, 189),
    createPipeline(3, "Extension Line - Ward 3", 750, 100, "OPEN", 52, 3.9, 51, 3.7, 3, 156),
    createPipeline(4, "Booster Line - Ward 4", 1100, 150, "CLOSED", 0, 0, 0, 0, 0, 0),
    createPipeline(5, "Emergency Line - Ward 5", 650, 100, "OPEN", 48, 3.8, 35, 2.8, 45, 98)
  ],

  systemMetrics: {
    totalFlowRate: 228,
    averagePressure: 4.5,
    systemEfficiency: 87,
    totalLeakage: 25,
    averageQualityDeviation: 3.4,
    totalHouseholdsServed: 688,
    dailyWaterSupplied: 0,
    alerts: [],
    lastAlertTime: null
  },

  realtimeHistory: [],
  pumpSchedule: createInitialPumpSchedule()
};

// Helper function to create pipeline objects
function createPipeline(id, name, length, diameter, valveStatus, inletFlow, inletPressure, outletFlow, outletPressure, leakageProb, households) {
  const tankQuality = { turbidity: 1.2, pH: 7.3, chlorine: 0.8, TDS: 320 };
  const qualityDrift = leakageProb / 100;
  
  return {
    pipelineId: id,
    pipelineName: name,
    pipelineLength: length,
    pipelineDiameter: diameter,
    valveStatus: valveStatus,
    leakageProbability: leakageProb,
    qualityDeviation: leakageProb * 0.2,
    inlet: {
      flowSensor: { value: inletFlow, unit: "L/min", status: "ACTIVE", sensorId: `FS-${id}A` },
      pressureSensor: { value: inletPressure, unit: "bar", status: "ACTIVE", sensorId: `PS-${id}A` },
      qualitySensor: { 
        turbidity: tankQuality.turbidity + (Math.random() * 0.1), 
        pH: tankQuality.pH + (Math.random() * 0.1 - 0.05), 
        chlorine: tankQuality.chlorine - (Math.random() * 0.05), 
        TDS: tankQuality.TDS + (Math.random() * 5),
        status: "ACTIVE", 
        sensorId: `QS-${id}A` 
      }
    },
    outlet: {
      flowSensor: { value: outletFlow, unit: "L/min", status: "ACTIVE", sensorId: `FS-${id}B` },
      pressureSensor: { value: outletPressure, unit: "bar", status: "ACTIVE", sensorId: `PS-${id}B` },
      qualitySensor: { 
        turbidity: tankQuality.turbidity + qualityDrift * 0.5 + (Math.random() * 0.2), 
        pH: tankQuality.pH - qualityDrift * 0.3 + (Math.random() * 0.1 - 0.05), 
        chlorine: tankQuality.chlorine - qualityDrift * 0.15, 
        TDS: tankQuality.TDS + qualityDrift * 25,
        status: "ACTIVE", 
        sensorId: `QS-${id}B` 
      }
    },
    estimatedLeakage: Math.round(inletFlow - outletFlow),
    flowLoss: Math.round(inletFlow - outletFlow),
    householdsServed: households
  };
}

function createInitialPumpSchedule(overrides = {}) {
  return {
    mode: "MANUAL", // MANUAL | TIMER | SCHEDULED
    timerDurationMinutes: 0,
    timerEnd: null,
    timerRemainingMs: 0,
    scheduledStopTime: null,
    autoStopAtFull: true,
    lastEvent: null,
    ...overrides
  };
}

// ============================================================================
// SIMULATION CONSTANTS
// ============================================================================

const SIMULATION_INTERVAL_MS = 1000; // 1 second updates
const PUMP_BASE_PRESSURE = 4.5; // bar
const PUMP_BASE_FLOW = 420; // L/min
const PUMP_POWER_KWH = 8.2;
const MIN_TANK_LEVEL = 15; // Auto-shutoff threshold
const MAX_TANK_LEVEL = 100;
const PRESSURE_DROP_PER_KM = 0.8; // bar per km
const FLOW_NOISE = 0.05; // 5% random variation
const MIN_TIMER_MINUTES = 1;
const MAX_TIMER_MINUTES = 240;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomVariation(base, variancePct = 0.05) {
  return base * (1 + (Math.random() * 2 - 1) * variancePct);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function generateTimestamp() {
  return new Date().toISOString();
}

// ============================================================================
// MCU COMMAND SYSTEM
// ============================================================================

function sendMCUCommand(device, action, params = {}) {
  const mcu = systemState.controlUnit;
  const command = {
    id: `CMD-${Date.now()}`,
    device: device,
    action: action,
    params: params,
    timestamp: generateTimestamp(),
    status: "PENDING"
  };

  mcu.MCUCommandsReceived++;
  mcu.pendingCommands.push(command);

  // Simulate MCU processing delay (instant for UI responsiveness)
  const result = executeMCUCommand(command);
  
  return result;
}

function executeMCUCommand(command) {
  const mcu = systemState.controlUnit;
  const tank = systemState.overheadTank;
  
  // Safety checks
  if (command.device === "PUMP" && command.action === "ON") {
    if (tank.tankLevel < MIN_TANK_LEVEL) {
      command.status = "REJECTED";
      command.reason = "Tank level too low for pump operation";
      mcu.MCUCommandsFailed++;
      logCommand(command);
      return { success: false, reason: command.reason };
    }
  }

  // Execute command
  try {
    switch (command.device) {
      case "PUMP":
        systemState.pumpHouse.pumpStatus = command.action;
        mcu.pumpRelayStatus = command.action;
        clearPumpSchedule(command.action === "ON" ? "MANUAL_ON" : "MANUAL_OFF");
        break;
      case "VALVE":
        const pipelineId = command.params.pipelineId;
        const pipeline = systemState.pipelines.find(p => p.pipelineId === pipelineId);
        if (pipeline) {
          pipeline.valveStatus = command.action;
          mcu.valveRelays[`pipeline${pipelineId}`] = command.action;
        }
        break;
      case "TANK_INLET":
        tank.inletValveStatus = command.action;
        break;
      case "TANK_OUTLET":
        tank.outletValveStatus = command.action;
        break;
      default:
        throw new Error(`Unknown device: ${command.device}`);
    }

    command.status = "EXECUTED";
    mcu.MCUCommandsExecuted++;
    mcu.lastCommand = command;
    logCommand(command);

    // Immediately update all sensors
    updateAllSensors();

    return { success: true, command: command };
  } catch (error) {
    command.status = "FAILED";
    command.reason = error.message;
    mcu.MCUCommandsFailed++;
    logCommand(command);
    return { success: false, reason: error.message };
  }
}

function logCommand(command) {
  const mcu = systemState.controlUnit;
  
  // Remove from pending
  mcu.pendingCommands = mcu.pendingCommands.filter(c => c.id !== command.id);
  
  // Add to executed (keep last 50)
  mcu.executedCommands.unshift(command);
  if (mcu.executedCommands.length > 50) {
    mcu.executedCommands.pop();
  }
}

// ============================================================================
// PUMP CONTROL
// ============================================================================

export function togglePump() {
  const currentStatus = systemState.pumpHouse.pumpStatus;
  const newStatus = currentStatus === "ON" ? "OFF" : "ON";
  return sendMCUCommand("PUMP", newStatus);
}

export function setPumpStatus(status) {
  if (status !== "ON" && status !== "OFF") {
    return { success: false, reason: "Invalid pump status" };
  }
  return sendMCUCommand("PUMP", status);
}

// ============================================================================
// PUMP SCHEDULER
// ============================================================================

function ensurePumpSchedule() {
  if (!systemState.pumpSchedule) {
    systemState.pumpSchedule = createInitialPumpSchedule();
  }
  return systemState.pumpSchedule;
}

function clearPumpSchedule(reason = "RESET") {
  const current = ensurePumpSchedule();
  const newSchedule = createInitialPumpSchedule({
    autoStopAtFull: current.autoStopAtFull,
    lastEvent: {
      type: reason,
      timestamp: generateTimestamp()
    }
  });
  systemState.pumpSchedule = newSchedule;
  return newSchedule;
}

function forcePumpOff(reason = "SYSTEM") {
  const pump = systemState.pumpHouse;
  const wasOn = pump.pumpStatus === "ON";
  pump.pumpStatus = "OFF";
  systemState.controlUnit.pumpRelayStatus = "OFF";
  clearPumpSchedule(reason);
  return wasOn;
}

function applyPumpScheduleLogic() {
  const schedule = ensurePumpSchedule();
  const pump = systemState.pumpHouse;
  const now = Date.now();
  
  if (schedule.timerEnd) {
    schedule.timerRemainingMs = Math.max(0, schedule.timerEnd - now);
  } else {
    schedule.timerRemainingMs = 0;
  }
  
  if (
    schedule.mode === "TIMER" &&
    schedule.timerEnd &&
    now >= schedule.timerEnd &&
    pump.pumpStatus === "ON"
  ) {
    const runtime = schedule.timerDurationMinutes;
    if (forcePumpOff("TIMER_COMPLETE")) {
      addAlert(
        "INFO",
        "PUMP_TIMER",
        `Pump timer completed (${runtime?.toFixed ? runtime.toFixed(0) : runtime} min)`
      );
    }
    return;
  }
  
  if (
    schedule.mode === "SCHEDULED" &&
    schedule.scheduledStopTime &&
    now >= schedule.scheduledStopTime &&
    pump.pumpStatus === "ON"
  ) {
    const stopTime = new Date(schedule.scheduledStopTime).toLocaleTimeString();
    if (forcePumpOff("SCHEDULED_STOP")) {
      addAlert(
        "INFO",
        "PUMP_TIMER",
        `Pump stopped at scheduled time (${stopTime})`
      );
    }
  }
}

export function setPumpTimer(durationMinutes, options = {}) {
  const minutes = Number(durationMinutes);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return { success: false, reason: "Invalid duration" };
  }
  
  const safeMinutes = clamp(minutes, MIN_TIMER_MINUTES, MAX_TIMER_MINUTES);
  const now = Date.now();
  const timerEnd = now + safeMinutes * 60 * 1000;
  
  if (options.startPump !== false && systemState.pumpHouse.pumpStatus !== "ON") {
    setPumpStatus("ON");
  }
  
  const schedule = ensurePumpSchedule();
  schedule.mode = "TIMER";
  schedule.timerDurationMinutes = safeMinutes;
  schedule.timerEnd = timerEnd;
  schedule.timerRemainingMs = timerEnd - now;
  schedule.scheduledStopTime = null;
  schedule.lastEvent = {
    type: "TIMER_STARTED",
    timestamp: generateTimestamp(),
    metadata: { durationMinutes: safeMinutes }
  };
  
  return { 
    success: true, 
    timerEnd: new Date(timerEnd).toISOString(), 
    durationMinutes: safeMinutes 
  };
}

export function schedulePumpStop(stopTimeInput, options = {}) {
  let targetTime = null;
  if (typeof stopTimeInput === "number") {
    targetTime = stopTimeInput;
  } else if (stopTimeInput instanceof Date) {
    targetTime = stopTimeInput.getTime();
  } else if (typeof stopTimeInput === "string") {
    const parsed = new Date(stopTimeInput).getTime();
    targetTime = Number.isNaN(parsed) ? null : parsed;
  }
  
  if (!Number.isFinite(targetTime)) {
    return { success: false, reason: "Invalid stop time" };
  }
  
  const now = Date.now();
  if (targetTime <= now) {
    return { success: false, reason: "Stop time must be in the future" };
  }
  
  if (options.startPump && systemState.pumpHouse.pumpStatus !== "ON") {
    setPumpStatus("ON");
  }
  
  const schedule = ensurePumpSchedule();
  schedule.mode = "SCHEDULED";
  schedule.scheduledStopTime = targetTime;
  schedule.timerEnd = targetTime;
  schedule.timerDurationMinutes = Math.round((targetTime - now) / (60 * 1000));
  schedule.timerRemainingMs = targetTime - now;
  schedule.lastEvent = {
    type: "STOP_SCHEDULED",
    timestamp: generateTimestamp(),
    metadata: { stopTime: new Date(targetTime).toISOString() }
  };
  
  return { success: true, stopTime: new Date(targetTime).toISOString() };
}

export function cancelPumpSchedule(reason = "USER_CANCELLED") {
  clearPumpSchedule(reason);
  return { success: true };
}

export function getPumpSchedule() {
  return deepClone(ensurePumpSchedule());
}

// ============================================================================
// VALVE CONTROL
// ============================================================================

export function toggleValve(pipelineId) {
  const pipeline = systemState.pipelines.find(p => p.pipelineId === pipelineId);
  if (!pipeline) {
    return { success: false, reason: `Pipeline ${pipelineId} not found` };
  }
  const newStatus = pipeline.valveStatus === "OPEN" ? "CLOSED" : "OPEN";
  return sendMCUCommand("VALVE", newStatus, { pipelineId });
}

export function setValveStatus(pipelineId, status) {
  if (status !== "OPEN" && status !== "CLOSED") {
    return { success: false, reason: "Invalid valve status" };
  }
  return sendMCUCommand("VALVE", status, { pipelineId });
}

export function toggleTankInlet() {
  const newStatus = systemState.overheadTank.inletValveStatus === "OPEN" ? "CLOSED" : "OPEN";
  return sendMCUCommand("TANK_INLET", newStatus);
}

export function toggleTankOutlet() {
  const newStatus = systemState.overheadTank.outletValveStatus === "OPEN" ? "CLOSED" : "OPEN";
  return sendMCUCommand("TANK_OUTLET", newStatus);
}

// ============================================================================
// TANK LEVEL SIMULATION
// ============================================================================

function updateTankLevel() {
  const tank = systemState.overheadTank;
  const pump = systemState.pumpHouse;
  
  // Count open pipelines
  const openPipelines = systemState.pipelines.filter(p => p.valveStatus === "OPEN");
  const numOpen = openPipelines.length;
  
  // Calculate total outflow from open pipelines
  let totalOutflow = 0;
  if (pump.pumpStatus === "ON" && tank.outletValveStatus === "OPEN" && numOpen > 0) {
    systemState.pipelines.forEach(p => {
      if (p.valveStatus === "OPEN") {
        totalOutflow += p.inlet.flowSensor.value;
      }
    });
  }

  // Calculate inflow - PUMP IS FILLING THE TANK when:
  // 1. Pump is ON
  // 2. Inlet valve is OPEN
  // 3. Either outlet is CLOSED OR all pipelines are CLOSED
  let inflow = 0;
  if (pump.pumpStatus === "ON" && tank.inletValveStatus === "OPEN") {
    if (tank.outletValveStatus === "CLOSED" || numOpen === 0) {
      // Tank is being filled - pump is pushing water INTO the tank
      // Full pump flow goes into tank
      inflow = PUMP_BASE_FLOW * randomVariation(1, 0.05);
      tank.isFilling = true;
    } else {
      // Some water is going out, some is coming in
      inflow = totalOutflow * 0.3; // 30% refill rate when distributing
      tank.isFilling = totalOutflow < inflow;
    }
  } else {
    tank.isFilling = false;
  }

  // Net flow in liters per second
  const netFlowPerSecond = (inflow - totalOutflow) / 60;
  
  // Update tank level
  const volumeChange = netFlowPerSecond * (SIMULATION_INTERVAL_MS / 1000);
  tank.currentVolume = clamp(tank.currentVolume + volumeChange, 0, tank.tankCapacity);
  tank.tankLevel = (tank.currentVolume / tank.tankCapacity) * 100;
  
  tank.fillRate = inflow;
  tank.drainRate = totalOutflow;

  // Auto-shutoff if tank level is too low (only when draining)
  if (tank.tankLevel < MIN_TANK_LEVEL && pump.pumpStatus === "ON" && totalOutflow > 0) {
    if (forcePumpOff("TANK_LOW")) {
      addAlert(
        "CRITICAL",
        "TANK_LOW",
        `Tank level critically low (${tank.tankLevel.toFixed(1)}%) - Auto-shutoff activated`
      );
    }
  }
  
  // Alert if tank is full
  if (tank.tankLevel >= 99 && tank.isFilling) {
    if (forcePumpOff("TANK_FULL")) {
      addAlert(
        "INFO",
        "TANK_FULL",
        `Tank is full (${tank.tankLevel.toFixed(1)}%) - Pump auto-stopped`
      );
    }
    tank.isFilling = false;
  }
}

// ============================================================================
// FLOW AND PRESSURE CALCULATION
// ============================================================================

function calculateFlowAndPressure() {
  const pump = systemState.pumpHouse;
  const tank = systemState.overheadTank;
  
  // Count open pipelines
  const openPipelines = systemState.pipelines.filter(p => p.valveStatus === "OPEN");
  const numOpen = openPipelines.length;

  if (pump.pumpStatus === "ON") {
    // Pump is running - update pump metrics
    pump.pumpRunningHours += SIMULATION_INTERVAL_MS / (1000 * 60 * 60);
    pump.motorTemperature = clamp(pump.motorTemperature + 0.05, 25, 65);
    pump.powerConsumption = randomVariation(PUMP_POWER_KWH, FLOW_NOISE);
    
    if (tank.outletValveStatus === "OPEN" && numOpen > 0) {
      // Pump is distributing to pipelines
      const baseFlowPerPipeline = PUMP_BASE_FLOW / numOpen;
      pump.pumpFlowOutput = randomVariation(PUMP_BASE_FLOW, FLOW_NOISE);
      pump.pumpPressureOutput = randomVariation(PUMP_BASE_PRESSURE - (numOpen * 0.1), FLOW_NOISE);
      
      // Update each pipeline with flow distribution
      systemState.pipelines.forEach(pipeline => {
        if (pipeline.valveStatus === "OPEN") {
          // Calculate inlet values
          const inletFlow = randomVariation(baseFlowPerPipeline, FLOW_NOISE);
          const pressureDrop = (pipeline.pipelineLength / 1000) * PRESSURE_DROP_PER_KM;
          const inletPressure = pump.pumpPressureOutput - randomVariation(0.2, FLOW_NOISE);

          // Apply leakage effects
          const leakageFactor = pipeline.leakageProbability / 100;
          const flowLoss = inletFlow * leakageFactor * randomVariation(1, 0.2);
          const outletFlow = Math.max(0, inletFlow - flowLoss);
          const outletPressure = Math.max(0, inletPressure - pressureDrop - (leakageFactor * 0.5));

          // Update sensors
          pipeline.inlet.flowSensor.value = Math.round(inletFlow);
          pipeline.inlet.pressureSensor.value = Math.round(inletPressure * 100) / 100;
          pipeline.outlet.flowSensor.value = Math.round(outletFlow);
          pipeline.outlet.pressureSensor.value = Math.round(outletPressure * 100) / 100;
          pipeline.estimatedLeakage = Math.round(flowLoss);
          pipeline.flowLoss = Math.round(flowLoss);
        } else {
          // Valve closed - no flow
          pipeline.inlet.flowSensor.value = 0;
          pipeline.inlet.pressureSensor.value = 0;
          pipeline.outlet.flowSensor.value = 0;
          pipeline.outlet.pressureSensor.value = 0;
          pipeline.leakageProbability = 0;
          pipeline.estimatedLeakage = 0;
          pipeline.flowLoss = 0;
        }
      });
    } else {
      // Pump is ON but pipelines are closed - filling tank
      pump.pumpFlowOutput = randomVariation(PUMP_BASE_FLOW, FLOW_NOISE);
      pump.pumpPressureOutput = randomVariation(PUMP_BASE_PRESSURE, FLOW_NOISE);
      
      // All pipelines show no flow but pressure builds up
      systemState.pipelines.forEach(pipeline => {
        pipeline.inlet.flowSensor.value = 0;
        pipeline.inlet.pressureSensor.value = pump.pumpPressureOutput; // Pressure builds up
        pipeline.outlet.flowSensor.value = 0;
        pipeline.outlet.pressureSensor.value = 0;
      });
    }
  } else {
    // Pump is OFF or tank outlet closed - no flow
    pump.pumpFlowOutput = 0;
    pump.pumpPressureOutput = 0;
    pump.powerConsumption = 0.2; // Standby power
    pump.motorTemperature = Math.max(25, pump.motorTemperature - 0.1);

    systemState.pipelines.forEach(pipeline => {
      pipeline.inlet.flowSensor.value = 0;
      pipeline.inlet.pressureSensor.value = 0;
      pipeline.outlet.flowSensor.value = 0;
      pipeline.outlet.pressureSensor.value = 0;
    });
  }
}

// ============================================================================
// LEAKAGE SIMULATION
// ============================================================================

function simulateLeakage(pipelineId) {
  const pipeline = systemState.pipelines.find(p => p.pipelineId === pipelineId);
  if (!pipeline || pipeline.valveStatus === "CLOSED") return 0;

  const inletFlow = pipeline.inlet.flowSensor.value;
  const outletFlow = pipeline.outlet.flowSensor.value;
  const inletPressure = pipeline.inlet.pressureSensor.value;
  const outletPressure = pipeline.outlet.pressureSensor.value;

  if (inletFlow === 0) return 0;

  // Calculate flow loss percentage
  const flowLossPercent = ((inletFlow - outletFlow) / inletFlow) * 100;
  
  // Calculate pressure anomaly
  const expectedPressureDrop = (pipeline.pipelineLength / 1000) * PRESSURE_DROP_PER_KM;
  const actualPressureDrop = inletPressure - outletPressure;
  const pressureAnomaly = Math.max(0, actualPressureDrop - expectedPressureDrop);

  // Combined leakage probability
  let leakageProb = flowLossPercent * 1.5 + pressureAnomaly * 20;
  
  // Add some randomness for realistic behavior
  leakageProb += (Math.random() * 10 - 5);
  leakageProb = clamp(leakageProb, 0, 100);

  pipeline.leakageProbability = Math.round(leakageProb);

  // Generate alert if high leakage
  if (pipeline.leakageProbability > 40) {
    addAlert(
      pipeline.leakageProbability > 60 ? "CRITICAL" : "WARNING",
      "LEAKAGE",
      `Potential leakage detected in ${pipeline.pipelineName} (${pipeline.leakageProbability}% probability)`
    );
  }

  return pipeline.leakageProbability;
}

// ============================================================================
// WATER QUALITY SIMULATION
// ============================================================================

function simulateQualityChanges() {
  const tankQuality = systemState.overheadTank.waterQuality;
  
  // Slight drift in tank quality over time
  tankQuality.turbidity = clamp(randomVariation(tankQuality.turbidity, 0.02), 0.5, 5);
  tankQuality.pH = clamp(randomVariation(tankQuality.pH, 0.01), 6.5, 8.5);
  tankQuality.chlorine = clamp(randomVariation(tankQuality.chlorine, 0.02), 0.2, 1.5);
  tankQuality.TDS = clamp(randomVariation(tankQuality.TDS, 0.01), 100, 500);

  systemState.pipelines.forEach(pipeline => {
    if (pipeline.valveStatus === "OPEN" && systemState.pumpHouse.pumpStatus === "ON") {
      const leakageFactor = pipeline.leakageProbability / 100;
      
      // Inlet quality close to tank
      pipeline.inlet.qualitySensor.turbidity = randomVariation(tankQuality.turbidity, 0.03);
      pipeline.inlet.qualitySensor.pH = randomVariation(tankQuality.pH, 0.02);
      pipeline.inlet.qualitySensor.chlorine = randomVariation(tankQuality.chlorine, 0.03);
      pipeline.inlet.qualitySensor.TDS = randomVariation(tankQuality.TDS, 0.02);

      // Outlet quality drifts based on leakage (contamination risk)
      const driftFactor = 1 + leakageFactor * 0.5;
      pipeline.outlet.qualitySensor.turbidity = clamp(
        pipeline.inlet.qualitySensor.turbidity * driftFactor + (Math.random() * 0.2),
        0.5, 5
      );
      pipeline.outlet.qualitySensor.pH = clamp(
        pipeline.inlet.qualitySensor.pH - (leakageFactor * 0.2) + (Math.random() * 0.1 - 0.05),
        6.5, 8.5
      );
      pipeline.outlet.qualitySensor.chlorine = clamp(
        pipeline.inlet.qualitySensor.chlorine * (1 - leakageFactor * 0.2),
        0.1, 1.5
      );
      pipeline.outlet.qualitySensor.TDS = clamp(
        pipeline.inlet.qualitySensor.TDS * (1 + leakageFactor * 0.1),
        100, 500
      );

      // Calculate quality deviation
      const deviation = Math.abs(
        (tankQuality.turbidity - pipeline.outlet.qualitySensor.turbidity) / tankQuality.turbidity +
        (tankQuality.pH - pipeline.outlet.qualitySensor.pH) / tankQuality.pH +
        (tankQuality.chlorine - pipeline.outlet.qualitySensor.chlorine) / tankQuality.chlorine +
        (tankQuality.TDS - pipeline.outlet.qualitySensor.TDS) / tankQuality.TDS
      ) * 25;
      
      pipeline.qualityDeviation = Math.round(deviation * 10) / 10;

      // Quality alert
      if (pipeline.qualityDeviation > 10) {
        addAlert(
          pipeline.qualityDeviation > 15 ? "WARNING" : "INFO",
          "QUALITY",
          `Water quality deviation in ${pipeline.pipelineName} (${pipeline.qualityDeviation.toFixed(1)}%)`
        );
      }

      // Random anomalies (2% chance per pipeline)
      if (Math.random() < 0.02) {
        const anomalyType = Math.floor(Math.random() * 3);
        switch (anomalyType) {
          case 0: // Turbidity spike
            pipeline.outlet.qualitySensor.turbidity += 0.5;
            addAlert("WARNING", "QUALITY", `Turbidity spike detected in ${pipeline.pipelineName}`);
            break;
          case 1: // Chlorine drop
            pipeline.outlet.qualitySensor.chlorine = Math.max(0.1, pipeline.outlet.qualitySensor.chlorine - 0.2);
            addAlert("WARNING", "QUALITY", `Low chlorine detected in ${pipeline.pipelineName}`);
            break;
          case 2: // Pressure dip
            pipeline.outlet.pressureSensor.value = Math.max(0, pipeline.outlet.pressureSensor.value - 0.5);
            addAlert("INFO", "PRESSURE", `Pressure fluctuation in ${pipeline.pipelineName}`);
            break;
        }
      }
    }
  });
}

// ============================================================================
// SENSOR UPDATE
// ============================================================================

export function updateAllSensors() {
  // Update MCU heartbeat
  systemState.controlUnit.lastHeartbeat = generateTimestamp();
  systemState.controlUnit.MCUUptime += SIMULATION_INTERVAL_MS / 1000;
  
  // Enforce pump scheduling rules
  applyPumpScheduleLogic();
  
  // Update all subsystems
  calculateFlowAndPressure();
  updateTankLevel();
  simulateQualityChanges();
  
  // Update leakage for each pipeline
  systemState.pipelines.forEach(p => {
    if (p.valveStatus === "OPEN") {
      simulateLeakage(p.pipelineId);
    }
  });

  // Update system metrics
  updateSystemMetrics();
  
  // Update timestamp
  systemState.lastUpdated = generateTimestamp();

  // Add to realtime history (keep last 60 entries = 1 minute of data)
  addRealtimeEntry();
}

function updateSystemMetrics() {
  const metrics = systemState.systemMetrics;
  const openPipelines = systemState.pipelines.filter(p => p.valveStatus === "OPEN");
  
  metrics.totalFlowRate = openPipelines.reduce((sum, p) => sum + p.outlet.flowSensor.value, 0);
  metrics.averagePressure = systemState.pumpHouse.pumpPressureOutput;
  metrics.totalLeakage = systemState.pipelines.reduce((sum, p) => sum + p.estimatedLeakage, 0);
  
  const totalInlet = openPipelines.reduce((sum, p) => sum + p.inlet.flowSensor.value, 0);
  const totalOutlet = openPipelines.reduce((sum, p) => sum + p.outlet.flowSensor.value, 0);
  metrics.systemEfficiency = totalInlet > 0 ? Math.round((totalOutlet / totalInlet) * 100) : 100;
  
  const avgDeviation = systemState.pipelines.reduce((sum, p) => sum + p.qualityDeviation, 0) / systemState.pipelines.length;
  metrics.averageQualityDeviation = Math.round(avgDeviation * 10) / 10;
  
  metrics.totalHouseholdsServed = openPipelines.reduce((sum, p) => sum + p.householdsServed, 0);

  // Update system status
  const pump = systemState.pumpHouse;
  const tank = systemState.overheadTank;
  
  if (pump.pumpStatus === "OFF") {
    systemState.systemStatus = "STANDBY";
  } else if (tank.tankLevel < MIN_TANK_LEVEL) {
    systemState.systemStatus = "LOW_TANK";
  } else if (metrics.totalLeakage > 50) {
    systemState.systemStatus = "LEAKAGE_ALERT";
  } else if (metrics.averageQualityDeviation > 15) {
    systemState.systemStatus = "QUALITY_ALERT";
  } else {
    systemState.systemStatus = "OPERATIONAL";
  }
}

// ============================================================================
// ALERTS SYSTEM
// ============================================================================

function addAlert(severity, type, message) {
  const alert = {
    id: `ALT-${Date.now()}`,
    severity: severity,
    type: type,
    message: message,
    timestamp: generateTimestamp(),
    acknowledged: false
  };

  // Prevent duplicate alerts
  const exists = systemState.systemMetrics.alerts.some(
    a => a.type === type && a.message === message && !a.acknowledged
  );
  
  if (!exists) {
    systemState.systemMetrics.alerts.unshift(alert);
    systemState.systemMetrics.lastAlertTime = alert.timestamp;
    
    // Keep only last 100 alerts
    if (systemState.systemMetrics.alerts.length > 100) {
      systemState.systemMetrics.alerts.pop();
    }
  }
}

export function acknowledgeAlert(alertId) {
  const alert = systemState.systemMetrics.alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
  }
}

export function clearAlerts() {
  systemState.systemMetrics.alerts = [];
}

// ============================================================================
// REALTIME DATA HISTORY
// ============================================================================

function addRealtimeEntry() {
  const pump = systemState.pumpHouse;
  const tank = systemState.overheadTank;
  const metrics = systemState.systemMetrics;
  
  const entry = {
    timestamp: generateTimestamp(),
    flowRate: metrics.totalFlowRate,
    pressure: pump.pumpPressureOutput,
    tankLevel: tank.tankLevel,
    pumpStatus: pump.pumpStatus,
    powerConsumption: pump.powerConsumption,
    turbidity: tank.waterQuality.turbidity,
    pH: tank.waterQuality.pH,
    chlorine: tank.waterQuality.chlorine,
    TDS: tank.waterQuality.TDS,
    leakageProbability: Math.round(systemState.pipelines.reduce((sum, p) => sum + p.leakageProbability, 0) / systemState.pipelines.length),
    valveStatus: {
      pipeline1: systemState.pipelines[0]?.valveStatus || "CLOSED",
      pipeline2: systemState.pipelines[1]?.valveStatus || "CLOSED",
      pipeline3: systemState.pipelines[2]?.valveStatus || "CLOSED",
      pipeline4: systemState.pipelines[3]?.valveStatus || "CLOSED",
      pipeline5: systemState.pipelines[4]?.valveStatus || "CLOSED"
    },
    pipelineFlows: systemState.pipelines.map(p => p.outlet.flowSensor.value),
    pipelinePressures: systemState.pipelines.map(p => p.outlet.pressureSensor.value)
  };

  systemState.realtimeHistory.unshift(entry);
  
  // Keep last 60 entries (1 minute of second-by-second data)
  if (systemState.realtimeHistory.length > 60) {
    systemState.realtimeHistory.pop();
  }
}

// ============================================================================
// SIMULATION STEP
// ============================================================================

export function stepSimulation() {
  updateAllSensors();
  return getSystemState();
}

// ============================================================================
// STATE ACCESS
// ============================================================================

export function getSystemState() {
  return deepClone(systemState);
}

export function getLiveState() {
  return getSystemState();
}

export function getRealtimeHistory() {
  return deepClone(systemState.realtimeHistory);
}

export function getPipelineById(pipelineId) {
  return deepClone(systemState.pipelines.find(p => p.pipelineId === pipelineId));
}

export function getTankStatus() {
  return deepClone(systemState.overheadTank);
}

export function getPumpStatus() {
  return deepClone(systemState.pumpHouse);
}

export function getMCUStatus() {
  return deepClone(systemState.controlUnit);
}

export function getAlerts() {
  return deepClone(systemState.systemMetrics.alerts);
}

// ============================================================================
// SIMULATION CONTROL
// ============================================================================

let simulationInterval = null;
let subscribers = [];

export function startSimulation(callback) {
  if (simulationInterval) {
    stopSimulation();
  }

  // Add callback to subscribers if provided
  if (callback && typeof callback === 'function') {
    subscribers.push(callback);
  }

  // Start the simulation loop
  simulationInterval = setInterval(() => {
    const state = stepSimulation();
    
    // Notify all subscribers
    subscribers.forEach(sub => {
      try {
        sub(state);
      } catch (e) {
        console.error('Subscriber error:', e);
      }
    });
  }, SIMULATION_INTERVAL_MS);

  return () => stopSimulation();
}

export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export function subscribe(callback) {
  if (typeof callback === 'function') {
    subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  }
}

export function isSimulationRunning() {
  return simulationInterval !== null;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize with first sensor update
updateAllSensors();

// Export default object for convenience
export default {
  // Control functions
  togglePump,
  setPumpStatus,
  setPumpTimer,
  schedulePumpStop,
  cancelPumpSchedule,
  toggleValve,
  setValveStatus,
  toggleTankInlet,
  toggleTankOutlet,
  
  // State access
  getSystemState,
  getLiveState,
  getRealtimeHistory,
  getPipelineById,
  getTankStatus,
  getPumpStatus,
  getMCUStatus,
  getAlerts,
  getPumpSchedule,
  
  // Simulation control
  startSimulation,
  stopSimulation,
  subscribe,
  isSimulationRunning,
  stepSimulation,
  updateAllSensors,
  
  // Alert management
  acknowledgeAlert,
  clearAlerts
};

