/**
 * Centralized API Client
 * Handles all HTTP requests, error handling, retry logic, and response transformation.
 * Ready for backend integration.
 */

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * API Base Configuration
 */
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: DEFAULT_TIMEOUT,
  retryAttempts: MAX_RETRIES,
};

/**
 * Response envelope format - standardize all API responses
 */
const createResponseEnvelope = (data, error = null, status = 'success') => ({
  data,
  error,
  status, // 'success' | 'error' | 'loading'
  timestamp: new Date().toISOString(),
});

/**
 * Error handler - normalize all error types
 */
class APIError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Exponential backoff retry logic
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isRetryable = error.statusCode >= 500 || error.statusCode === 408 || error.statusCode === 429;
      if (!isRetryable || i === retries - 1) break;
      const delay = RETRY_DELAY * Math.pow(2, i);
      await sleep(delay);
    }
  }
  throw lastError;
};

/**
 * Main API client with request/response interceptors
 */
class APIClient {
  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retryAttempts = config.retryAttempts;
    this.authToken = null;
  }

  /**
   * Set authentication token (called after login)
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Clear authentication token (called after logout)
   */
  clearAuthToken() {
    this.authToken = null;
  }

  /**
   * Get auth token from localStorage or sessionStorage
   */
  getAuthToken() {
    return this.authToken || localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Build headers with auth token
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Timeout wrapper for fetch
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      throw error;
    }
  }

  /**
   * Request handler with retry logic
   */
  async request(method, endpoint, body = null, customHeaders = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(customHeaders);

    const makeRequest = async () => {
      try {
        const response = await this.fetchWithTimeout(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          throw new APIError(
            data?.message || data?.error || `HTTP ${response.status}`,
            response.status,
            data
          );
        }

        return createResponseEnvelope(data, null, 'success');
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw new APIError(error.message, null, error);
      }
    };

    return retryWithBackoff(makeRequest, this.retryAttempts);
  }

  /**
   * GET request
   */
  async get(endpoint, customHeaders = {}) {
    return this.request('GET', endpoint, null, customHeaders);
  }

  /**
   * POST request
   */
  async post(endpoint, body, customHeaders = {}) {
    return this.request('POST', endpoint, body, customHeaders);
  }

  /**
   * PUT request
   */
  async put(endpoint, body, customHeaders = {}) {
    return this.request('PUT', endpoint, body, customHeaders);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body, customHeaders = {}) {
    return this.request('PATCH', endpoint, body, customHeaders);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, customHeaders = {}) {
    return this.request('DELETE', endpoint, null, customHeaders);
  }
}

// Export singleton instance
export const apiClient = new APIClient(API_CONFIG);

export { APIError, APIClient, createResponseEnvelope };
