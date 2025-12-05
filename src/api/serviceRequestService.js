/**
 * Service Request & Help Desk Service
 * Handles service requests, complaints, and help desk operations.
 */

import { apiClient } from './apiClient';

class ServiceRequestService {
  /**
   * Create a new service request
   */
  static async createRequest(requestData) {
    try {
      const response = await apiClient.post('/service-requests', requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all service requests (with filters)
   */
  static async getRequests(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/service-requests?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service request details
   */
  static async getRequest(requestId) {
    try {
      const response = await apiClient.get(`/service-requests/${requestId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service request
   */
  static async updateRequest(requestId, updateData) {
    try {
      const response = await apiClient.put(`/service-requests/${requestId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change request status (e.g., OPEN -> IN_PROGRESS -> RESOLVED)
   */
  static async updateStatus(requestId, status, notes = '') {
    try {
      const response = await apiClient.patch(`/service-requests/${requestId}/status`, {
        status,
        notes,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign technician to request
   */
  static async assignTechnician(requestId, technicianId) {
    try {
      const response = await apiClient.post(`/service-requests/${requestId}/assign`, {
        technicianId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add comment/note to request
   */
  static async addComment(requestId, comment) {
    try {
      const response = await apiClient.post(`/service-requests/${requestId}/comments`, { comment });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload attachment to request
   */
  static async uploadAttachment(requestId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${apiClient.baseURL}/service-requests/${requestId}/attachments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiClient.getAuthToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Rate/review completed request
   */
  static async rateRequest(requestId, rating, feedback) {
    try {
      const response = await apiClient.post(`/service-requests/${requestId}/rate`, {
        rating,
        feedback,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get request statistics and analytics
   */
  static async getStatistics(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/service-requests/statistics?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export requests to CSV
   */
  static async exportRequests(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/service-requests/export/csv?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default ServiceRequestService;
