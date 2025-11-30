# Jalsense Real-Time Data Simulation Setup Guide

## Overview
This system uses MQTT to simulate real-time IoT water supply data and display it on the dashboard.

**Architecture:**
```
MQTT Simulator → MQTT Broker (Mosquitto) → MQTT Listener → FastAPI Backend → React Dashboard
```

## Prerequisites

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Key packages:**
- `paho-mqtt` - MQTT client library
- `requests` - For HTTP communication
- `fastapi`, `uvicorn` - Backend API

### 2. Install & Run MQTT Broker (Mosquitto)

#### Option A: Docker (Recommended - Easiest)
```bash
docker run -d \
  --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto
```

#### Option B: Windows Installation
1. Download from: https://mosquitto.org/download/
2. Install Mosquitto
3. Run the service:
   ```bash
   mosquitto -v
   ```

#### Option C: Linux/Mac
```bash
# Ubuntu/Debian
sudo apt-get install mosquitto mosquitto-clients

# macOS
brew install mosquitto

# Start service
mosquitto -v
```

## Running the System

### Step 1: Start FastAPI Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
✓ Backend will be available at: http://localhost:8000

### Step 2: Start MQTT Listener (in new terminal)
```bash
cd backend
python mqtt_listener.py
```
This subscribes to MQTT messages and forwards data to the backend.

### Step 3: Start MQTT Simulator (in another terminal)
```bash
cd backend
python mqtt_simulator.py
```
This generates realistic IoT data and publishes to MQTT broker.

### Step 4: Start Frontend
```bash
# In project root
npm run dev
```
Open browser at: http://localhost:5178

## Data Flow

1. **MQTT Simulator** generates realistic water IoT data:
   - Pump metrics: flow, pressure, current, temperature, voltage, efficiency
   - Tank metrics: level, temperature, overflow status
   - Tap/Water Quality metrics: pH, turbidity, TDS, chlorine, iron, fluoride, nitrate, hardness, coliform

2. **MQTT Broker** (Mosquitto) receives and routes messages:
   - Topic: `jalsense/nodes/pump-1`, `jalsense/nodes/tank-1`, `jalsense/nodes/tap-1`

3. **MQTT Listener** receives all messages and forwards to backend:
   - Endpoint: `POST /api/telemetry`

4. **FastAPI Backend** processes telemetry:
   - Updates node metrics
   - Applies rule-based anomaly detection
   - Creates alerts for anomalies

5. **React Dashboard** fetches and displays:
   - Live node metrics
   - Active alerts with severity levels
   - Real-time status updates

## Testing the Integration

### Test 1: Check MQTT Broker
```bash
# In new terminal, use MQTT client
mosquitto_sub -h localhost -p 1883 -t "jalsense/nodes/#" -v
```
You should see messages like:
```
jalsense/nodes/pump-1 {"nodeId":"pump-1","metrics":{"flow":35.2, ...},"timestamp":"..."}
```

### Test 2: Check Backend API
```bash
# View all nodes
curl http://localhost:8000/api/nodes

# View all alerts
curl http://localhost:8000/api/alerts

# View health
curl http://localhost:8000/api/health
```

### Test 3: Check Dashboard
- Login to http://localhost:5178
- Go to each dashboard tab
- You should see real-time metrics updating
- Anomalies trigger alerts (5% chance per cycle)

## Troubleshooting

### "Connection refused" error
- Ensure MQTT broker is running: `mosquitto -v`
- Check it's listening on port 1883: `netstat -an | grep 1883`

### "Cannot reach backend" error
- Make sure FastAPI is running: `uvicorn main:app --reload`
- Check backend URL in `mqtt_listener.py`: Should be `http://localhost:8000`

### MQTT messages not appearing
1. Check broker is running
2. Check subscriber (listener) is subscribed to correct topic
3. Verify no firewall blocking port 1883

### No data in dashboard
1. Verify all three components running (broker, listener, simulator)
2. Check backend API at: http://localhost:8000/api/nodes
3. Check browser console for errors

## Customization

### Change Data Generation Interval
Edit `mqtt_simulator.py`, line ~300:
```python
simulator.start(interval=5)  # Change 5 to desired seconds
```

### Add More Nodes
Edit `mqtt_simulator.py`, modify `NODES_CONFIG` dict to add more pump/tank/tap nodes.

### Change Alert Thresholds
Edit `backend/main.py`, modify `apply_rules()` function for your specific thresholds.

### Connect Real MQTT Broker
In `mqtt_simulator.py` and `mqtt_listener.py`:
```python
MQTT_BROKER = "your.broker.ip"  # Change this
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│           Dashboard with Real-Time Metrics                   │
└────────────────────┬────────────────────────────────────────┘
                     │ Fetch /api/nodes, /api/alerts
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│         • Telemetry ingestion (/api/telemetry)              │
│         • Rule-based anomaly detection                       │
│         • Alert management                                   │
│         • Data persistence                                   │
└────────────────────▲────────────────────────────────────────┘
                     │ POST /api/telemetry (JSON)
                     │
┌─────────────────────┴────────────────────────────────────────┐
│              MQTT Listener (mqtt_listener.py)                │
│         • Subscribes to jalsense/nodes/#                    │
│         • Forwards messages to backend                       │
└────────────────────▲────────────────────────────────────────┘
                     │ MQTT Messages
                     │
┌─────────────────────┴────────────────────────────────────────┐
│          MQTT Broker (Mosquitto on Port 1883)               │
│         • Central message routing                            │
│         • Topic-based pub/sub                                │
└────────────────────▲────────────────────────────────────────┘
                     │ MQTT Publish
                     │
┌─────────────────────┴────────────────────────────────────────┐
│         MQTT Simulator (mqtt_simulator.py)                   │
│         • Generates realistic IoT data                       │
│         • Publishes to jalsense/nodes/pump-1, etc          │
│         • 5% anomaly injection rate                          │
└─────────────────────────────────────────────────────────────┘
```

## Features

✅ Real-time data simulation with random walk pattern
✅ Anomaly injection (5% chance per cycle)
✅ Multiple sensor types (pump, tank, water quality)
✅ MQTT pub/sub architecture
✅ Rule-based alert generation
✅ Dashboard live updates via REST API
✅ Multi-node support
✅ Extensible design for real IoT devices

## Next Steps

1. Test basic integration with current setup
2. Modify anomaly rates in `mqtt_simulator.py` if needed
3. Customize node names and locations
4. Connect real IoT devices by replacing simulator with actual MQTT publishers
5. Store historical data in database (PostgreSQL/MongoDB)
6. Add data persistence layer
