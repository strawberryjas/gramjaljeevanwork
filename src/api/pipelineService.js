/**
 * Pipeline & Infrastructure Service
 * Handles all pipeline, sensor, valve, and tank data operations.
 */

import { apiClient } from './apiClient';

class PipelineService {
  /**
   * Get all pipelines for a scheme
   */
  static async getPipelines(schemeId) {
    try {
      const response = await apiClient.get(`/pipelines?scheme=${schemeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pipeline details
   */
  static async getPipeline(pipelineId) {
    try {
      const response = await apiClient.get(`/pipelines/${pipelineId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get real-time sensor data
   */
  static async getSensorData(schemeId, sensorId = null) {
    try {
      const endpoint = sensorId
        ? `/sensors/${sensorId}/data`
        : `/schemes/${schemeId}/sensors/data`;
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get historical sensor data
   */
  static async getSensorHistory(sensorId, startDate, endDate) {
    try {
      const response = await apiClient.get(
        `/sensors/${sensorId}/history?start=${startDate}&end=${endDate}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get valve status
   */
  static async getValves(schemeId) {
    try {
      const response = await apiClient.get(`/schemes/${schemeId}/valves`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Control valve (open/close/partial)
   */
  static async controlValve(valveId, action, metadata = {}) {
    try {
      const response = await apiClient.post(`/valves/${valveId}/control`, {
        action, // 'OPEN' | 'CLOSE' | 'PARTIAL'
        metadata,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tank status
   */
  static async getTankStatus(schemeId, tankId = null) {
    try {
      const endpoint = tankId
        ? `/tanks/${tankId}/status`
        : `/schemes/${schemeId}/tanks/status`;
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pump status
   */
  static async getPumpStatus(schemeId, pumpId = null) {
    try {
      const endpoint = pumpId
        ? `/pumps/${pumpId}/status`
        : `/schemes/${schemeId}/pumps/status`;
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Control pump (start/stop)
   */
  static async controlPump(pumpId, action, metadata = {}) {
    try {
      const response = await apiClient.post(`/pumps/${pumpId}/control`, {
        action, // 'START' | 'STOP'
        metadata,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get energy consumption data
   */
  static async getEnergyData(schemeId, timeRange = 'day') {
    try {
      const response = await apiClient.get(
        `/schemes/${schemeId}/energy?range=${timeRange}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get quality check data
   */
  static async getQualityData(schemeId) {
    try {
      const response = await apiClient.get(`/schemes/${schemeId}/quality`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Submit quality test result
   */
  static async submitQualityTest(schemeId, testData) {
    try {
      const response = await apiClient.post(
        `/schemes/${schemeId}/quality/test`,
        testData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get alarms and events
   */
  static async getAlarms(schemeId, filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(
        `/schemes/${schemeId}/alarms?${queryString}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Acknowledge alarm
   */
  static async acknowledgeAlarm(alarmId, notes = '') {
    try {
      const response = await apiClient.post(`/alarms/${alarmId}/acknowledge`, {
        notes,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default PipelineService;
