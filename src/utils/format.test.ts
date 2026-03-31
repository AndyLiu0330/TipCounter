import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats whole dollars', () => {
    expect(formatCurrency(10)).toBe('$10.00');
  });

  it('formats cents', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('rounds to two decimals', () => {
    expect(formatCurrency(10.556)).toBe('$10.56');
  });
});
