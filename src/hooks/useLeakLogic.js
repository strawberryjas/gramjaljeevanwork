import React from 'react';

/**
 * Hook to analyze flow difference between two points
 * @param {number} inletVal - Flow rate at start of pipe
 * @param {number} outletVal - Flow rate at end of pipe
 * @param {number} tolerance - Allowable difference before flagging leak (default 5.0)
 * @returns {import('../data/models').AnalysisResult}
 */
export const useLeakLogic = (inletVal, outletVal, tolerance = 5.0) => {
  const diff = inletVal - outletVal;
  const lossAmount = Math.max(0, diff); // Assume no backflow generation for simplicity
  const isLeaking = lossAmount > tolerance;

  // Visual constants
  const COLOR_SAFE = '#3b82f6'; // Blue-500
  const COLOR_LEAK = '#ef4444'; // Red-500
  const COLOR_WARNING = '#f59e0b'; // Amber-500

  let colorCode = COLOR_SAFE;
  let statusMessage = 'Optimal Flow';

  if (isLeaking) {
    if (lossAmount > tolerance * 2) {
      colorCode = COLOR_LEAK;
      statusMessage = 'Critical Leak Detected';
    } else {
      colorCode = COLOR_WARNING;
      statusMessage = 'Potential Leak';
    }
  }

  return {
    isLeaking,
    lossAmount,
    colorCode,
    statusMessage
  };
};

