// bot/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatResult } from './format';

describe('formatResult', () => {
  it('renders a full breakdown', () => {
    const out = formatResult({
      subtotal: 45.2,
      tax: 3.8,
      tipPercent: 18,
      tip: 8.14,
      total: 57.14,
      perPerson: 28.57,
    }, 2);
    expect(out).toContain('Subtotal');
    expect(out).toContain('$45.20');
    expect(out).toContain('Tax');
    expect(out).toContain('$3.80');
    expect(out).toContain('Tip (18%)');
    expect(out).toContain('$8.14');
    expect(out).toContain('Total');
    expect(out).toContain('$57.14');
    expect(out).toContain('Per person');
    expect(out).toContain('$28.57');
  });

  it('omits per-person line when only one person', () => {
    const out = formatResult({
      subtotal: 10, tax: 0, tipPercent: 10, tip: 1, total: 11, perPerson: 11,
    }, 1);
    expect(out).not.toContain('Per person');
  });
});
