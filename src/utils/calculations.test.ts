import { describe, it, expect } from 'vitest';
import { calcTip, calcGrandTotal, calcPerPerson, calcRoundUpTip } from './calculations';

describe('calcTip', () => {
  it('calculates percentage tip', () => {
    expect(calcTip(50, 20, null)).toBe(10);
  });

  it('calculates percentage tip with decimals', () => {
    expect(calcTip(33.33, 18, null)).toBeCloseTo(6.0, 2);
  });

  it('returns flat tip when provided', () => {
    expect(calcTip(50, null, 8)).toBe(8);
  });

  it('returns 0 when no tip info', () => {
    expect(calcTip(50, null, null)).toBe(0);
  });

  it('returns 0 for zero subtotal', () => {
    expect(calcTip(0, 20, null)).toBe(0);
  });
});

describe('calcGrandTotal', () => {
  it('sums subtotal, tax, and tip', () => {
    expect(calcGrandTotal(50, 4.5, 10)).toBe(64.5);
  });

  it('works with zero tax', () => {
    expect(calcGrandTotal(50, 0, 10)).toBe(60);
  });

  it('works with zero tip', () => {
    expect(calcGrandTotal(50, 4.5, 0)).toBe(54.5);
  });
});

describe('calcPerPerson', () => {
  it('divides total by guests', () => {
    expect(calcPerPerson(60, 3)).toBe(20);
  });

  it('returns full total for 1 guest', () => {
    expect(calcPerPerson(60, 1)).toBe(60);
  });

  it('handles non-even splits', () => {
    expect(calcPerPerson(100, 3)).toBeCloseTo(33.33, 2);
  });
});

describe('calcRoundUpTip', () => {
  it('calculates tip to round total to next whole dollar', () => {
    expect(calcRoundUpTip(40, 5.63)).toBeCloseTo(0.37, 2);
  });

  it('returns 0 when subtotal + tax is already whole', () => {
    expect(calcRoundUpTip(40, 5)).toBe(0);
  });

  it('handles small remainders', () => {
    expect(calcRoundUpTip(30, 2.01)).toBeCloseTo(0.99, 2);
  });
});
