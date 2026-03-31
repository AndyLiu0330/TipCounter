import { formatCurrency } from '../utils/format';

interface ResultsDisplayProps {
  tipAmount: number;
  grandTotal: number;
  perPerson: number;
  guests: number;
}

export default function ResultsDisplay({ tipAmount, grandTotal, perPerson, guests }: ResultsDisplayProps) {
  return (
    <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 space-y-2 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">Tip</span>
        <span>{formatCurrency(tipAmount)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
      {guests > 1 && (
        <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
          <span>Per person ({guests})</span>
          <span>{formatCurrency(perPerson)}</span>
        </div>
      )}
    </div>
  );
}
