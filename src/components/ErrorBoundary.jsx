import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary - Catches React errors and displays a user-friendly error page
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * Usage:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error info for display
    this.setState({
      errorInfo: errorInfo,
    });

    // Send to error monitoring service (Sentry, etc.)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReload = () => {
    // Clear error state and reload page
    window.location.reload();
  };

  handleGoHome = () => {
    // Clear error state and navigate to home
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-50 rounded p-4 text-xs font-mono text-red-600 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 transition-opacity"
                style={{
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--bg-white)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 transition-colors"
                style={{
                  backgroundColor: 'var(--gray-light)',
                  color: 'var(--gray-text-dark)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gray-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--gray-light)')}
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <p className="mt-6 text-xs text-gray-500">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
