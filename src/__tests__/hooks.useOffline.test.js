import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOffline } from '../../hooks/useAppState';
import { AppContext } from '../../context/AppContext';
import React from 'react';

describe('useOffline Hook', () => {
  const mockContextValue = {
    offlineMode: false,
    lastSync: new Date().toISOString(),
    setLastSync: vi.fn(),
  };

  const wrapper = ({ children }) =>
    React.createElement(AppContext.Provider, { value: mockContextValue }, children);

  it('should return offline mode status', () => {
    const { result } = renderHook(() => useOffline(), { wrapper });
    expect(result.current.offlineMode).toBe(false);
  });

  it('should return last sync timestamp', () => {
    const { result } = renderHook(() => useOffline(), { wrapper });
    expect(result.current.lastSync).toBeDefined();
  });

  it('should handle offline mode transition', () => {
    const { result, rerender } = renderHook(() => useOffline(), {
      wrapper: ({ children }) =>
        React.createElement(
          AppContext.Provider,
          { value: { ...mockContextValue, offlineMode: true } },
          children
        ),
    });
    expect(result.current.offlineMode).toBe(true);
  });

  it('should call setLastSync', () => {
    const { result } = renderHook(() => useOffline(), { wrapper });
    act(() => {
      result.current.setLastSync(new Date().toISOString());
    });
    expect(mockContextValue.setLastSync).toHaveBeenCalled();
  });
});
