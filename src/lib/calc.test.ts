// src/lib/calc.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTip } from './calc';

describe('calculateTip', () => {
  it('computes tip, total, and per-person share', () => {
    const result = calculateTip({
      subtotal: 45.2,
      tax: 3.8,
      tipPercent: 18,
      people: 2,
    });
    expect(result.subtotal).toBe(45.2);
    expect(result.tax).toBe(3.8);
    expect(result.tip).toBeCloseTo(8.14, 2);
    expect(result.total).toBeCloseTo(57.14, 2);
    expect(result.perPerson).toBeCloseTo(28.57, 2);
  });

  it('handles zero tax', () => {
    const result = calculateTip({ subtotal: 100, tax: 0, tipPercent: 20, people: 1 });
    expect(result.tip).toBe(20);
    expect(result.total).toBe(120);
    expect(result.perPerson).toBe(120);
  });

  it('handles zero tip percent', () => {
    const result = calculateTip({ subtotal: 50, tax: 5, tipPercent: 0, people: 1 });
    expect(result.tip).toBe(0);
    expect(result.total).toBe(55);
  });

  it('splits across many people', () => {
    const result = calculateTip({ subtotal: 90, tax: 0, tipPercent: 10, people: 3 });
    expect(result.total).toBe(99);
    expect(result.perPerson).toBe(33);
  });
});
