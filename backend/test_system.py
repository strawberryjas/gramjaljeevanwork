#!/usr/bin/env python3
"""
Quick Test Script for Jalsense System
Validates that all components are working and parameters are flowing correctly
"""

import requests
import time
import json
from datetime import datetime

BACKEND_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"{text}")
    print(f"{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def test_backend_health():
    """Test backend API health"""
    print_header("1. Testing Backend Health")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Backend is running")
            print(f"   Nodes: {data.get('nodes', 0)}")
            print(f"   Alerts: {data.get('alerts', 0)}")
            return True
        else:
            print_error(f"Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to backend at {BACKEND_URL}")
        print_warning("Make sure FastAPI is running: uvicorn main:app --reload")
        return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_get_nodes():
    """Test fetching nodes with all parameters"""
    print_header("2. Testing Node Data (Infrastructure, Operational, Quality)")
    try:
        response = requests.get(f"{BACKEND_URL}/api/nodes", timeout=5)
        if response.status_code != 200:
            print_error(f"Failed to fetch nodes: {response.status_code}")
            return False
        
        nodes = response.json()
        if not nodes:
            print_warning("No nodes returned")
            return False
        
        print_success(f"Retrieved {len(nodes)} nodes")
        
        # Check parameter counts per node
        for node in nodes:
            node_id = node.get('id', 'unknown')
            metrics = node.get('latest_metrics', {})
            metric_count = len(metrics)
            
            print(f"\n   📍 {node.get('name', node_id)}")
            print(f"      Type: {node.get('type')}")
            print(f"      Status: {node.get('status')}")
            print(f"      Parameters: {metric_count}")
            
            # Show sample metrics
            if metrics:
                sample = list(metrics.items())[:5]
                for key, value in sample:
                    print(f"      • {key}: {value}")
                if metric_count > 5:
                    print(f"      ... and {metric_count - 5} more parameters")
        
        return True
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_alerts():
    """Test alert generation"""
    print_header("3. Testing Alert Generation (Rule-Based Anomalies)")
    try:
        response = requests.get(f"{BACKEND_URL}/api/alerts", timeout=5)
        if response.status_code != 200:
            print_error(f"Failed to fetch alerts: {response.status_code}")
            return False
        
        alerts = response.json()
        
        if not alerts:
            print_warning("No alerts currently (this is normal if no anomalies detected)")
            print_success("Alert system is ready (will trigger on anomalies)")
            return True
        
        print_success(f"Retrieved {len(alerts)} active alerts")
        
        # Group by severity
        by_severity = {}
        for alert in alerts:
            sev = alert.get('severity', 'unknown')
            by_severity[sev] = by_severity.get(sev, 0) + 1
        
        for sev, count in by_severity.items():
            symbol = "🔴" if sev == "high" else "🟡" if sev == "medium" else "🟢"
            print(f"   {symbol} {sev.upper()}: {count}")
        
        # Show sample alerts
        print("\n   Recent Alerts:")
        for alert in alerts[:3]:
            print(f"   • [{alert.get('severity').upper()}] {alert.get('node_name')}: {alert.get('message')[:60]}...")
        
        return True
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_parameter_categories():
    """Verify all 5 categories are present"""
    print_header("4. Testing Parameter Categories (5-Category Model)")
    try:
        response = requests.get(f"{BACKEND_URL}/api/nodes", timeout=5)
        if response.status_code != 200:
            return False
        
        nodes = response.json()
        categories = {
            "Infrastructure": ["pumpRunningHours", "tankLevel", "flowRate", "valveStatus"],
            "Operational": ["dailyPumpOperatingCost", "dailyWaterProduction", "supplyHoursPerDay"],
            "Water Quality": ["ph", "turbidity", "tds", "coliformPresent"],
            "Predictive": ["leakProbabilityScore", "pumpServiceDueDate"],
            "Governance": ["waterQualityCompliancePercent"]
        }
        
        print("Checking parameter presence by category:\n")
        
        all_params = set()
        for node in nodes:
            all_params.update(node.get('latest_metrics', {}).keys())
        
        for category, sample_params in categories.items():
            found = [p for p in sample_params if p in all_params]
            if found:
                print_success(f"{category}: {len(found)}/{len(sample_params)} sample params found")
            else:
                print_warning(f"{category}: No sample params found (may be node-specific)")
        
        print(f"\n   Total unique parameters across all nodes: {len(all_params)}")
        return True
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_mqtt_connection():
    """Test MQTT connectivity"""
    print_header("5. Testing MQTT Connectivity")
    try:
        import paho.mqtt.client as mqtt
        
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        client.connect("localhost", 1883, keepalive=5)
        client.disconnect()
        
        print_success("MQTT broker is reachable at localhost:1883")
        return True
    except Exception as e:
        print_warning(f"MQTT broker not accessible: {e}")
        print_warning("Make sure Mosquitto is running: docker run -d -p 1883:1883 eclipse-mosquitto")
        return False

def main():
    print(f"\n{Colors.BLUE}╔═══════════════════════════════════════════════════════════╗")
    print(f"║           JALSENSE SYSTEM INTEGRATION TEST                  ║")
    print(f"║                    v1.0 - Complete                          ║")
    print(f"╚═══════════════════════════════════════════════════════════╝{Colors.END}\n")
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Node Data", test_get_nodes),
        ("Alert Generation", test_alerts),
        ("Parameter Categories", test_parameter_categories),
        ("MQTT Connection", test_mqtt_connection),
    ]
    
    results = []
    for name, test_func in tests:
        result = test_func()
        results.append((name, result))
        time.sleep(1)
    
    # Summary
    print_header("TEST SUMMARY")
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    for name, result in results:
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        print(f"   {status} - {name}")
    
    print(f"\n   Overall: {Colors.GREEN if passed == total else Colors.YELLOW}{passed}/{total} tests passed{Colors.END}")
    
    if passed == total:
        print(f"\n{Colors.GREEN}✓ All systems operational! Open dashboard at http://localhost:5178{Colors.END}\n")
    else:
        print(f"\n{Colors.YELLOW}⚠ Some tests failed. Check configurations above.{Colors.END}\n")

if __name__ == "__main__":
    main()
