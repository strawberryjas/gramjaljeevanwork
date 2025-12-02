from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, timezone

app = FastAPI(title="GJJ IoT Water Backend")

# ---------- CORS so React can talk to this ----------
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- In-memory data stores (for demo) ----------


class Node(BaseModel):
    id: str
    name: str
    type: str  # pump | tap | tank | valve
    location: str
    latest_metrics: Dict[str, float] = {}
    last_updated: Optional[datetime] = None
    status: str = "OK"  # OK | WARNING | CRITICAL


class Alert(BaseModel):
    id: int
    node_id: str
    node_name: str
    type: str      # leak | dry_run | quality | tank | generic | pump
    severity: str  # low | medium | high
    message: str
    created_at: datetime
    acknowledged: bool = False


class TelemetryIn(BaseModel):
    nodeId: str
    metrics: Dict[str, float]
    timestamp: Optional[datetime] = None


# some demo nodes you see in the UI
NODES: Dict[str, Node] = {
    "pump-1": Node(
        id="pump-1", name="Main Borewell Pump", type="pump", location="Headworks"
    ),
    "tank-1": Node(
        id="tank-1", name="Overhead Tank", type="tank", location="Village Centre"
    ),
    "tap-1": Node(
        id="tap-1", name="Public Tap – Zone 1", type="tap", location="Street 1"
    ),
}

ALERTS: List[Alert] = []
ALERT_COUNTER = 1

# ---------- Utility functions ----------


def _next_alert_id() -> int:
    global ALERT_COUNTER
    aid = ALERT_COUNTER
    ALERT_COUNTER += 1
    return aid


def create_alert(node: Node, alert_type: str, severity: str, message: str):
    alert = Alert(
        id=_next_alert_id(),
        node_id=node.id,
        node_name=node.name,
        type=alert_type,
        severity=severity,
        message=message,
        created_at=datetime.now(timezone.utc),
    )
    ALERTS.append(alert)
    print(
        f"[ALERT] {alert.type.upper()} ({alert.severity}) on {alert.node_name}: {alert.message}"
    )


def apply_rules(node: Node):
    """
    Comprehensive rule-based anomaly detection across all 5 categories.
    """
    m = node.latest_metrics
    node.status = "OK"

    # =====================================================
    # CATEGORY 1 & 2: PUMP RULES (Infrastructure + Operational)
    # =====================================================
    if node.type == "pump":
        flow = m.get("flowRate", 0.0)
        pressure = m.get("pressure", 0.0)
        motor_temp = m.get("motorTemperature")
        voltage = m.get("voltage")
        efficiency = m.get("pumpEfficiency")
        discharge = m.get("pumpDischargeRate", 0.0)
        power = m.get("powerConsumption", 0.0)
        leak_indicator = m.get("flowDropIndicator", 0)
        leak_score = m.get("leakProbabilityScore", 0)
        pump_hours = m.get("pumpRunningHours", 0)

        # 1) Dry run: high power, low discharge
        if power > 7.5 and discharge < 15:
            node.status = "CRITICAL"
            create_alert(node, "pump", "high",
                f"Possible dry-run: High power ({power:.1f}kW) but low discharge ({discharge:.1f}L/min)")

        # 2) Efficiency drop
        if efficiency is not None and efficiency < 60:
            node.status = "WARNING"
            create_alert(node, "pump", "medium",
                f"Pump efficiency dropped to {efficiency:.1f}% (normal: 65-85%)")

        # 3) High motor temperature
        if motor_temp is not None and motor_temp > 75:
            node.status = "CRITICAL"
            create_alert(node, "pump", "high",
                f"Motor overheating: {motor_temp:.1f}°C (critical > 75°C)")
        elif motor_temp is not None and motor_temp > 65:
            node.status = "WARNING"
            create_alert(node, "pump", "medium",
                f"Motor running hot: {motor_temp:.1f}°C (warning > 65°C)")

        # 4) Voltage issues
        if voltage is not None and (voltage < 200 or voltage > 250):
            node.status = "WARNING"
            create_alert(node, "pump", "medium",
                f"Abnormal voltage: {voltage:.1f}V (safe: 220-240V)")

        # 5) Leak detection (flow drop + pressure loss)
        if leak_indicator == 1 or leak_score > 70:
            node.status = "CRITICAL"
            create_alert(node, "leak", "high",
                f"LEAK DETECTED: Score={leak_score:.0f}%, Flow indicator={leak_indicator}")

        # 6) High pump running hours (predictive maintenance)
        if pump_hours > 450:
            node.status = "WARNING"
            create_alert(node, "pump", "medium",
                f"Pump service due: {pump_hours:.0f} hours (service every 300-400h)")

    # =====================================================
    # CATEGORY 1 & 2: TANK RULES
    # =====================================================
    if node.type == "tank":
        level = m.get("tankLevel")
        overflow = m.get("tankOverflow", 0)
        overflow_count = m.get("overflowAlerts", 0)
        filling_delays = m.get("unexpectedFillingDelays", 0)
        emptiness_hours = m.get("tankEmptinessHours", 0)

        # 1) Critically low level
        if level is not None and level < 15:
            node.status = "CRITICAL"
            create_alert(node, "tank", "high",
                f"CRITICAL: Tank level {level:.1f}% - Risk of supply interruption!")

        # 2) Very low level
        elif level is not None and level < 25:
            node.status = "WARNING"
            create_alert(node, "tank", "medium",
                f"Tank level low: {level:.1f}% - Monitor closely")

        # 3) Overflow situation
        if level is not None and level > 95:
            node.status = "WARNING"
            create_alert(node, "tank", "medium",
                f"Tank near overflow: {level:.1f}% - Check intake valve")

        # 4) Explicit overflow flag
        if overflow == 1:
            node.status = "WARNING"
            create_alert(node, "tank", "medium",
                f"OVERFLOW ALERT: Tank overflow detected - {overflow_count} this week")

        # 5) Unexpected filling delays (predictive)
        if filling_delays > 2:
            node.status = "WARNING"
            create_alert(node, "tank", "medium",
                f"Filling delays detected: {filling_delays} times - Check pump/pipes")

        # 6) Tank empty for too long
        if emptiness_hours > 10:
            node.status = "CRITICAL"
            create_alert(node, "tank", "high",
                f"Tank empty for {emptiness_hours:.1f} hours - Supply interrupted!")

    # =====================================================
    # CATEGORY 1, 2 & 3: VALVE & PIPE RULES
    # =====================================================
    if node.type == "valve":
        valve_status = m.get("valveOpenClosedStatus", 0)
        faulty = m.get("faultyValveDetection", 0)
        leakage = m.get("valveLeakage", 0)
        operation_count = m.get("valveOperationCount", 0)

        # 1) Faulty valve detection
        if faulty == 1:
            node.status = "CRITICAL"
            create_alert(node, "pump", "high",
                f"FAULTY VALVE: Increased operations ({operation_count}) - Valve likely jammed")

        # 2) Valve leakage
        if leakage > 5:
            node.status = "WARNING"
            create_alert(node, "leak", "medium",
                f"Valve leakage: {leakage:.1f} L/h - Replacement recommended")

        # 3) Excessive valve operations (indicating instability)
        if operation_count > 40:
            node.status = "WARNING"
            create_alert(node, "pump", "medium",
                f"Excessive valve operations: {operation_count}/week - Check control system")

    # =====================================================
    # CATEGORY 3: WATER QUALITY RULES (Tap/Quality Node)
    # =====================================================
    if node.type == "tap":
        ph = m.get("ph")
        turbidity = m.get("turbidity")
        tds = m.get("tds")
        chlorine = m.get("freeChlorine")
        iron = m.get("iron")
        fluoride = m.get("fluoride")
        nitrate = m.get("nitrate")
        hardness = m.get("hardness")
        ec = m.get("EC")
        compliance = m.get("waterQualityCompliancePercent", 100)

        quality_issues = []

        # CORE PARAMETERS (BIS Standards)
        if ph is not None and (ph < 6.5 or ph > 8.5):
            quality_issues.append(f"pH={ph:.2f} (normal: 6.5-8.5)")

        if turbidity is not None and turbidity > 5:
            quality_issues.append(f"Turbidity={turbidity:.2f} NTU (max: 1-5)")

        if tds is not None and tds > 1000:
            quality_issues.append(f"TDS={tds:.0f} mg/L (max: 500-1000)")

        if chlorine is not None and (chlorine < 0.2 or chlorine > 0.8):
            quality_issues.append(f"Chlorine={chlorine:.2f} mg/L (safe: 0.2-0.8)")

        # ADVANCED PARAMETERS
        if iron is not None and iron > 0.3:
            quality_issues.append(f"Iron={iron:.3f} mg/L (max: 0.3)")

        if fluoride is not None and fluoride > 1.5:
            quality_issues.append(f"Fluoride={fluoride:.2f} mg/L (max: 1.5)")

        if nitrate is not None and nitrate > 45:
            quality_issues.append(f"Nitrate={nitrate:.1f} mg/L (max: 45)")

        if hardness is not None and hardness > 600:
            quality_issues.append(f"Hardness={hardness:.0f} mg/L (max: 600)")

        # MICROBIAL CONTAMINATION (CRITICAL)
        if coliform is not None and coliform == 1:
            node.status = "CRITICAL"
            create_alert(node, "quality", "high",
                "🚨 COLIFORM DETECTED - MICROBIAL CONTAMINATION - WATER NOT SAFE!")

        # Report quality issues
        if quality_issues:
            node.status = "CRITICAL"
            msg = " | ".join(quality_issues)
            create_alert(node, "quality", "high",
                f"Water quality FAILED: {msg}")

        # Compliance tracking
        if compliance < 80:
            node.status = "WARNING"
            create_alert(node, "quality", "medium",
                f"Water quality compliance: {compliance:.0f}% (target: >90%)")


# ---------- API endpoints ----------


@app.get("/api/health")
def health():
    return {"status": "ok", "nodes": len(NODES), "alerts": len(ALERTS)}


@app.get("/api/nodes")
def get_nodes():
    """
    Used by frontend to display node list and latest metrics.
    """
    return [n.dict() for n in NODES.values()]


@app.get("/api/alerts")
def get_alerts(only_open: bool = Query(False, description="Filter only open alerts")):
    if only_open:
        data = [a for a in ALERTS if not a.acknowledged]
    else:
        data = ALERTS
    return [a.dict() for a in data]


@app.post("/api/alerts/{alert_id}/ack")
def ack_alert(alert_id: int):
    for alert in ALERTS:
        if alert.id == alert_id:
            alert.acknowledged = True
            return {"status": "acknowledged"}
    raise HTTPException(status_code=404, detail="Alert not found")


@app.post("/api/telemetry")
def ingest_telemetry(payload: TelemetryIn):
    """
    This is what the simulator (or real IoT gateway) will call.
    """
    node = NODES.get(payload.nodeId)
    if not node:
        raise HTTPException(status_code=404, detail="Unknown nodeId")

    ts = payload.timestamp or datetime.now(timezone.utc)

    # update node's latest metrics
    node.latest_metrics.update(payload.metrics)
    node.last_updated = ts

    # run rules / basic anomaly detection
    apply_rules(node)

    return {"status": "ingested", "nodeId": node.id, "timestamp": ts.isoformat()}

