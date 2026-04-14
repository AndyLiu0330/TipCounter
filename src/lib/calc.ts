// src/lib/calc.ts
import { calcTip, calcGrandTotal, calcPerPerson } from '../utils/calculations';

export interface TipInput {
  subtotal: number;
  tax: number;
  tipPercent: number;
  people: number;
}

export interface TipResult {
  subtotal: number;
  tax: number;
  tipPercent: number;
  tip: number;
  total: number;
  perPerson: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateTip(input: TipInput): TipResult {
  const tip = round2(calcTip(input.subtotal, input.tipPercent, null));
  const total = round2(calcGrandTotal(input.subtotal, input.tax, tip));
  const perPerson = calcPerPerson(total, input.people);
  return {
    subtotal: round2(input.subtotal),
    tax: round2(input.tax),
    tipPercent: input.tipPercent,
    tip,
    total,
    perPerson,
  };
}
