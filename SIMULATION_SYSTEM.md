# Water Supply Simulation System

A complete IoT-like simulation engine for rural water supply monitoring and control.

## Overview

This system provides realistic real-time simulation of a water distribution network. All values react logically like real hardware - the user interface shows live IoT data updates.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
│  (Dashboard, Pump Monitor, Tank View, Pipeline Map, etc.)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  useSimulationData Hook                      │
│  - getLiveState()    - togglePump()    - toggleValve()      │
│  - subscribe()       - startSimulation()                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   simulationEngine.js                        │
│  - MCU Command System    - Hydraulic Calculations           │
│  - Leakage Detection     - Quality Simulation               │
│  - Real-time Updates     - Alert Generation                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               infrastructure_state.json                      │
│  - Overhead Tank         - Control Unit (MCU)               │
│  - Pump House            - 5 Pipelines with Sensors         │
└─────────────────────────────────────────────────────────────┘
```

## Files

### Core Files

| File | Purpose |
|------|---------|
| `src/data/infrastructure_state.json` | Global infrastructure model (tank, MCU, pump, pipelines) |
| `src/data/realtime_data.json` | Sample time-series data (50 entries) |
| `src/utils/simulationEngine.js` | Simulation engine with hydraulic logic |
| `src/hooks/useSimulationData.js` | React hook for live UI updates |
| `src/examples/SimulationExample.jsx` | Example components showing usage |

## Infrastructure Model

### Overhead Tank
- Tank level (%)
- Tank capacity (liters)
- Inlet/Outlet valve status
- Water quality (turbidity, pH, chlorine, TDS)

### Control Unit (MCU)
- Pump relay status
- Valve relays (5 pipelines)
- Sensor status (quality, pressure, flow)
- MCU health & command log
- Network status

### Pump House
- Pump status (ON/OFF)
- Flow output (L/min)
- Pressure output (bar)
- Running hours
- Power consumption (kW)
- Motor temperature

### Pipelines (5 units)
Each pipeline has:
- Inlet sensors (flow, pressure, quality)
- Outlet sensors (flow, pressure, quality)
- Valve status
- Leakage probability
- Quality deviation
- Length (meters)

## Simulation Behavior

### When Pump = ON
- Flow rate increases through open pipelines
- Pressure increases
- Tank level decreases
- Power consumption increases

### When Pump = OFF
- Flow drops to zero
- Pressure drops to idle
- Tank level stays constant
- Power consumption minimal (standby)

### When Valve = CLOSED
- No flow through that pipeline
- Pressure = 0
- Leakage probability = 0

### Leakage Detection
- Calculated from flow/pressure mismatch
- Higher leakage = more pressure drop, flow loss
- Alerts generated when probability > 40%

### Water Quality
- Tank quality drifts slowly over time
- Pipeline outlet quality deviates based on leakage
- Quality alerts when deviation > 10%

### Safety Features
- Auto-shutoff when tank level < 15%
- MCU rejects unsafe commands
- All commands logged

## Usage in React Components

### Basic Usage

```javascript
import { useSimulationData } from '../hooks/useSimulationData';

function MyComponent() {
  const { 
    state,           // Full system state
    tankLevel,       // Quick access to tank level
    pumpStatus,      // Quick access to pump status
    togglePump,      // Control function
    toggleValve,     // Control function
    isLive           // Whether simulation is running
  } = useSimulationData();

  return (
    <div>
      <p>Tank: {tankLevel}%</p>
      <p>Pump: {pumpStatus}</p>
      <button onClick={togglePump}>Toggle Pump</button>
    </div>
  );
}
```

### Specialized Hooks

```javascript
// Tank monitoring
import { useTank } from '../hooks/useSimulationData';
const { level, quality, toggleInlet, toggleOutlet } = useTank();

// Pump monitoring
import { usePump } from '../hooks/useSimulationData';
const { status, flowOutput, powerConsumption, toggle } = usePump();

// Pipeline monitoring
import { usePipeline } from '../hooks/useSimulationData';
const { inletFlow, outletFlow, leakageProbability, toggleValve } = usePipeline(1);

// Water quality
import { useWaterQuality } from '../hooks/useSimulationData';
const { turbidity, pH, chlorine, TDS } = useWaterQuality();

// Alerts
import { useAlerts } from '../hooks/useSimulationData';
const { critical, warnings, acknowledge, clear } = useAlerts();

// System metrics
import { useSystemMetrics } from '../hooks/useSimulationData';
const { totalFlow, efficiency, totalLeakage } = useSystemMetrics();

// MCU status
import { useMCU } from '../hooks/useSimulationData';
const { health, commandsExecuted, networkStatus } = useMCU();
```

## Control Functions

### Pump Control
```javascript
togglePump()        // Toggle ON/OFF
setPumpStatus('ON') // Set specific status
```

### Valve Control
```javascript
toggleValve(pipelineId)           // Toggle specific pipeline valve
setValveStatus(pipelineId, 'OPEN') // Set specific status
toggleTankInlet()                  // Toggle tank inlet valve
toggleTankOutlet()                 // Toggle tank outlet valve
```

### Alert Management
```javascript
acknowledgeAlert(alertId)  // Mark alert as seen
clearAlerts()              // Clear all alerts
```

## Simulation Engine API

### State Access
```javascript
import { getSystemState, getLiveState } from '../utils/simulationEngine';

const state = getLiveState();
console.log(state.overheadTank.tankLevel);
console.log(state.pumpHouse.pumpStatus);
console.log(state.pipelines[0].inlet.flowSensor.value);
```

### Simulation Control
```javascript
import { startSimulation, stopSimulation, subscribe } from '../utils/simulationEngine';

// Start simulation with callback
startSimulation((state) => {
  console.log('Updated state:', state);
});

// Subscribe to updates
const unsubscribe = subscribe((state) => {
  updateUI(state);
});

// Stop simulation
stopSimulation();
```

### MCU Commands
```javascript
import { sendMCUCommand } from '../utils/simulationEngine';

// Send command to pump
sendMCUCommand('PUMP', 'ON');

// Send command to valve
sendMCUCommand('VALVE', 'CLOSED', { pipelineId: 2 });
```

## Data Flow

1. **User Action** → Click "Toggle Pump"
2. **Hook** → `togglePump()` called
3. **Engine** → `sendMCUCommand('PUMP', 'ON')` executed
4. **MCU Logic** → Safety checks, command logged
5. **Sensor Update** → All sensors recalculated
6. **State Update** → New state pushed to subscribers
7. **UI Update** → React re-renders with new data

## Key Features

✅ **Realistic Behavior** - Hydraulic rules, pressure-flow relations, leakage detection

✅ **Single Source of Truth** - All data from one global state

✅ **MCU Simulation** - Command logging, safety checks, network status

✅ **Real-time Updates** - 1-second intervals, smooth transitions

✅ **Alert System** - Critical, warning, info alerts with timestamps

✅ **No External Dependencies** - Pure JavaScript, no WebSockets

✅ **React Integration** - Custom hooks for easy UI binding

✅ **Type Safety** - Consistent JSON structure throughout

## Technical Notes

- Simulation runs at 1000ms intervals
- Tank auto-shutoff at 15% level
- Pressure drops ~0.8 bar per km of pipeline
- Random anomalies occur with 2% probability
- Last 60 real-time entries kept in history
- Last 50 MCU commands kept in log
- Last 100 alerts kept in memory

