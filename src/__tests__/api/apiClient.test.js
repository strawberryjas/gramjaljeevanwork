import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient, APIError } from '../../api/apiClient';

// Mock fetch globally
global.fetch = vi.fn();

describe('APIClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiClient.clearAuthToken();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Token Management', () => {
    it('sets and gets auth token', () => {
      const token = 'test-token-123';
      apiClient.setAuthToken(token);
      expect(apiClient.getAuthToken()).toBe(token);
    });

    it('clears auth token', () => {
      apiClient.setAuthToken('test-token');
      apiClient.clearAuthToken();
      expect(apiClient.getAuthToken()).toBeNull();
    });

    it('gets token from localStorage', () => {
      localStorage.setItem('auth_token', 'local-token');
      expect(apiClient.getAuthToken()).toBe('local-token');
    });

    it('gets token from sessionStorage', () => {
      sessionStorage.setItem('auth_token', 'session-token');
      expect(apiClient.getAuthToken()).toBe('session-token');
    });
  });

  describe('GET Requests', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockData,
      });

      const response = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(response.status).toBe('success');
      expect(response.data).toEqual(mockData);
    });

    it('includes auth token in headers when set', async () => {
      apiClient.setAuthToken('test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({}),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('POST Requests', () => {
    it('makes successful POST request with body', async () => {
      const requestData = { name: 'Test' };
      const responseData = { id: 1, ...requestData };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => responseData,
      });

      const response = await apiClient.post('/test', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );

      expect(response.status).toBe('success');
      expect(response.data).toEqual(responseData);
    });
  });

  describe('Error Handling', () => {
    it('throws APIError for non-ok responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(APIError);
    });

    it('handles network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('handles timeout errors', async () => {
      const controller = new AbortController();
      global.fetch.mockImplementationOnce(() => {
        controller.abort();
        return Promise.reject(new Error('AbortError'));
      });

      await expect(apiClient.get('/test')).rejects.toThrow();
    });
  });

  describe('Retry Logic', () => {
    it('retries on 500 errors', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: { get: () => 'application/json' },
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => 'application/json' },
          json: async () => ({ success: true }),
        });

      const response = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe('success');
    });

    it('does not retry on 400 errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Bad Request' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

