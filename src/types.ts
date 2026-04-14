export interface CalculationRecord {
  id: string;
  merchantName: string;
  subtotal: number;
  tax: number;
  tipPercent: number | null;
  tipFlat: number | null;
  tipAmount: number;
  grandTotal: number;
  guests: number;
  perPerson: number;
  createdAt: string;
}

export type TipMode = 'preset' | 'custom' | 'flat';
