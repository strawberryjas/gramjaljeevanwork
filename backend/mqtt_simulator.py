"""
MQTT Data Simulator for Jalsense - Real-time Water IoT Data
Generates realistic water supply system data and sends via MQTT broker
"""

import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime
import threading
from typing import Dict

# MQTT Configuration
MQTT_BROKER = "localhost"  # Change to your MQTT broker IP/hostname
MQTT_PORT = 1883
MQTT_TOPIC_PREFIX = "jalsense/nodes"

# Simulated Nodes Configuration with Complete Parameter Set
NODES_CONFIG = {
    "pump-1": {
        "name": "Main Borewell Pump",
        "type": "pump",
        "location": "Headworks",
        "metrics": {
            # ===== CATEGORY 1: INFRASTRUCTURE PERFORMANCE =====
            # Pump Parameters
            "pumpRunningHours": {"min": 100, "max": 500, "unit": "hours"},
            "pumpEfficiency": {"min": 65, "max": 85, "unit": "%"},
            "pumpDischargeRate": {"min": 20, "max": 60, "unit": "L/min"},
            "powerConsumption": {"min": 3.5, "max": 7.5, "unit": "kW"},
            "voltage": {"min": 220, "max": 240, "unit": "V"},
            "motorTemperature": {"min": 40, "max": 70, "unit": "°C"},
            
            # Pipe Network Parameters
            "flowRate": {"min": 15, "max": 55, "unit": "L/min"},
            "pressure": {"min": 1.0, "max": 4.0, "unit": "bar"},
            "flowDropIndicator": {"values": [0, 0, 0, 0, 1], "unit": "binary"},  # Leak
            "pressureLossIndicator": {"values": [0, 0, 0, 0, 1], "unit": "binary"},  # Burst
            
            # ===== CATEGORY 2: OPERATIONAL PARAMETERS =====
            "pumpStartCount": {"min": 5, "max": 20, "unit": "count/day"},
            "dailyPumpOperatingCost": {"min": 150, "max": 500, "unit": "₹"},
            "estimatedEnergyConsumed": {"min": 20, "max": 60, "unit": "kWh"},
            "dailyWaterProduction": {"min": 15000, "max": 45000, "unit": "liters"},
            
            # ===== CATEGORY 4: PREDICTIVE MAINTENANCE =====
            "dailyAverageFlow": {"min": 25, "max": 50, "unit": "L/min"},
            "pumpServiceDueDate": {"min": 30, "max": 90, "unit": "days"},
            "leakProbabilityScore": {"min": 0, "max": 100, "unit": "%"},
            
            # ===== ADDITIONAL =====
            "leakIndicator": {"values": [0, 0, 0, 1], "unit": "binary"},
        }
    },
    "tank-1": {
        "name": "Overhead Tank",
        "type": "tank",
        "location": "Village Centre",
        "metrics": {
            # ===== CATEGORY 1: INFRASTRUCTURE PERFORMANCE =====
            # Storage Tank Parameters
            "tankLevel": {"min": 20, "max": 100, "unit": "%"},
            "tankLevelLiters": {"min": 5000, "max": 25000, "unit": "L"},
            "tankFillingTime": {"min": 2, "max": 8, "unit": "hours"},
            "tankEmptinessHours": {"min": 0, "max": 12, "unit": "hours"},
            "supplyDurationFromTank": {"min": 2, "max": 18, "unit": "hours"},
            "tankTemperature": {"min": 25, "max": 35, "unit": "°C"},
            
            # Overflow & Alerts
            "overflowAlerts": {"min": 0, "max": 5, "unit": "count/week"},
            "tankOverflow": {"values": [0, 0, 0, 1], "unit": "binary"},
            
            # ===== CATEGORY 2: OPERATIONAL PARAMETERS =====
            "dailyWaterDistributed": {"min": 12000, "max": 40000, "unit": "liters"},
            "supplyHoursPerDay": {"min": 4, "max": 20, "unit": "hours"},
            "supplyCyclesPerDay": {"min": 1, "max": 4, "unit": "cycles"},
            "monthlyOMCost": {"min": 5000, "max": 15000, "unit": "₹"},
            
            # ===== CATEGORY 4: PREDICTIVE MAINTENANCE =====
            "tankServiceDueDate": {"min": 45, "max": 180, "unit": "days"},
            "unexpectedFillingDelays": {"min": 0, "max": 3, "unit": "count/week"},
        }
    },
    "tap-1": {
        "name": "Public Tap – Zone 1",
        "type": "tap",
        "location": "Street 1",
        "metrics": {
            # ===== CATEGORY 1: INFRASTRUCTURE PERFORMANCE =====
            # Valve Parameters
            "valveStatus": {"values": [0, 1], "unit": "0=closed/1=open"},  # 0=closed, 1=open
            "valveOperationTime": {"min": 0.5, "max": 4, "unit": "hours"},
            "faultyValveDetection": {"values": [0, 0, 0, 0, 1], "unit": "binary"},
            
            # ===== CATEGORY 3: WATER QUALITY PARAMETERS =====
            # Core Quality Parameters
            "ph": {"min": 6.8, "max": 8.2, "unit": "pH"},
            "turbidity": {"min": 0.3, "max": 2.5, "unit": "NTU"},
            "tds": {"min": 300, "max": 650, "unit": "mg/L"},
            "freeChlorine": {"min": 0.3, "max": 0.6, "unit": "mg/L"},
            "color": {"min": 0, "max": 5, "unit": "HCU"},
            "temperature": {"min": 20, "max": 28, "unit": "°C"},
            
            # Advanced Quality Parameters
            "iron": {"min": 0.05, "max": 0.25, "unit": "mg/L"},
            "fluoride": {"min": 0.4, "max": 1.2, "unit": "mg/L"},
            "nitrate": {"min": 5, "max": 35, "unit": "mg/L"},
            "hardness": {"min": 150, "max": 300, "unit": "mg/L as CaCO3"},
            "EC": {"min": 300, "max": 750, "unit": "µS/cm"},
            
            # Measurement Metadata
            "qualityTestTime": {"min": 0, "max": 24, "unit": "hour"},
            "qualitySamplingOperator": {"values": ["Op-001", "Op-002", "Op-003"], "unit": "operator_id"},
            
            # ===== CATEGORY 2: OPERATIONAL PARAMETERS =====
            "dailyInspectionDone": {"values": [0, 1], "unit": "binary"},
            "inspectionTime": {"min": 6, "max": 18, "unit": "hour"},
            
            # ===== CATEGORY 4: PREDICTIVE MAINTENANCE =====
            "waterQualityCompliancePercent": {"min": 70, "max": 100, "unit": "%"},
            "nextQualityTestDue": {"min": 3, "max": 14, "unit": "days"},
        }
    },
    "valve-1": {
        "name": "Main Distribution Valve",
        "type": "valve",
        "location": "Distribution Network",
        "metrics": {
            # ===== CATEGORY 1: INFRASTRUCTURE PERFORMANCE =====
            "valvePosition": {"min": 0, "max": 100, "unit": "%"},  # 0=fully closed, 100=fully open
            "valveOpenClosedStatus": {"values": [0, 1], "unit": "0=closed/1=open"},
            "valveOperationCount": {"min": 10, "max": 50, "unit": "operations/week"},
            "faultyValveDetection": {"values": [0, 0, 0, 0, 1], "unit": "binary"},
            "valveLeakage": {"min": 0, "max": 5, "unit": "L/hour"},
            
            # ===== CATEGORY 2: OPERATIONAL PARAMETERS =====
            "valveServiceDueDate": {"min": 30, "max": 120, "unit": "days"},
            "repairEvents": {"min": 0, "max": 2, "unit": "count/month"},
        }
    }
}

class DataSimulator:
    def __init__(self, broker=MQTT_BROKER, port=MQTT_PORT):
        self.broker = broker
        self.port = port
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.running = False
        self.anomaly_modes = {}  # Track anomalies per node
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"✓ Connected to MQTT broker at {self.broker}:{self.port}")
        else:
            print(f"✗ Failed to connect. Return code: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        if rc != 0:
            print(f"⚠ Unexpected disconnection. Return code: {rc}")
        else:
            print("✓ Disconnected from MQTT broker")
    
    def generate_metric_value(self, metric_config):
        """Generate a realistic metric value"""
        if "values" in metric_config:
            # Discrete values (like binary states)
            return random.choice(metric_config["values"])
        else:
            # Continuous values with some randomness
            min_val = metric_config["min"]
            max_val = metric_config["max"]
            # Add slight random walk for more realistic data
            value = random.uniform(min_val, max_val)
            return round(value, 2)
    
    def generate_node_data(self, node_id: str) -> Dict:
        """Generate realistic data for a node"""
        if node_id not in NODES_CONFIG:
            return None
        
        node_config = NODES_CONFIG[node_id]
        metrics = {}
        
        for metric_name, metric_config in node_config["metrics"].items():
            metrics[metric_name] = self.generate_metric_value(metric_config)
        
        # Introduce occasional anomalies
        if random.random() < 0.05:  # 5% chance per cycle
            self._introduce_anomaly(node_id, metrics)
        
        return {
            "nodeId": node_id,
            "metrics": metrics,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    
    def _introduce_anomaly(self, node_id: str, metrics: Dict):
        """Randomly introduce anomalies to test alerting"""
        node_config = NODES_CONFIG[node_id]
        node_type = node_config["type"]
        
        if node_type == "pump":
            anomaly = random.choice([
                lambda m: m.update({
                    "powerConsumption": random.uniform(8.0, 10.5),
                    "pumpDischargeRate": random.uniform(10, 20)
                }),  # Reduced efficiency
                lambda m: m.update({
                    "motorTemperature": random.uniform(76, 90),
                    "pumpRunningHours": m.get("pumpRunningHours", 200) + 5
                }),  # Overheating
                lambda m: m.update({"voltage": random.uniform(180, 200)}),  # Low voltage
                lambda m: m.update({
                    "flowDropIndicator": 1,
                    "leakProbabilityScore": random.uniform(70, 100)
                }),  # Leak detected
            ])
            anomaly(metrics)
        
        elif node_type == "tank":
            anomaly = random.choice([
                lambda m: m.update({
                    "tankLevel": random.uniform(5, 15),
                    "tankEmptinessHours": random.uniform(8, 16)
                }),  # Low level
                lambda m: m.update({
                    "tankLevel": random.uniform(96, 100),
                    "overflowAlerts": m.get("overflowAlerts", 0) + 1
                }),  # High level/overflow
                lambda m: m.update({
                    "unexpectedFillingDelays": m.get("unexpectedFillingDelays", 0) + 1
                }),  # Filling delay
            ])
            anomaly(metrics)
        
        elif node_type == "tap":
            anomaly = random.choice([
                lambda m: m.update({"turbidity": random.uniform(5.5, 8.0)}),  # High turbidity
                lambda m: m.update({"ph": random.uniform(4.0, 6.0)}),  # Low pH
                lambda m: m.update({"tds": random.uniform(1200, 1500)}),  # High TDS
                lambda m: m.update({"freeChlorine": random.uniform(0.05, 0.2)}),  # Low chlorine
                lambda m: m.update({"hardness": random.uniform(350, 500)}),  # High hardness
                lambda m: m.update({"EC": random.uniform(800, 1000)}),  # High EC
            ])
            anomaly(metrics)
        
        elif node_type == "valve":
            anomaly = random.choice([
                lambda m: m.update({
                    "faultyValveDetection": 1,
                    "valveOperationCount": m.get("valveOperationCount", 20) + 10
                }),  # Faulty valve
                lambda m: m.update({"valveLeakage": random.uniform(8, 15)}),  # Leaking valve
            ])
            anomaly(metrics)
    
    def publish_data(self):
        """Publish data for all nodes"""
        for node_id in NODES_CONFIG.keys():
            data = self.generate_node_data(node_id)
            if data:
                topic = f"{MQTT_TOPIC_PREFIX}/{node_id}"
                payload = json.dumps(data)
                result = self.client.publish(topic, payload, qos=1)
                
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    print(f"📤 Published data for {node_id}: {data['metrics']}")
                else:
                    print(f"✗ Failed to publish to {topic}: {result.rc}")
    
    def run_simulation(self, interval=5):
        """Run continuous data simulation"""
        print(f"Starting simulation with {interval}s interval...")
        try:
            while self.running:
                self.publish_data()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n⏹ Simulation stopped by user")
        finally:
            self.stop()
    
    def start(self, interval=5):
        """Start the simulator"""
        try:
            self.client.connect(self.broker, self.port, keepalive=60)
            self.client.loop_start()
            self.running = True
            
            # Run simulation in a separate thread
            sim_thread = threading.Thread(target=self.run_simulation, args=(interval,), daemon=True)
            sim_thread.start()
            
            # Keep main thread alive
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                self.stop()
        
        except Exception as e:
            print(f"✗ Error starting simulator: {e}")
            print("\nNote: Make sure you have an MQTT broker running!")
            print("Quick setup options:")
            print("1. Docker: docker run -d -p 1883:1883 eclipse-mosquitto")
            print("2. Or install locally: mosquitto")
    
    def stop(self):
        """Stop the simulator"""
        self.running = False
        self.client.loop_stop()
        self.client.disconnect()
        print("✓ Simulator stopped")


if __name__ == "__main__":
    print("=" * 60)
    print("Jalsense MQTT Data Simulator")
    print("=" * 60)
    
    simulator = DataSimulator()
    simulator.start(interval=5)  # Publish data every 5 seconds
