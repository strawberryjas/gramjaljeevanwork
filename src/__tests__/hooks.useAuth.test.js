import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../hooks/useAppState'
import { AppContext } from '../../context/AppContext'
import React from 'react'

describe('useAuth Hook', () => {
  const mockContextValue = {
    user: { id: '1', name: 'Test User', role: 'technician' },
    isAuthenticated: true,
    authLoading: false,
    authError: null,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    setLoginError: vi.fn(),
  }

  const wrapper = ({ children }) =>
    React.createElement(
      AppContext.Provider,
      { value: mockContextValue },
      children
    )

  it('should return user when authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toEqual(mockContextValue.user)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should call logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.logout()
    })
    expect(mockContextValue.logout).toHaveBeenCalled()
  })

  it('should call login function with credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    const credentials = { email: 'test@example.com', password: 'password123' }
    act(() => {
      result.current.login(credentials)
    })
    expect(mockContextValue.login).toHaveBeenCalledWith(credentials)
  })

  it('should throw error when context not provided', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow()
    
    consoleError.mockRestore()
  })
})
