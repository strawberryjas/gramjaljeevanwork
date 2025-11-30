/**
 * @typedef {'flow' | 'pressure' | 'quality'} SensorType
 * @typedef {'ok' | 'error' | 'warning'} SensorStatus
 */

/**
 * Represents a sensor node in the network
 * @typedef {Object} Sensor
 * @property {string} id - Unique identifier (e.g., 'S-101')
 * @property {number} value - Current reading
 * @property {SensorType} type - Type of measurement
 * @property {SensorStatus} status - Operational status
 * @property {string} [location] - Physical location description
 * @property {number} [battery] - Battery percentage (0-100)
 */

/**
 * Represents a physical pipe segment connecting two points
 * @typedef {Object} PipeSegment
 * @property {string} id - Unique segment ID (e.g., 'PIPE-A')
 * @property {string} inletSensorId - ID of sensor at start of pipe
 * @property {string} outletSensorId - ID of sensor at end of pipe
 * @property {number} lengthMeters - Physical length in meters
 * @property {Object} coordinates - SVG coordinates for drawing
 * @property {number} coordinates.x1
 * @property {number} coordinates.y1
 * @property {number} coordinates.x2
 * @property {number} coordinates.y2
 */

/**
 * Result from the leak analysis logic
 * @typedef {Object} AnalysisResult
 * @property {boolean} isLeaking - True if flow difference exceeds tolerance
 * @property {number} lossAmount - Absolute difference in flow
 * @property {string} colorCode - Hex color for visualization
 * @property {string} statusMessage - Human readable status
 */

export const MODELS = {}; // Export empty object to make this a valid module
