/**
 * Code Splitting & Lazy Loading Utilities
 * Helps split large components into separate chunks for better performance.
 */

import React, { Suspense, lazy } from 'react';

/**
 * Fallback component while lazy component is loading
 */
const LazyFallback = ({ componentName = 'Component' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading {componentName}...</p>
    </div>
  </div>
);

/**
 * Wrapper to easily lazy load a component with Suspense
 * Usage: const LazyDashboard = createLazyComponent(() => import('./Dashboard'), 'Dashboard')
 */
export const createLazyComponent = (importFunc, componentName = 'Component') => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={<LazyFallback componentName={componentName} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Error boundary for catching errors in lazy components
 */
export class LazyComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading lazy component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Component</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrap lazy component with error boundary
 */
export const withLazyErrorBoundary = (LazyComponent) => (props) => (
  <LazyComponentErrorBoundary>
    <LazyComponent {...props} />
  </LazyComponentErrorBoundary>
);

/**
 * Preload a lazy component before it's needed
 * Useful for prefetching on link hover
 */
export const preloadLazyComponent = (importFunc) => {
  importFunc();
};

/**
 * Create a route-based lazy component wrapper
 */
export const createRouteLazyComponent = (importFunc, componentName = 'Route') => {
  return withLazyErrorBoundary(createLazyComponent(importFunc, componentName));
};

export default {
  LazyFallback,
  createLazyComponent,
  LazyComponentErrorBoundary,
  withLazyErrorBoundary,
  preloadLazyComponent,
  createRouteLazyComponent,
};
