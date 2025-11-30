/**
 * Feature Flags / Toggle System
 * Enables/disables features based on backend availability or rollout strategy.
 */

const FEATURE_FLAGS = {
  // Backend-dependent features
  BACKEND_AUTH: process.env.VITE_BACKEND_AUTH === 'true',
  BACKEND_PIPELINE_DATA: process.env.VITE_BACKEND_PIPELINE_DATA === 'true',
  BACKEND_SERVICE_REQUESTS: process.env.VITE_BACKEND_SERVICE_REQUESTS === 'true',
  BACKEND_ENERGY_MONITORING: process.env.VITE_BACKEND_ENERGY_MONITORING === 'true',

  // Frontend-only features (always enabled)
  VOICE_ASSISTANT: true,
  OFFLINE_MODE: true,
  MULTI_LANGUAGE: true,
  DARK_MODE: true,
  ACCESSIBILITY_MODE: true,

  // Beta / experimental features
  BETA_ANALYTICS: process.env.VITE_BETA_ANALYTICS === 'true',
  BETA_ADVANCED_MAPPING: process.env.VITE_BETA_ADVANCED_MAPPING === 'true',

  // Debugging features
  DEBUG_MODE: process.env.VITE_DEBUG_MODE === 'true',
  MOCK_API: process.env.VITE_USE_MSW === 'true',
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return FEATURE_FLAGS[featureName] || false;
};

/**
 * Get all feature flags
 */
export const getFeatureFlags = () => {
  return { ...FEATURE_FLAGS };
};

/**
 * Enable a feature (runtime toggle)
 */
export const enableFeature = (featureName) => {
  FEATURE_FLAGS[featureName] = true;
};

/**
 * Disable a feature (runtime toggle)
 */
export const disableFeature = (featureName) => {
  FEATURE_FLAGS[featureName] = false;
};

/**
 * Toggle a feature
 */
export const toggleFeature = (featureName) => {
  FEATURE_FLAGS[featureName] = !FEATURE_FLAGS[featureName];
  return FEATURE_FLAGS[featureName];
};

/**
 * Get backend status
 */
export const getBackendStatus = () => ({
  authReady: isFeatureEnabled('BACKEND_AUTH'),
  pipelineDataReady: isFeatureEnabled('BACKEND_PIPELINE_DATA'),
  serviceRequestsReady: isFeatureEnabled('BACKEND_SERVICE_REQUESTS'),
  energyMonitoringReady: isFeatureEnabled('BACKEND_ENERGY_MONITORING'),
  allBackendReady:
    isFeatureEnabled('BACKEND_AUTH') &&
    isFeatureEnabled('BACKEND_PIPELINE_DATA') &&
    isFeatureEnabled('BACKEND_SERVICE_REQUESTS') &&
    isFeatureEnabled('BACKEND_ENERGY_MONITORING'),
});

/**
 * Hook-like function to use feature flags in components
 * Usage: if (useFeature('VOICE_ASSISTANT')) { ... }
 */
export const useFeature = (featureName) => {
  return isFeatureEnabled(featureName);
};

export default FEATURE_FLAGS;
