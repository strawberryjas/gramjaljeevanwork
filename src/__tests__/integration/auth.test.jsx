import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContextProvider } from '../../context/AppContext';
import { LoginScreen } from '../../components/auth/LoginScreen';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProvider = (component) => {
    return render(<AppContextProvider>{component}</AppContextProvider>);
  };

  it('renders login screen', () => {
    renderWithProvider(<LoginScreen />);
    expect(screen.getByText(/Gram Jal Jeevan/i)).toBeInTheDocument();
  });

  it('allows guest login', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginScreen />);

    // Select guest role
    const guestOption = screen.getByText(/Guest|Public/i);
    await user.click(guestOption);

    // Find and click login button
    const loginButton = screen.getByRole('button', { name: /login|sign in/i });
    await user.click(loginButton);

    // Wait for navigation (would need router mock in real test)
    await waitFor(() => {
      expect(localStorage.getItem('gjj_user')).toBeTruthy();
    });
  });

  it('validates technician credentials', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginScreen />);

    // Select technician role
    const technicianOption = screen.getByText(/Technician/i);
    await user.click(technicianOption);

    // Enter credentials
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(usernameInput, 'tech');
    await user.type(passwordInput, 'admin');

    // Submit
    const loginButton = screen.getByRole('button', { name: /login|sign in/i });
    await user.click(loginButton);

    await waitFor(() => {
      const userData = localStorage.getItem('gjj_user');
      expect(userData).toBeTruthy();
      const parsed = JSON.parse(userData);
      expect(parsed.role).toBe('technician');
    });
  });

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginScreen />);

    // Select technician role
    const technicianOption = screen.getByText(/Technician/i);
    await user.click(technicianOption);

    // Enter wrong credentials
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(usernameInput, 'wrong');
    await user.type(passwordInput, 'wrong');

    // Submit
    const loginButton = screen.getByRole('button', { name: /login|sign in/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid|error/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginScreen />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show|hide/i });

    // Password should be hidden initially
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await user.click(toggleButton);

    // Password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
