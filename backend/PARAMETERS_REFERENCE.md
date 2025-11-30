# Jalsense Parameter Reference - Complete Implementation

## Overview
All 5 categories of parameters are now implemented and flowing through the system:

```
MQTT Simulator → Backend Rules Engine → Dashboard Display
```

## Implemented Parameters by Category

### CATEGORY 1: INFRASTRUCTURE PERFORMANCE PARAMETERS

#### Pump Parameters
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| pumpRunningHours | hours | 100-500 | ✅ Implemented |
| pumpEfficiency | % | 65-85 | ✅ Implemented |
| pumpDischargeRate | L/min | 20-60 | ✅ Implemented |
| powerConsumption | kW | 3.5-7.5 | ✅ Implemented |
| voltage | V | 220-240 | ✅ Implemented |
| motorTemperature | °C | 40-70 | ✅ Implemented |

#### Pipe Network Parameters
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| flowRate | L/min | 15-55 | ✅ Implemented |
| pressure | bar | 1.0-4.0 | ✅ Implemented |
| flowDropIndicator | binary | 0/1 | ✅ Implemented |
| pressureLossIndicator | binary | 0/1 | ✅ Implemented |

#### Storage Tank Parameters
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| tankLevel | % | 20-100 | ✅ Implemented |
| tankLevelLiters | L | 5000-25000 | ✅ Implemented |
| tankFillingTime | hours | 2-8 | ✅ Implemented |
| tankEmptinessHours | hours | 0-12 | ✅ Implemented |
| supplyDurationFromTank | hours | 2-18 | ✅ Implemented |
| tankTemperature | °C | 25-35 | ✅ Implemented |
| overflowAlerts | count/week | 0-5 | ✅ Implemented |

#### Valve Parameters
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| valveOpenClosedStatus | 0/1 | open=1, closed=0 | ✅ Implemented |
| valveOperationCount | ops/week | 10-50 | ✅ Implemented |
| faultyValveDetection | binary | 0/1 | ✅ Implemented |
| valveLeakage | L/hour | 0-5 | ✅ Implemented |

#### Leak Detection Parameters
| Parameter | Unit | Status |
|-----------|------|--------|
| Sudden flow drop | flowDropIndicator (binary) | ✅ Implemented |
| Pressure drop | pressureLossIndicator (binary) | ✅ Implemented |
| Leak probability score | 0-100 % | ✅ Implemented |

---

### CATEGORY 2: OPERATIONAL PARAMETERS

#### Daily Routine Checks
| Parameter | Unit | Status |
|-----------|------|--------|
| dailyInspectionDone | binary | ✅ Implemented |
| inspectionTime | hour | ✅ Implemented |

#### Energy & Cost Metrics
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| estimatedEnergyConsumed | kWh | 20-60 | ✅ Implemented |
| dailyPumpOperatingCost | ₹ | 150-500 | ✅ Implemented |
| monthlyOMCost | ₹ | 5000-15000 | ✅ Implemented |

#### Supply Metrics
| Parameter | Unit | Range | Status |
|-----------|------|-------|--------|
| dailyWaterProduction | liters | 15000-45000 | ✅ Implemented |
| dailyWaterDistributed | liters | 12000-40000 | ✅ Implemented |
| supplyHoursPerDay | hours | 4-20 | ✅ Implemented |
| supplyCyclesPerDay | cycles | 1-4 | ✅ Implemented |

#### Breakdown Metrics
| Parameter | Unit | Status |
|-----------|------|--------|
| repairEvents | count/month | ✅ Implemented |

---

### CATEGORY 3: WATER QUALITY PARAMETERS

#### Core Quality Parameters
| Parameter | Unit | BIS Range | Actual Range | Status |
|-----------|------|-----------|--------------|--------|
| pH | pH | 6.5-8.5 | 6.8-8.2 | ✅ Implemented |
| Turbidity | NTU | <1-5 | 0.3-2.5 | ✅ Implemented |
| TDS | mg/L | <500-1000 | 300-650 | ✅ Implemented |
| Free Chlorine | mg/L | 0.2-0.8 | 0.3-0.6 | ✅ Implemented |
| Color | HCU | <5 | 0-5 | ✅ Implemented |
| Temperature | °C | Room temp | 20-28 | ✅ Implemented |

#### Advanced Parameters
| Parameter | Unit | Safe Limit | Actual Range | Status |
|-----------|------|-----------|--------------|--------|
| Iron | mg/L | <0.3 | 0.05-0.25 | ✅ Implemented |
| Fluoride | mg/L | <1.5 | 0.4-1.2 | ✅ Implemented |
| Nitrate | mg/L | <45 | 5-35 | ✅ Implemented |
| Hardness | mg/L CaCO3 | <600 | 150-450 | ✅ Implemented |
| Coliform | binary | 0 (absent) | 0/1 | ✅ Implemented |

#### Measurement Metadata
| Parameter | Status |
|-----------|--------|
| qualityTestTime | ✅ Implemented |
| qualitySamplingOperator | ✅ Implemented |

---

### CATEGORY 4: PREDICTIVE MAINTENANCE PARAMETERS

#### Flow Pattern Analytics
| Parameter | Unit | Status |
|-----------|------|--------|
| dailyAverageFlow | L/min | ✅ Implemented |
| Anomaly alerts | % of flow | ✅ Implemented |

#### Pump Efficiency Analytics
| Parameter | Unit | Status |
|-----------|------|--------|
| Efficiency trend | % | ✅ Implemented |
| Power consumption trend | kW | ✅ Implemented |

#### Fault Prediction Indicators
| Parameter | Status |
|-----------|--------|
| Sudden flow drop (>X%) | ✅ Implemented |
| Energy spike (>Y kW) | ✅ Implemented |
| Rising temperature trend | ✅ Implemented |
| Unexpected tank filling delays | ✅ Implemented |

#### Maintenance Scheduling
| Parameter | Unit | Status |
|-----------|------|--------|
| pumpServiceDueDate | days | ✅ Implemented |
| tankServiceDueDate | days | ✅ Implemented |
| nextQualityTestDue | days | ✅ Implemented |

---

### CATEGORY 5: GOVERNANCE & ACCOUNTABILITY PARAMETERS

#### Community Dashboard Metrics
| Parameter | Status |
|-----------|--------|
| Current tank level | ✅ Implemented |
| Water quality status | ✅ Implemented |
| Current pump working status | ✅ Implemented |
| Leak reports (recent) | ✅ Implemented |

#### Accountability Metrics
| Parameter | Status |
|-----------|--------|
| Water quality compliance % | ✅ Implemented |
| Fault response time | ✅ Implemented |

---

## Node Configuration

### 4 Simulated Nodes:

1. **pump-1**: Main Borewell Pump (Headworks)
   - All pump infrastructure parameters
   - Operational metrics
   - Predictive maintenance indicators

2. **tank-1**: Overhead Tank (Village Centre)
   - Tank level, filling time, supply duration
   - Operational metrics (supply hours, cycles)
   - Maintenance scheduling

3. **tap-1**: Public Tap – Zone 1 (Street 1)
   - Complete water quality testing
   - Valve status monitoring
   - Quality compliance tracking

4. **valve-1**: Main Distribution Valve (Distribution Network)
   - Valve operation parameters
   - Leakage detection
   - Maintenance alerts

---

## Alert Rules Implemented

### PUMP NODE ALERTS:
- ✅ Dry-run detection (high power, low discharge)
- ✅ Efficiency drop (<60%)
- ✅ Motor overheating (>75°C critical, >65°C warning)
- ✅ Voltage anomalies (<200V or >250V)
- ✅ Leak detection (flow drop + pressure loss)
- ✅ Service due (>450 running hours)

### TANK NODE ALERTS:
- ✅ Critical low level (<15%)
- ✅ Warning low level (<25%)
- ✅ Near overflow (>95%)
- ✅ Overflow indicator
- ✅ Unexpected filling delays
- ✅ Extended empty duration (>10 hours)

### VALVE NODE ALERTS:
- ✅ Faulty valve detection
- ✅ Valve leakage (>5 L/hour)
- ✅ Excessive operations (>40/week)

### TAP/QUALITY NODE ALERTS:
- ✅ pH out of range
- ✅ Turbidity exceeded
- ✅ TDS exceeded
- ✅ Chlorine anomaly
- ✅ Iron contamination
- ✅ Fluoride excess
- ✅ Nitrate exceeded
- ✅ Hardness too high
- ✅ **COLIFORM DETECTED** (CRITICAL)
- ✅ Compliance tracking

---

## Data Flow Cycle

```
1. MQTT Simulator generates all parameters (every 5 seconds)
   ↓
2. Publishes to MQTT Broker
   ↓
3. MQTT Listener receives & forwards to Backend
   ↓
4. Backend's apply_rules() evaluates all 5 categories
   ↓
5. Alerts created for anomalies
   ↓
6. Dashboard fetches updated nodes & alerts via REST API
   ↓
7. Real-time display of all parameters
```

---

## Testing the System

### 1. Verify Simulator is Generating Data
```bash
cd backend
python mqtt_simulator.py
```
Should see output like:
```
📤 Published data for pump-1: {'pumpRunningHours': 245, 'pumpEfficiency': 72.5, 'motorTemperature': 58.3, ...}
```

### 2. Verify Backend Processing
```bash
curl http://localhost:8000/api/nodes
```
Returns all nodes with latest metrics

### 3. Check Generated Alerts
```bash
curl http://localhost:8000/api/alerts
```
See all alerts including anomaly detections

### 4. Dashboard Display
Navigate to http://localhost:5178 and view:
- Infrastructure dashboard: Pump, Tank, Valve status
- Operational metrics: Energy costs, supply hours
- Water Quality: Lab parameters
- Alerts: Real-time anomaly notifications

---

## Anomaly Injection Rate

System has **5% chance per cycle** to inject realistic anomalies:

**Pump Anomalies:**
- Reduced efficiency (low discharge, high power)
- Overheating (>76°C)
- Low voltage (<200V)
- Leak detected

**Tank Anomalies:**
- Low level (<15%)
- High level (>96%)
- Filling delays

**Tap Anomalies:**
- High turbidity (>5.5 NTU)
- Low pH (<6.0)
- High TDS (>1200 mg/L)
- Low chlorine (<0.2 mg/L)
- Coliform detection

**Valve Anomalies:**
- Faulty valve
- Leakage (>8 L/hour)

---

## Customization

### Change Anomaly Injection Rate
Edit `mqtt_simulator.py`, line ~250:
```python
if random.random() < 0.05:  # Change 0.05 to desired rate (0.1 = 10%)
```

### Adjust Parameter Ranges
Edit `NODES_CONFIG` in `mqtt_simulator.py` to modify min/max values

### Change Alert Thresholds
Edit `apply_rules()` in `backend/main.py` to adjust severity levels

---

## MANDATORY Parameters Status

| Mandatory Parameter | Status | Alert Rule |
|------------------|--------|------------|
| Pump running hours | ✅ | Service due (>450h) |
| Valve status | ✅ | Faulty detection |
| Leak detection | ✅ | Flow drop + Pressure loss |
| Water quality tests | ✅ | All 9+ parameters monitored |
| Flow pattern analysis | ✅ | Anomaly alerts |
| Tank level | ✅ | Critical/Warning thresholds |
| Predictive indicators | ✅ | Rule-based system |
| Offline-first logging | ✅ | Queuing in simulator |
| Operator identification | ✅ | qualitySamplingOperator |

---

## Next Steps

1. ✅ Run full integration test
2. ✅ Monitor alerts for anomalies
3. ⏳ Add database persistence (PostgreSQL)
4. ⏳ Connect real IoT sensors
5. ⏳ Add GIS visualization for leak mapping
6. ⏳ Implement user complaint system
