export function calcTip(
  subtotal: number,
  tipPercent: number | null,
  tipFlat: number | null
): number {
  if (tipFlat !== null) return tipFlat;
  if (tipPercent !== null) return subtotal * tipPercent / 100;
  return 0;
}

export function calcGrandTotal(
  subtotal: number,
  tax: number,
  tip: number
): number {
  return subtotal + tax + tip;
}

export function calcPerPerson(grandTotal: number, guests: number): number {
  return Math.round((grandTotal / guests) * 100) / 100;
}

export function calcRoundUpTip(subtotal: number, tax: number): number {
  const base = subtotal + tax;
  const rounded = Math.ceil(base);
  if (rounded === base) return 0;
  return Math.round((rounded - base) * 100) / 100;
}
