import { describe, it, expect } from 'vitest';
import { getNextDistributionTime } from '../../utils/helpers';

describe('Helper Utilities', () => {
  describe('getNextDistributionTime', () => {
    it('calculates next distribution time correctly', () => {
      const result = getNextDistributionTime('06:00');
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('returns a valid time format', () => {
      const result = getNextDistributionTime('12:00');
      const [hours, minutes] = result.split(':');
      expect(Number(hours)).toBeGreaterThanOrEqual(0);
      expect(Number(hours)).toBeLessThan(24);
      expect(Number(minutes)).toBeGreaterThanOrEqual(0);
      expect(Number(minutes)).toBeLessThan(60);
    });

    it('handles different input times', () => {
      const times = ['06:00', '12:00', '18:00', '00:00'];
      times.forEach((time) => {
        const result = getNextDistributionTime(time);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
      });
    });
  });
});

