// bot/format.ts
import type { TipResult } from '../src/lib/calc';

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function formatResult(r: TipResult, people: number): string {
  const lines = [
    '─────────────────',
    `Subtotal:   ${money(r.subtotal)}`,
    `Tax:        ${money(r.tax)}`,
    `Tip (${r.tipPercent}%): ${money(r.tip)}`,
    '─────────────────',
    `Total:      ${money(r.total)}`,
  ];
  if (people > 1) {
    lines.push(`Per person (${people}): ${money(r.perPerson)}`);
  }
  return lines.join('\n');
}
