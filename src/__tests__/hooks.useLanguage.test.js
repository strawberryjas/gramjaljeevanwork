import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '../../hooks/useAppState';
import { AppContext } from '../../context/AppContext';
import React from 'react';

describe('useLanguage Hook', () => {
  const mockContextValue = {
    language: 'English',
    changeLanguage: vi.fn(),
  };

  const wrapper = ({ children }) =>
    React.createElement(AppContext.Provider, { value: mockContextValue }, children);

  it('should return current language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('English');
  });

  it('should call changeLanguage with new language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => {
      result.current.changeLanguage('Hindi');
    });
    expect(mockContextValue.changeLanguage).toHaveBeenCalledWith('Hindi');
  });

  it('should support all language options', () => {
    const languages = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil'];
    languages.forEach((lang) => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: ({ children }) =>
          React.createElement(
            AppContext.Provider,
            { value: { ...mockContextValue, language: lang } },
            children
          ),
      });
      expect(result.current.language).toBe(lang);
    });
  });
});
