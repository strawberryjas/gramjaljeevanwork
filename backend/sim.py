import time
import random
from datetime import datetime, timezone
import requests

BASE_URL = "http://localhost:8000/api/telemetry"

def rand(a, b):
    return random.uniform(a, b)

# We'll track running hours in memory just for demo
pump_running_minutes = 0

def simulate_pump():
    global pump_running_minutes

    # Decide mode: normal / dry_run / leak
    r = random.random()
    if r < 0.1:
        mode = "dry_run"
    elif r < 0.2:
        mode = "leak"
    else:
        mode = "normal"

    # Basic electrical + hydraulic behaviour
    if mode == "normal":
        flow = rand(10, 20)         # L/min
        pressure = rand(1.5, 2.5)   # bar
        current = rand(1.5, 3.0)    # A
        voltage = rand(210, 240)    # V
        motor_temp = rand(35, 60)   # °C
        leak_flag = 0
    elif mode == "dry_run":
        flow = rand(0.0, 0.5)
        pressure = rand(0.2, 0.8)
        current = rand(3.6, 4.5)
        voltage = rand(210, 240)
        motor_temp = rand(45, 80)
        leak_flag = 0
    else:  # leak
        flow = rand(25, 35)
        pressure = rand(0.3, 0.9)
        current = rand(2.0, 3.2)
        voltage = rand(210, 240)
        motor_temp = rand(40, 70)
        leak_flag = 1

    # Discharge & power for your dashboard
    pump_running_minutes += 0.0833  # ~5 seconds in hours
    running_hours = pump_running_minutes / 60.0  # hours today
    discharge = flow  # we’ll use flow as discharge proxy
    power_kw = (voltage * current) / 1000.0  # rough fake kW
    efficiency = rand(55, 75)  # % demo

    body = {
        "nodeId": "pump-1",
        "metrics": {
            "flow": round(flow, 2),
            "pressure": round(pressure, 2),
            "pumpCurrent": round(current, 2),
            "voltage": round(voltage, 1),
            "motorTemperature": round(motor_temp, 1),
            "pumpRunningHours": round(running_hours, 2),
            "pumpDischarge": round(discharge, 2),
            "pumpPower": round(power_kw, 2),
            "pumpEfficiency": round(efficiency, 1),
            "leakIndicator": leak_flag,
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    return body

def simulate_tank():
    # random walk tank level between 5 and 99
    level = rand(5, 99)

    # overflow flag
    overflow_flag = 1 if level > 95 else 0

    # simple “remaining supply duration” in minutes
    # assume full tank (~100%) gives 300 mins supply
    supply_duration = (level / 100.0) * 300.0

    body = {
        "nodeId": "tank-1",
        "metrics": {
            "tankLevel": round(level, 1),
            "tankOverflow": overflow_flag,
            "tankSupplyDuration": round(supply_duration, 1),
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    return body

def simulate_tap():
    # mostly safe, sometimes bad quality
    bad_quality_chance = 0.2

    if random.random() < bad_quality_chance:
        # out-of-range values for demo
        ph = rand(5.5, 9.5)
        turbidity = rand(5.5, 15.0)
        tds = rand(900, 2000)
        free_cl = rand(0.0, 0.8)
        water_temp = rand(15, 35)
        iron = rand(0.3, 1.5)
        fluoride = rand(1.5, 3.0)
        nitrate = rand(45, 100)
        hardness = rand(400, 900)
        coliform = 1
    else:
        # within BIS-ish acceptable ranges
        ph = rand(6.8, 7.6)
        turbidity = rand(0.2, 3.0)
        tds = rand(150, 750)
        free_cl = rand(0.2, 0.5)
        water_temp = rand(20, 30)
        iron = rand(0.0, 0.3)
        fluoride = rand(0.3, 1.0)
        nitrate = rand(0, 40)
        hardness = rand(80, 300)
        coliform = 0

    body = {
        "nodeId": "tap-1",
        "metrics": {
            "ph": round(ph, 2),
            "turbidity": round(turbidity, 2),
            "tds": round(tds, 1),
            "freeChlorine": round(free_cl, 2),
            "waterTemp": round(water_temp, 1),
            "iron": round(iron, 2),
            "fluoride": round(fluoride, 2),
            "nitrate": round(nitrate, 1),
            "hardness": round(hardness, 1),
            "coliformPresent": coliform
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    return body

def send(payload):
    try:
        r = requests.post(BASE_URL, json=payload, timeout=3)
        r.raise_for_status()
        print("OK:", payload["nodeId"], payload["metrics"])
    except Exception as e:
        print("ERROR sending", payload["nodeId"], e)

def main():
    print("Starting simulator → posting to", BASE_URL)
    while True:
        send(simulate_pump())
        send(simulate_tank())
        send(simulate_tap())
        time.sleep(5)

if __name__ == "__main__":
    main()
