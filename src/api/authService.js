/**
 * Authentication Service
 * Handles login, logout, token management, and user state.
 */

import { apiClient } from './apiClient';

class AuthService {
  /**
   * Login user with credentials
   * @param {string} email - User email or username
   * @param {string} password - User password
   * @param {string} language - Selected language
   * @returns {Promise} User data and token
   */
  static async login(email, password, language = 'English') {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        language,
      });

      if (response.data.token) {
        apiClient.setAuthToken(response.data.token);
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      apiClient.clearAuthToken();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh', {});
      if (response.data.token) {
        apiClient.setAuthToken(response.data.token);
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userData) {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
