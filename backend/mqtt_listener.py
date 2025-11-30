"""
MQTT Listener for Jalsense - Subscribes to MQTT topics and forwards to FastAPI backend
"""

import paho.mqtt.client as mqtt
import json
import requests
import threading
import time
from datetime import datetime

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC_PREFIX = "jalsense/nodes"
BACKEND_URL = "http://localhost:8000"  # FastAPI backend URL
TELEMETRY_ENDPOINT = f"{BACKEND_URL}/api/telemetry"

class MQTTListener:
    def __init__(self, broker=MQTT_BROKER, port=MQTT_PORT):
        self.broker = broker
        self.port = port
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.running = False
    
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"✓ Connected to MQTT broker at {self.broker}:{self.port}")
            # Subscribe to all nodes
            client.subscribe(f"{MQTT_TOPIC_PREFIX}/#", qos=1)
            print(f"✓ Subscribed to {MQTT_TOPIC_PREFIX}/#")
        else:
            print(f"✗ Failed to connect. Return code: {rc}")
    
    def on_message(self, client, userdata, msg):
        try:
            # Decode MQTT message
            payload = json.loads(msg.payload.decode())
            print(f"📥 Received from {msg.topic}: {payload}")
            
            # Forward to FastAPI backend
            self.forward_to_backend(payload)
        
        except json.JSONDecodeError:
            print(f"✗ Invalid JSON received: {msg.payload}")
        except Exception as e:
            print(f"✗ Error processing message: {e}")
    
    def on_disconnect(self, client, userdata, rc):
        if rc != 0:
            print(f"⚠ Unexpected disconnection. Return code: {rc}")
        else:
            print("✓ Disconnected from MQTT broker")
    
    def forward_to_backend(self, payload):
        """Send telemetry data to FastAPI backend"""
        try:
            response = requests.post(
                TELEMETRY_ENDPOINT,
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"✓ Data forwarded to backend: {response.json()}")
            else:
                print(f"✗ Backend returned status {response.status_code}: {response.text}")
        
        except requests.exceptions.ConnectionError:
            print(f"✗ Cannot reach backend at {BACKEND_URL}. Make sure FastAPI is running!")
        except Exception as e:
            print(f"✗ Error forwarding to backend: {e}")
    
    def start(self):
        """Start the MQTT listener"""
        try:
            print("Starting MQTT Listener...")
            self.client.connect(self.broker, self.port, keepalive=60)
            self.running = True
            self.client.loop_forever()
        
        except Exception as e:
            print(f"✗ Error starting listener: {e}")
            print("\nNote: Make sure you have an MQTT broker running!")
            print("Quick setup options:")
            print("1. Docker: docker run -d -p 1883:1883 eclipse-mosquitto")
            print("2. Or install locally: mosquitto")
    
    def stop(self):
        """Stop the listener"""
        self.running = False
        self.client.loop_stop()
        self.client.disconnect()
        print("✓ Listener stopped")


if __name__ == "__main__":
    print("=" * 60)
    print("Jalsense MQTT Listener")
    print("=" * 60)
    
    listener = MQTTListener()
    listener.start()
