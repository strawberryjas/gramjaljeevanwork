import { describe, it, expect } from 'vitest';
import { getNextDistributionTime } from '../../utils/helpers';

describe('Helper Utilities', () => {
  describe('getNextDistributionTime', () => {
    it('returns a valid distribution time string', () => {
      const result = getNextDistributionTime();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns one of the expected time formats', () => {
      const result = getNextDistributionTime();
      const validFormats = [
        'Today, 06:00 AM',
        'Live Now (Ends 09:00 AM)',
        'Today, 05:00 PM',
        'Live Now (Ends 07:00 PM)',
        'Tomorrow, 06:00 AM',
      ];
      expect(validFormats).toContain(result);
    });

    it('always returns a string value', () => {
      const result = getNextDistributionTime();
      expect(typeof result).toBe('string');
    });
  });
});
