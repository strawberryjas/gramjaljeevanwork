// Sample GeoJSON data for pipeline network in Padur, Chennai

export const samplePipelineData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2230, 12.9140],
          [80.2240, 12.9145],
          [80.2250, 12.9150],
          [80.2260, 12.9155]
        ]
      },
      properties: {
        id: "P-001",
        name: "Main Transmission Line",
        type: "pipeline",
        diameter: 300,
        material: "DI",
        pressure: 4.2,
        status: "operational",
        installDate: "2020-03-15"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2250, 12.9150],
          [80.2255, 12.9160],
          [80.2260, 12.9170],
          [80.2265, 12.9175]
        ]
      },
      properties: {
        id: "P-002",
        name: "Distribution Line - Ward 1",
        type: "pipeline",
        diameter: 150,
        material: "HDPE",
        pressure: 2.8,
        status: "operational",
        installDate: "2021-06-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2250, 12.9150],
          [80.2245, 12.9140],
          [80.2240, 12.9130],
          [80.2235, 12.9125]
        ]
      },
      properties: {
        id: "P-003",
        name: "Distribution Line - Ward 2",
        type: "pipeline",
        diameter: 150,
        material: "HDPE",
        pressure: 2.5,
        status: "warning",
        installDate: "2021-06-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2260, 12.9155],
          [80.2270, 12.9160],
          [80.2275, 12.9165]
        ]
      },
      properties: {
        id: "P-004",
        name: "Service Line - Block A",
        type: "pipeline",
        diameter: 50,
        material: "PVC",
        pressure: 1.8,
        status: "operational",
        installDate: "2022-01-20"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2250, 12.9150],
          [80.2250, 12.9140],
          [80.2250, 12.9130],
          [80.2250, 12.9120]
        ]
      },
      properties: {
        id: "P-005",
        name: "Distribution Line - Ward 3",
        type: "pipeline",
        diameter: 150,
        material: "DI",
        pressure: 1.2,
        status: "critical",
        alert: "Low pressure detected - Possible leak",
        installDate: "2020-11-05"
      }
    }
  ]
};

export const sampleInfrastructureData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2230, 12.9140]
      },
      properties: {
        id: "WTP-001",
        name: "Water Treatment Plant",
        type: "treatment_plant",
        status: "operational",
        capacity: 50000,
        installDate: "2019-08-01"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2250, 12.9150]
      },
      properties: {
        id: "TANK-001",
        name: "Overhead Tank - Central",
        type: "tank",
        status: "operational",
        capacity: 100000,
        currentLevel: 75,
        installDate: "2020-02-15"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2265, 12.9175]
      },
      properties: {
        id: "TANK-002",
        name: "Ground Storage Tank - North",
        type: "tank",
        status: "warning",
        capacity: 50000,
        currentLevel: 35,
        installDate: "2020-02-15"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2240, 12.9145]
      },
      properties: {
        id: "PUMP-001",
        name: "Booster Pump Station",
        type: "pump",
        status: "operational",
        capacity: 500,
        powerConsumption: 15,
        installDate: "2020-03-20"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2255, 12.9160]
      },
      properties: {
        id: "SENSOR-001",
        name: "Pressure Sensor - Ward 1",
        type: "sensor",
        status: "operational",
        value: 2.8,
        unit: "Bar",
        battery: 85,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2245, 12.9140]
      },
      properties: {
        id: "SENSOR-002",
        name: "Flow Sensor - Ward 2",
        type: "sensor",
        status: "operational",
        value: 125,
        unit: "L/min",
        battery: 72,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2260, 12.9155]
      },
      properties: {
        id: "SENSOR-003",
        name: "Pressure Sensor - Main Line",
        type: "sensor",
        status: "operational",
        value: 4.2,
        unit: "Bar",
        battery: 90,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2270, 12.9160]
      },
      properties: {
        id: "SENSOR-004",
        name: "Flow Sensor - Block A",
        type: "sensor",
        status: "operational",
        value: 45,
        unit: "L/min",
        battery: 68,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2250, 12.9140]
      },
      properties: {
        id: "SENSOR-005",
        name: "Pressure Sensor - Ward 3",
        type: "sensor",
        status: "operational",
        value: 1.2,
        unit: "Bar",
        battery: 55,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2235, 12.9125]
      },
      properties: {
        id: "SENSOR-006",
        name: "Flow Sensor - Ward 2 End",
        type: "sensor",
        status: "operational",
        value: 80,
        unit: "L/min",
        battery: 78,
        installDate: "2022-05-10"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2258, 12.9152]
      },
      properties: {
        id: "VALVE-001",
        name: "Control Valve - Main Junction",
        type: "valve",
        status: "operational",
        installDate: "2020-03-15"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [80.2250, 12.9130]
      },
      properties: {
        id: "ALERT-001",
        name: "Low Pressure Alert - Ward 3",
        type: "alert",
        status: "critical",
        alert: "Pressure dropped below threshold. Possible leak detected in Ward 3 distribution line.",
        installDate: "2024-11-26"
      }
    }
  ]
};
